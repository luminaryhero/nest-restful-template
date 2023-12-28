import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

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
}
