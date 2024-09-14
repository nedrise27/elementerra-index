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
import { HeliusService } from './helius.service';

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
    eventTopic: EventTopics,
    timestamp: number,
    user: string,
    guess: GuessModel,
  ) {
    const configuration = await this.eventsConfigurationModel.findOne({
      where: { guesser: user },
    });

    const foundElement = await this.elementModel.findOne({
      where: {
        id: guess.element,
      },
    });

    let element = foundElement?.name;

    if (_.isNil(element)) {
      const fetchedElement = await this.heliusService.getAssetById(
        guess.element,
      );
      element = fetchedElement?.content?.metadata?.name || guess.element;
    }

    const event: ForgeEvent = {
      eventTopic,
      timestamp,
      user,
      element,
      isSuccess: guess.isSuccess,
      preferHidden: !_.isNil(configuration) && !configuration.enableEvents,
      recipe: guess.recipe as [string, string, string, string],
    };

    return fetch(
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
  }
}
