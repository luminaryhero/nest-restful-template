import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PagintionDto } from 'src/databases/dto/pagination.dto';
import { Repository, EntityNotFoundError, In } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const item = await this.rolesRepository.save(createRoleDto);
    return item;
  }

  async findAll(pagintionDto: PagintionDto) {
    const { limit = 10, page = 1 } = pagintionDto;
    return this.rolesRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const item = await this.rolesRepository.findOne({
      where: { id },
      relations: {
        perms: true,
      },
    });
    if (!item) {
      throw new EntityNotFoundError(Role, { id });
    }
    return item;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.rolesRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.rolesRepository.remove(item);
  }

  async findRoleByIds(roleIds: number[]) {
    if (!roleIds || !roleIds.length) return [];
    return this.rolesRepository.find({
      where: {
        id: In(roleIds),
      },
      relations: {
        perms: true,
      },
    });
  }

  async findPerms(id: number) {
    return this.rolesRepository.find({
      where: { id },
      relations: {
        perms: true,
      },
    });
  }
}
