import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { Event } from './queue/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(Event.UserCreated)
  handleUserCreated(@Payload() user: CreateUserDto) {
    console.log('Created a new user', user);
  }
}
