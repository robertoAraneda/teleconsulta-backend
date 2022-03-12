import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString() name: string;

  @IsString() lastname: string;

  @IsString() email: string;

  @IsString() password: string;
}
