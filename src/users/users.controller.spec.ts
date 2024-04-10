import { Test, TestingModule } from '@nestjs/testing';
import { avatar, avatarHash, user } from '../utils';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { QueueService } from '../queue/queue.service';
import { MailService } from '../mail/mail.service';
import { AvatarService } from '../avatar/avatar.service';
import exp from 'constants';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAvatarService = {
    deleteByUserId: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: AvatarService,
          useValue: mockAvatarService,
        },
        { provide: MailService, useValue: { send: jest.fn() } },
        { provide: QueueService, useValue: { sendEvent: jest.fn() } },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user by a given data', async () => {
    jest.spyOn(mockUsersService, 'create').mockReturnValue(user);

    const { _id: _, ...dto } = user;

    const result = await controller.create(dto);

    expect(mockUsersService.create).toHaveBeenCalled();
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);

    expect(result).toEqual(user);
  });

  it('should find a user by a given id', async () => {
    const id = '1';

    jest.spyOn(mockUsersService, 'findOne').mockReturnValue(user);

    const result = await controller.findOne(id);

    expect(result).toEqual(user);
    expect(mockUsersService.findOne).toHaveBeenCalled();
    expect(mockUsersService.findOne).toHaveBeenCalledWith(+id);
  });

  it('should get the avatar hash of a user by provided user id', async () => {
    const userId = '1';

    jest.spyOn(mockUsersService, 'findOne').mockReturnValue(user);
    jest.spyOn(mockAvatarService, 'get').mockReturnValue(avatarHash);

    const result = await controller.getAvatar(userId);

    expect(result).toEqual(avatarHash);

    expect(mockUsersService.findOne).toHaveBeenCalled();
    expect(mockUsersService.findOne).toHaveBeenCalledWith(+userId);
    expect(mockUsersService.findOne).toHaveReturnedWith(user);

    expect(mockAvatarService.get).toHaveBeenCalled();
    expect(mockAvatarService.get).toHaveBeenCalledWith(user);
  });

  it('should delete the avatar of a user by provided user id', async () => {
    const userId = '1';

    jest
      .spyOn(mockUsersService, 'findOne')
      // we do this to mock the reqres user response format
      .mockReturnValue({ ...user, id: +userId });
    jest.spyOn(mockAvatarService, 'deleteByUserId').mockReturnValue(avatar);

    await controller.deleteAvatar(userId);

    expect(mockUsersService.findOne).toHaveBeenCalled();
    expect(mockUsersService.findOne).toHaveBeenCalledWith(+userId);
    expect(mockUsersService.findOne).toHaveReturnedWith(user);

    expect(mockAvatarService.deleteByUserId).toHaveBeenCalled();
    expect(mockAvatarService.deleteByUserId).toHaveBeenCalledWith(+userId);
  });
});
