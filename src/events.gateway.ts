import { InternalServerErrorException } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  EVENTS_TOPIC = 'events';

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: any) {
    throw new InternalServerErrorException('Will be up again soon, sorry!');
    return data;
  }

  public async sendEvent(
    timestamp: number,
    playerAddress: string,
    event: string,
  ) {
    this.server.emit(this.EVENTS_TOPIC, { timestamp, playerAddress, event });
  }
}
