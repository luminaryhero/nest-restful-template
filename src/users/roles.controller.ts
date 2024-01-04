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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CheckDto } from 'src/commons/validation.pipe';
import { PagintionDto } from 'src/databases/dto/pagination.dto';
import { CheckRoles } from './commons/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('角色')
@CheckRoles('admin')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * 新增
   */
  @CheckDto('create')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * 分页
   */
  @CheckDto()
  @Get()
  findAll(@Query() pagintionDto: PagintionDto) {
    const { limit = 10, page = 1 } = pagintionDto;
    return this.rolesService.findAll({
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  /**
   * 详情
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  /**
   * 更新
   */
  @CheckDto('update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  /**
   * 删除
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
