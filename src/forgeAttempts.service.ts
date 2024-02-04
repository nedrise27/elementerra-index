import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ForgeAttempt, Element } from './models';
import { Order } from 'sequelize';
import { CompressedEvent, ParsedTransaction } from './dto/ParsedTransaction';
import * as _ from 'lodash';
import {
  ELEMENTERRA_PROGRAMM_ID,
  ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA,
} from './lib/constants';

@Injectable()
export class ForgeAttemptsService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
  ) {}

  public async processTransaction(
    transaction: ParsedTransaction,
  ): Promise<void> {
    if (!_.isNil(transaction.transactionError)) {
      return;
    }

    const tx = transaction.signature;
    if (_.isNil(tx)) {
      throw new InternalServerErrorException(
        'Could not get signature from transaction',
      );
    }

    const elementerra_instruction = transaction.instructions.find(
      (i) => i.programId === ELEMENTERRA_PROGRAMM_ID,
    );

    if (
      elementerra_instruction.data ===
      ELEMENTERRA_PROGRAM_CLAIM_PENDING_GUESS_DATA
    ) {
      const timestamp = transaction.timestamp;
      const slot = transaction.slot;
      const guesser = transaction.feePayer;

      // if no chest was given => failed
      let hasFailed = _.isNil(
        transaction.tokenTransfers.find((t) => t.toUserAccount === guesser),
      );
      // if not element was given => failed
      const compressedEvents: CompressedEvent[] | undefined = _.get(
        transaction.events,
        'compressed',
      );
      if (hasFailed && !_.isNil(compressedEvents)) {
        hasFailed = _.isNil(
          compressedEvents.find((e) => e.newLeafOwner === guesser),
        );
      }

      this.forgeAttemptModel.upsert({
        tx,
        timestamp,
        slot,
        guesser,
        hasFailed,
      });
    }
  }

  public async findAll(limit: number, offset: number): Promise<ForgeAttempt[]> {
    const defaultOrder: Order = [['slot', 'desc']];

    return this.forgeAttemptModel.findAll({
      include: Element,
      limit,
      offset,
      order: defaultOrder,
    });
  }
}
