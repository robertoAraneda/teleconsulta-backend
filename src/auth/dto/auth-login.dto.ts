import { IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty() run: string;

  @IsNotEmpty() password: string;
}
