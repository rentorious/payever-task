import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceName } from './types';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ServiceName.User,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('queue.url')],
            queue: configService.get<string>('queue.queueName'),
          },
        }),
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
