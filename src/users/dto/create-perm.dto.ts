import { IsNotEmpty } from 'class-validator';

export class CreatePermDto {
  @IsNotEmpty({ always: true })
  name: string;
}
