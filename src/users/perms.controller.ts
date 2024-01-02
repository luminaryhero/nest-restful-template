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
import { CheckRoles } from './commons/roles.decorator';
import { PagintionDto } from 'src/databases/dto/pagination.dto';

@CheckRoles('admin')
@Controller('perms')
export class PermsController {
  constructor(private readonly permsService: PermsService) {}

  @CheckDto('create')
  @Post()
  create(@Body() createPermDto: CreatePermDto) {
    return this.permsService.create(createPermDto);
  }

  @CheckDto()
  @Get()
  findAll(@Query() pagintionDto: PagintionDto) {
    return this.permsService.findAll(pagintionDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permsService.findOne(+id);
  }

  @CheckDto('update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermDto: UpdatePermDto) {
    return this.permsService.update(+id, updatePermDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permsService.remove(+id);
  }
}
