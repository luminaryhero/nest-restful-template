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

  @CheckPerms('perms:query')
  @CheckDto()
  @Get()
  findAll(@Query() pagintionDto: PagintionDto) {
    return this.permsService.findAll(pagintionDto);
  }

  @CheckPerms('perms:query')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permsService.findOne(+id);
  }

  @CheckPerms('perms:update')
  @CheckDto('update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermDto: UpdatePermDto) {
    return this.permsService.update(+id, updatePermDto);
  }

  @CheckPerms('perms:remove')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permsService.remove(+id);
  }
}
