import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { QueueService } from '../queue/queue.service';
import { Event } from '../queue/types';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly queueService: QueueService,
  ) {}

  async create(createUserDto: CreateUserDto) {
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

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
