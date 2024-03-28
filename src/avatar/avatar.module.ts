import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Avatar, AvatarSchema } from './entities/avatar.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Avatar.name, schema: AvatarSchema }]),
  ],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class DownloaderModule {}
