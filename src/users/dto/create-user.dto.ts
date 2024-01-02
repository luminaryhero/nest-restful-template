import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update'] })
  username: string;

  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update'] })
  password: string;

  @IsBoolean({ always: true })
  @IsOptional({ always: true })
  isActive?: boolean;

  @IsArray({ always: true })
  @IsNumber({}, { each: true, always: true })
  @IsOptional({ always: true })
  roleIds?: number[];
}
