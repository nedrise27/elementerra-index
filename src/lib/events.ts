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
