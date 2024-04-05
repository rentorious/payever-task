import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { QueueModule } from 'src/queue/queue.module';
import { DownloaderModule } from 'src/avatar/avatar.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    QueueModule,
    MailModule,
    DownloaderModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
