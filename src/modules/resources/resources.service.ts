import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { ComplexityRef } from './entities/complexity-ref.entity';
import { Category } from '../categories/entities/category.entity';
import { Position } from '../position/entities/position.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Position)
    private readonly cargoRepository: Repository<Position>,
  ) {}

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const { categoryIds, positionIds, ...rest } = createResourceDto;

    const resource = this.resourceRepository.create(rest);

    if (categoryIds?.length) {
      resource.categories =
        await this.categoryRepository.findByIds(categoryIds);
    }

    if (positionIds?.length) {
      resource.position = await this.cargoRepository.findByIds(positionIds);
    }

    return await this.resourceRepository.save(resource);
  }

  async findAll(): Promise<Resource[]> {
    return await this.resourceRepository.find();
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }
    return resource;
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.findOne(id);
    const { categoryIds, positionIds, ...rest } = updateResourceDto;

    if (categoryIds?.length) {
      resource.categories =
        await this.categoryRepository.findByIds(categoryIds);
    }

    if (positionIds?.length) {
      resource.position = await this.cargoRepository.findByIds(positionIds);
    }

    Object.assign(resource, rest);
    return await this.resourceRepository.save(resource);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.resourceRepository.softDelete(id);
  }

  async restore(id: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }
    await this.resourceRepository.restore(id);
    return await this.findOne(id);
  }

  async toggleVisibility(id: number): Promise<Resource> {
    const resource = await this.findOne(id);
    resource.hidden = !resource.hidden;
    return await this.resourceRepository.save(resource);
  }
}
