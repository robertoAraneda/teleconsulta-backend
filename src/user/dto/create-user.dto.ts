import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty() @IsString() run: string;

  @IsNotEmpty() @IsString() name: string;

  @IsNotEmpty() @IsString() lastname: string;

  @IsNotEmpty() @IsString() email: string;

  @IsNotEmpty() @IsString() password: string;
}
