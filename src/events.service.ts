import { Injectable } from '@nestjs/common';
import { EventTopics, ForgeEvent } from './lib/events';
import { GuessModel } from './models/Guess.model';
import { ELEMENTS_IDS } from './lib/elements';
import { ConfigureEventsRequest } from './requests/ConfigureEventsRequest';
import { ConfigureEventsResponse } from './responses/ConfigureEventsResponse';
import { InjectModel } from '@nestjs/sequelize';
import { EventsConfigurationModel } from './models/EventsConfiguration.model';
import * as _ from 'lodash';
import { Element } from './models/Element.model';
import {
  Element as ElementIDL,
  Guess,
} from '../clients/elementerra-program/accounts';
import { HeliusService } from './helius.service';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(EventsConfigurationModel)
    private readonly eventsConfigurationModel: typeof EventsConfigurationModel,
    @InjectModel(Element)
    private readonly elementModel: typeof Element,
    private readonly heliusService: HeliusService,
  ) {}

  public async configureEvents(
    configuration: ConfigureEventsRequest,
  ): Promise<ConfigureEventsResponse> {
    const found = await this.eventsConfigurationModel.findOne({
      where: { guesser: configuration.guesser },
    });

    if (!_.isNil(found)) {
      await this.eventsConfigurationModel.update(
        { enableEvents: configuration.enableEvents },
        { where: { guesser: configuration.guesser } },
      );
    } else {
      await this.eventsConfigurationModel.create({
        guesser: configuration.guesser,
        enableEvents: configuration.enableEvents,
      });
    }

    return new ConfigureEventsResponse();
  }

  public async sendForgeEvent(
    timestamp: number,
    guesser: string,
    guessModel: GuessModel,
  ) {
    const configuration = await this.eventsConfigurationModel.findOne({
      where: { guesser },
    });

    const foundElement = await this.elementModel.findOne({
      where: {
        id: guessModel.element,
      },
    });

    let element = foundElement?.name;
    if (_.isNil(foundElement)) {
      const fetchedElement = await ElementIDL.fetch(
        this.heliusService.connection,
        new PublicKey(guessModel.element),
      );
      element = fetchedElement?.name;
    }

    if (_.isNil(element)) {
      console.error(`Could not find element by id ${guessModel.element}`);
      element = 'UNKOWN';
    }

    let eventTopic = EventTopics.forging;
    if (guessModel.numberOfTimesTried === 1) {
      if (guessModel.isSuccess && guessModel.creator.toString() === guesser) {
        eventTopic = EventTopics.inventing;
      }

      if (!guessModel.isSuccess) {
        eventTopic = EventTopics.inventionAttempt;
      }
    }

    const event: ForgeEvent = {
      eventTopic,
      timestamp,
      user: guesser,
      element,
      isSuccess: guessModel.isSuccess,
      preferHidden: !_.isNil(configuration) && !configuration.enableEvents,
      recipe: guessModel.recipe as [string, string, string, string],
    };

    try {
      await fetch(
        `${process.env.WEBSOCKET_API_URL.replace(/\/$/, '')}/send-event`,
        {
          method: 'POST',
          headers: {
            authorization: process.env.PAIN_TEXT_PASSWORD,
            'content-type': 'application/json',
          },
          body: JSON.stringify(event),
        },
      );
    } catch (err) {
      console.error(`Error while sending websocket event. Error: '${err}'`);
    }
  }
}
