export enum EventTopics {
  inventing = 'inventing',
  inventionAttempt = 'inventionAttempt',
  forging = 'forging',
}

export class ForgeEvent {
  eventTopic: EventTopics;
  timestamp: number;
  user: string;
  event?: any;
  element: string;
  isSuccess: boolean;
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
