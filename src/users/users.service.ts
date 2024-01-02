import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PagintionDto } from 'src/databases/dto/pagination.dto';
import { RolesService } from './roles.service';

@Injectable()
export class UsersService {
  @Inject()
  private readonly rolesService: RolesService;

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password, roleIds } = createUserDto;
    const item = await this.usersRepository.save({
      username,
      password,
      roles: await this.rolesService.findRoleByIds(roleIds),
    });
    return this.findOne(item.id);
  }

  async findAll(pagintionDto: PagintionDto) {
    const { limit = 10, page = 1 } = pagintionDto;
    return this.usersRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const item = await this.usersRepository.findOne({
      where: { id },
      relations: {
        roles: true,
      },
    });
    if (!item) {
      throw new EntityNotFoundError(User, { id });
    }
    return item;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.usersRepository.remove(item);
  }

  async findOneByName(username: string) {
    const item = await this.usersRepository.findOne({
      where: { username },
      relations: {
        roles: true,
      },
    });
    if (!item) {
      throw new EntityNotFoundError(User, { username });
    }
    return item;
  }

  async findPermsById(userId: number): Promise<string[]> {
    const { roles } = await this.findOne(userId);
    if (!roles || !roles.length) {
      return [];
    }
    const permNames = roles.reduce(
      (perv, next) => [...perv, ...next.perms.map((perm) => perm.name)],
      [],
    );

    return permNames;
  }
}
