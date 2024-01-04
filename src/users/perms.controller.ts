import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PermsService } from './perms.service';
import { CreatePermDto } from './dto/create-perm.dto';
import { UpdatePermDto } from './dto/update-perm.dto';
import { CheckDto } from 'src/commons/validation.pipe';
import { PagintionDto } from 'src/databases/dto/pagination.dto';
import { CheckPerms } from './commons/perms.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('权限')
@Controller('perms')
export class PermsController {
  constructor(private readonly permsService: PermsService) {}

  /**
   * 批量创建
   */
  @CheckPerms('perms:create')
  @CheckDto('create')
  @Post()
  create(@Body() createPermDtos: CreatePermDto[]) {
    return this.permsService.create(createPermDtos);
  }

  /**
   * 分页
   */
  @CheckPerms('perms:query')
  @CheckDto()
  @Get()
  findAll(@Query() pagintionDto: PagintionDto) {
    const { limit = 10, page = 1 } = pagintionDto;
    return this.permsService.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  /**
   * 详情
   */
  @CheckPerms('perms:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permsService.findOne(+id);
  }

  /**
   * 更新
   */
  @CheckPerms('perms:update')
  @CheckDto('update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermDto: UpdatePermDto) {
    return this.permsService.update(+id, updatePermDto);
  }

  /**
   * 删除
   */
  @CheckPerms('perms:remove')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permsService.remove(+id);
  }
}
