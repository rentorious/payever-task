// rabbitmq.service.ts

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Event, ServiceName } from './types';

@Injectable()
export class QueueService {
  constructor(@Inject(ServiceName.User) private rabbitClient: ClientProxy) {}

  async sendEvent(event: Event, data: unknown) {
    await this.rabbitClient.emit(event, data);
  }
}
