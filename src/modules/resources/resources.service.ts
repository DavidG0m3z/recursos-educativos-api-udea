import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource } from './entities/resource.entity';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) {}

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const resource = this.resourceRepository.create(createResourceDto);
    return await this.resourceRepository.save(resource);
  }

  async findAll(): Promise<Resource[]> {
    // find() automáticamente excluye los registros con deletedAt != NULL
    // No necesitamos hacer nada extra, TypeORM lo maneja solo
    return await this.resourceRepository.find();
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException(`Recurso con id ${id} no encontrado`);
    }

    return resource;
  }

  async update(id: number, updateResourceDto: UpdateResourceDto): Promise<Resource> {
    const resource = await this.findOne(id);
    Object.assign(resource, updateResourceDto);
    return await this.resourceRepository.save(resource);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    // softDelete() en lugar de delete()
    // Solo pone la fecha actual en la columna deletedAt
    // El registro sigue en la BD pero TypeORM lo ignora en consultas normales
    await this.resourceRepository.softDelete(id);
  }

  async toggleVisibility(id: number): Promise<Resource> {
    const resource = await this.findOne(id);
    resource.hidden = !resource.hidden;
    return await this.resourceRepository.save(resource);
  }

  // Método extra: restaurar un recurso eliminado con soft delete
  async restore(id: number): Promise<Resource> {
    // Necesitamos buscarlo incluyendo los eliminados (withDeleted)
    const resource = await this.resourceRepository.findOne({
      where: { id },
      withDeleted: true, // incluye registros con deletedAt != NULL
    });

    if (!resource) {
      throw new NotFoundException(`Recurso con id ${id} no encontrado`);
    }

    // restore() pone deletedAt en NULL nuevamente
    await this.resourceRepository.restore(id);

    return await this.findOne(id);
  }
}