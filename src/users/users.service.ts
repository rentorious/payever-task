import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { ReqResUser, fetchUser } from 'src/reqres';
import { QueueService } from '../queue/queue.service';
import { Event } from '../queue/types';
import { UserCreateDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly queueService: QueueService,
  ) {}

  async create(createUserDto: UserCreateDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.first_name = createUserDto.first_name;
    user.last_name = createUserDto.last_name;
    const savedUser = await this.userRepository.save(user);

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
