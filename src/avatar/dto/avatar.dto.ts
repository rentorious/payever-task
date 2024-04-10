import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AvatarCreateDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  hash: string;
}

export class AvatarResponseDto {
  @IsNotEmpty()
  @IsString()
  hash!: string;
}
