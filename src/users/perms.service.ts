import { Injectable } from '@nestjs/common';
import { CreatePermDto } from './dto/create-perm.dto';
import { UpdatePermDto } from './dto/update-perm.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Perm } from './entities/perm.entity';
import { PagintionDto } from 'src/databases/dto/pagination.dto';

@Injectable()
export class PermsService {
  constructor(
    @InjectRepository(Perm) private permsRepository: Repository<Perm>,
  ) {}

  async create(createPermDto: CreatePermDto) {
    return this.permsRepository.save(createPermDto);
  }

  async findAll(pagintionDto: PagintionDto) {
    const { limit = 10, page = 1 } = pagintionDto;
    return this.permsRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const item = await this.permsRepository.findOne({ where: { id } });
    if (!item) {
      throw new EntityNotFoundError(Perm, { id });
    }
    return item;
  }

  async update(id: number, updatePermDto: UpdatePermDto) {
    await this.permsRepository.update(id, updatePermDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.permsRepository.remove(item);
  }
}
