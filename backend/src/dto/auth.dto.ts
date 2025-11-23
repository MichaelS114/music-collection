import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}

export class RegisterUserDto extends LoginUserDto {

}