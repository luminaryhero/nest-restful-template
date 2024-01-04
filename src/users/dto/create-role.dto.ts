import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ always: true })
  @IsOptional({ groups: ['update'] })
  name: string;

  @IsArray({ always: true })
  @IsNumber({}, { each: true, always: true })
  @IsOptional({ always: true })
  permIds: number[];
}
