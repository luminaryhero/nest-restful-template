import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PagintionDto } from 'src/databases/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const item = await this.usersRepository.save(createUserDto);
    return item;
  }

  async findAll(pagintionDto: PagintionDto) {
    const { limit = 10, page = 1 } = pagintionDto;
    return this.usersRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const item = await this.usersRepository.findOne({ where: { id } });
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
    const item = await this.usersRepository.findOneBy({ username });
    if (!item) {
      throw new EntityNotFoundError(User, { username });
    }
    return item;
  }
}
