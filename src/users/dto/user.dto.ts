import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;
}

export class UserResponseDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @IsOptional()
  @IsUrl()
  avatar: string;
}
