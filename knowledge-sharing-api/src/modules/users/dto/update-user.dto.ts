import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Username for the account',
    example: 'johndoe123',
    minLength: 3,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiProperty({
    description: 'User role',
    example: UserRole.EDITOR,
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: UserRole;
}
