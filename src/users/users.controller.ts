import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AvatarService } from '../avatar/avatar.service';
import { UserCreateDto, UserResponseDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly avatarService: AvatarService,
  ) {}

  @Post()
  async create(@Body() createUserDto: UserCreateDto): Promise<UserResponseDto> {
    const user = await this.userService.create(createUserDto);

    return plainToInstance(UserResponseDto, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findOne(+id);

    if (!user) {
      throw new NotFoundException('No user with given id');
    }

    return plainToInstance(UserResponseDto, user);
  }

  @Get(':id/avatar')
  async getAvatar(@Param('id') id: string): Promise<string> {
    const user = await this.userService.findOne(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.avatarService.get(user);
  }

  @Delete(':id/avatar')
  async deleteAvatar(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.avatarService.deleteByUserId(user.id);
  }
}
