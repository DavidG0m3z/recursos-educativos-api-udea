import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { ResourcePosition } from './entities/resource-position.entity';
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
    private readonly positionRepository: Repository<Position>,
    @InjectRepository(ResourcePosition)
    private readonly resourcePositionRepository: Repository<ResourcePosition>,
  ) {}

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const { categoryIds, positions, complexityRefs, ...rest } = createResourceDto;

    const resource = this.resourceRepository.create({
      ...rest,
      // Pasamos complexityRefs separado para que TypeORM lo maneje correctamente
      complexityRefs: complexityRefs as any,
    });

    if (categoryIds?.length) {
      resource.categories = await this.categoryRepository.findByIds(categoryIds);
    }

    // Guardamos el recurso y obtenemos el id
    const savedResource = await this.resourceRepository.save(resource) as Resource;

    if (positions?.length) {
      for (const pos of positions) {
        const position = await this.positionRepository.findOne({
          where: { id: pos.positionId },
        });
        if (!position) {
          throw new NotFoundException(`Position with id ${pos.positionId} not found`);
        }
        const resourcePosition = this.resourcePositionRepository.create({
          resource: { id: savedResource.id },
          position,
          participation: pos.participation,
        });
        await this.resourcePositionRepository.save(resourcePosition);
      }
    }

    return await this.findOne(savedResource.id);
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

  async update(id: number, updateResourceDto: UpdateResourceDto): Promise<Resource> {
    const resource = await this.findOne(id);
    const { categoryIds, positions, ...rest } = updateResourceDto;

    if (categoryIds !== undefined) {
      resource.categories = categoryIds.length
        ? await this.categoryRepository.findByIds(categoryIds)
        : [];
    }

    Object.assign(resource, rest);
    await this.resourceRepository.save(resource);

    if (positions !== undefined) {
      await this.resourcePositionRepository.delete({ resource: { id } });

      for (const pos of positions) {
        const position = await this.positionRepository.findOne({
          where: { id: pos.positionId },
        });
        if (!position) {
          throw new NotFoundException(`Position with id ${pos.positionId} not found`);
        }
        const resourcePosition = this.resourcePositionRepository.create({
          resource,
          position,
          participation: pos.participation,
        });
        await this.resourcePositionRepository.save(resourcePosition);
      }
    }

    return await this.findOne(id);
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
