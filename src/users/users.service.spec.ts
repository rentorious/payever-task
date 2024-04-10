import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { DownloaderModule } from '../avatar/avatar.module';
import { config } from '../config';
import db from '../config/db';
import queue from '../config/queue';
import { MailModule } from '../mail/mail.module';
import { QueueModule } from '../queue/queue.module';
import { closeMongoConnection, rootMongooseTestModule, user } from '../utils';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: [config, db, queue],
        }),
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        QueueModule,
        MailModule,
        DownloaderModule,
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await closeMongoConnection();
    mongoose.disconnect();
    mongoose.connection.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const newUser = await service.create(user);

      expect(newUser).toHaveProperty('_id');
    });

    it('should fail when missing dto property', async () => {
      delete user.first_name;

      expect(() => service.create(user)).rejects.toThrow();
    });

    it('should fail when inserting a duplicate', async () => {
      expect(async () => service.create(user)).rejects.toThrow();
    });

    it('should find user by id', async () => {
      const id = 1;
      const user = await service.findOne(id);

      expect(user).toHaveProperty('email');
    });

    it('should return null when user not found', async () => {
      const user = await service.findOne(100);

      expect(user).toEqual(null);
    });
  });
});
