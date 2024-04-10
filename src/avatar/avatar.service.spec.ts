import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Avatar, AvatarDocument } from './entities/avatar.entity';
import { Model } from 'mongoose';
import { avatar } from '../utils';

describe('UsersService', () => {
  let service: AvatarService;

  let mockAvatarModel: Model<AvatarDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ downloadDir: 'dir' })],
        }),
      ],
      providers: [
        AvatarService,
        ConfigService,
        {
          provide: getModelToken(Avatar.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
    mockAvatarModel = module.get<Model<AvatarDocument>>(
      getModelToken(Avatar.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('shoud find avar by user id', async () => {
    const userId = 1;

    jest.spyOn(mockAvatarModel, 'findOne').mockResolvedValue(avatar);

    const result = await service.findByUserId(userId);

    expect(result).toEqual(avatar);
    expect(mockAvatarModel.findOne).toHaveBeenCalled();
    expect(mockAvatarModel.findOne).toHaveBeenCalledWith({ userId });
  });
});
