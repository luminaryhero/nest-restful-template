import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update'] })
  firstName: string;

  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update'] })
  lastName: string;

  @IsBoolean({ always: true })
  @IsOptional({ always: true })
  isActive?: boolean;
}
