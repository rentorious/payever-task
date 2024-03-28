import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { ReqResUser, fetchUser } from 'src/reqres';
import { QueueService } from '../queue/queue.service';
import { Event } from '../queue/types';
import { UserCreateDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly queueService: QueueService,
  ) {}

  async create(createUserDto: UserCreateDto) {
    const user = new this.userModel(createUserDto);
    const savedUser = await user.save();

    const mailId = await this.mailService.send(
      savedUser.email,
      'Welcome',
      `Welcome ${user.first_name}`,
    );

    console.log(`Message sent with id ${mailId}`);

    this.queueService.sendEvent(Event.UserCreated, user);

    return savedUser;
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
