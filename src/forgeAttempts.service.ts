import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ForgeAttempt, Element } from './models';
import { Order } from 'sequelize';

@Injectable()
export class ForgeAttemptsService {
  constructor(
    @InjectModel(ForgeAttempt)
    private readonly forgeAttemptModel: typeof ForgeAttempt,
  ) {}

  async findAll(limit: number): Promise<ForgeAttempt[]> {
    const defaultOrder: Order = [['slot', 'desc']];

    return this.forgeAttemptModel.findAll({
      include: Element,
      limit,
      order: defaultOrder,
    });
  }
}
