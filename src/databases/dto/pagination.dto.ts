import { IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class PagintionDto {
  /**
   * 每页条数
   */
  @Transform(({ value }) => Number(value))
  @Min(1)
  @Max(30)
  @IsOptional()
  limit?: number;
  /**
   * 当前页数
   */
  @Transform(({ value }) => Number(value))
  @Min(1)
  @IsOptional()
  page?: number;
}
