import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { QueueModule } from '../queue/queue.module';
import { DownloaderModule } from '../avatar/avatar.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    QueueModule,
    MailModule,
    DownloaderModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
