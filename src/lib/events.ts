import { GuessModel } from 'src/models/Guess.model';

export enum EventTopics {
  forging = 'forging',
  inventing = 'inventing',
}

export class ForgeEvent {
  eventTopic: EventTopics;
  timestamp: number;
  user: string;
  event?: any;
  element: string;
  recipe: [string, string, string, string];
}

export async function sendWebsocketEvent(
  timestamp: number,
  user: string,
  event: string,
) {
  return fetch(process.env.WEBSOCKET_API_URL, {
    method: 'POST',
    headers: {
      authorization: process.env.PAIN_TEXT_PASSWORD,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      timestamp,
      user,
      event,
    }),
  });
}

export async function sendForgeEvent(
  eventTopic: EventTopics,
  timestamp: number,
  user: string,
  guess: GuessModel,
) {
  const event: ForgeEvent = {
    eventTopic,
    timestamp,
    user,
    element: guess.element,
    recipe: guess.recipe as [string, string, string, string],
  };
  console.log(
    `Send event: ${JSON.stringify(event, null, 0)} to elementerra-events`,
  );

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
