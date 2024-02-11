import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as _ from 'lodash';
import { Server } from 'ws';

type FeedEvent = {
  hash: string;
  timestamp: number;
  playerAddress: string;
  event: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  EVENTS_QUEUE: FeedEvent[] = [];
  MAX_QUEUE_LENGTH = 100;
  EVENTS_TOPIC = 'events';

  handleConnection(client: any) {
    client.emit(this.EVENTS_TOPIC, this.EVENTS_QUEUE);
  }

  public async sendEvent(
    timestamp: number,
    playerAddress: string,
    event: string,
  ) {
    const hash = `${timestamp}${playerAddress}${event}`;

    if (this.addToQueue(hash, timestamp, playerAddress, event)) {
      this.server.emit(this.EVENTS_TOPIC, { timestamp, playerAddress, event });
    }
  }

  private addToQueue(
    hash: string,
    timestamp: number,
    playerAddress: string,
    event: string,
  ) {
    if (!this.EVENTS_QUEUE.find((e) => e.hash === hash)) {
      if (
        _.isEmpty(this.EVENTS_QUEUE) ||
        _.last(this.EVENTS_QUEUE)!.timestamp < timestamp
      ) {
        this.EVENTS_QUEUE.push({ hash, timestamp, playerAddress, event });
        this.EVENTS_QUEUE = _.orderBy(this.EVENTS_QUEUE, 'timestamp', 'desc');

        if (this.EVENTS_QUEUE.length >= this.MAX_QUEUE_LENGTH) {
          this.EVENTS_QUEUE = this.EVENTS_QUEUE.slice(0, this.MAX_QUEUE_LENGTH);
        }

        if (_.first(this.EVENTS_QUEUE).hash === hash) {
          return true;
        }
      }
    }
    return false;
  }
}
