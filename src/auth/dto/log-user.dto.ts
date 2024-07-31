import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LogUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty({ message: 'Invalid password' })
  @MinLength(6, { message: 'Password is too short, need 6 characters min' })
  password: string;
}