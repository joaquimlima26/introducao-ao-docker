import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User name',
    example: 'Joaquim Lima'
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User email address',
    example: 'joaquim@gmail.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: 6,
    example: 'password123'
  })
  @IsString()
  @MinLength(6)
  password: string;

}