import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError, In, FindManyOptions } from 'typeorm';
import { Role } from './entities/role.entity';
import { Perm } from './entities/perm.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(Perm) private permsRepository: Repository<Perm>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { permIds = [] } = createRoleDto;
    const item = await this.rolesRepository.save({
      ...createRoleDto,
      perms: await this.permsRepository.find({
        where: {
          id: In(permIds),
        },
      }),
    });

    return this.findOne(item.id);
  }

  async findAll(options: FindManyOptions<Role>) {
    return this.rolesRepository.find(options);
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
