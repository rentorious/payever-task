import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { QueueService } from '../queue/queue.service';
import { Event } from '../queue/types';
import { ReqResUser, fetchUser } from '../reqres';
import { UserCreateDto } from './dto/user.dto';
import { User } from './entities/user.entity';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorCodes } from '../utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly queueService: QueueService,
  ) {}

  async create(dto: UserCreateDto) {
    try {
      const user = new this.userModel(dto);
      const savedUser = await user.save();

      const mailId = await this.mailService.send(
        savedUser.email,
        'Welcome',
        `Welcome ${user.first_name}`,
      );

      Logger.log(`Message sent with id ${mailId}`);

      this.queueService.sendEvent(Event.UserCreated, user);

      return savedUser;
    } catch (err) {
      if (err.code === ErrorCodes.DuplicateKey) {
        throw new UnprocessableEntityException('User already exists');
      }
      throw new UnprocessableEntityException('Failed to create a user');
    }
  }

  async findOne(id: number): Promise<ReqResUser | null> {
    try {
      const user = await fetchUser(id);

      return user;
    } catch {
      return null;
    }
  }
}
