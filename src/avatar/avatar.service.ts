import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { ReqResUser } from 'src/reqres';
import { AvatarCreateDto } from './dto/avatar.dto';
import { Avatar } from './entities/avatar.entity';

@Injectable()
export class AvatarService {
  private readonly downloadDir;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(Avatar.name) private readonly avatarModel: Model<Avatar>,
  ) {
    const dirName = config.get<string>('downloadDir');

    this.downloadDir = path.resolve(__dirname, '..', dirName);

    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir);
    }
  }

  async findByUserId(userId: number): Promise<Avatar | null> {
    return this.avatarModel.findOne({ userId });
  }

  async create(dto: AvatarCreateDto): Promise<Avatar | null> {
    const avatar = new this.avatarModel(dto);

    return avatar.save();
  }

  async deleteByUserId(userId: number) {
    const avatar = this.avatarModel.findOne({ userId });

    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    const filePath = path.resolve(this.downloadDir, userId.toString());

    try {
      await fs.promises.unlink(filePath);
    } catch {
      throw new NotFoundException('File not found');
    }

    return this.avatarModel.deleteOne({ userId });
  }

  async get(user: ReqResUser): Promise<string> {
    const avatar = await this.findByUserId(user.id);

    if (avatar) {
      return avatar.hash;
    }

    const buffer = await this.download(user);
    const hash = buffer.toString('base64');

    await this.create({ userId: user.id, hash });

    return hash;
  }

  async download(user: ReqResUser): Promise<Buffer> {
    const filePath = path.resolve(this.downloadDir, user.id.toString());

    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url: user.avatar,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(this.downloadDir));
      writer.on('error', reject);
    });

    return fs.promises.readFile(filePath);
  }
}
