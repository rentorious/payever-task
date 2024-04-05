import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { Avatar } from './entities/avatar.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
  providers: [AvatarService],
  exports: [AvatarService],
})
export class DownloaderModule {}
