import { Injectable } from '@nestjs/common';
import { CreatePermDto } from './dto/create-perm.dto';
import { UpdatePermDto } from './dto/update-perm.dto';
import { EntityNotFoundError, FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Perm } from './entities/perm.entity';

@Injectable()
export class PermsService {
  constructor(
    @InjectRepository(Perm) private permsRepository: Repository<Perm>,
  ) {}

  async create(createPermDtos: CreatePermDto[]) {
    const items = await this.permsRepository.save(createPermDtos);
    return this.permsRepository.find({
      where: {
        id: In(items.map((item) => item.id)),
      },
    });
  }

  async findAll(options?: FindManyOptions<Perm>) {
    return this.permsRepository.find(options);
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
