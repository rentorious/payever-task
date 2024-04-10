import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { ReqResUser } from 'src/reqres';
import { AvatarCreateDto } from './dto/avatar.dto';
import { Avatar } from './entities/avatar.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AvatarService {
  private readonly dirName;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(Avatar.name)
    private readonly avatarModel: Model<Avatar>,
  ) {
    this.dirName = config.get<string>('downloadDir');
    const downloadDir = this.getDownloadDir();

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
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
    const avatar = await this.findByUserId(userId);

    if (!avatar) {
      throw new NotFoundException('Avatar not found');
    }

    const filePath = path.resolve(this.getDownloadDir(), userId.toString());

    this.deleteFile(filePath);

    await this.avatarModel.deleteOne({ userId });

    return avatar;
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
    const filePath = path.resolve(this.dirName, user.id.toString());

    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url: user.avatar,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', () => {});
      writer.on('error', reject);
    });

    return fs.promises.readFile(filePath);
  }

  protected getDownloadDir() {
    return path.resolve(__dirname, '..', this.dirName);
  }

  protected async deleteFile(filePath: string) {
    try {
      await fs.promises.unlink(filePath);
    } catch {
      throw new NotFoundException('File not found');
    }
  }
}
