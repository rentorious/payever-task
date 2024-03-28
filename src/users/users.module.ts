import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    QueueModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
