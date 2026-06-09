import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async create(createPositionDto: CreatePositionDto): Promise<Position> {
    const position = this.positionRepository.create(createPositionDto);
    return await this.positionRepository.save(position);
  }

  async findAll(): Promise<Position[]> {
    return await this.positionRepository.find();
  }

  async findOne(id: number): Promise<Position> {
    const cargo = await this.positionRepository.findOne({ where: { id } });
    if (!cargo) {
      throw new NotFoundException(`Cargo with id ${id} not found`);
    }
    return cargo;
  }

  async update(
    id: number,
    updateCargoDto: UpdatePositionDto,
  ): Promise<Position> {
    const position = await this.findOne(id);
    Object.assign(position, updateCargoDto);
    return await this.positionRepository.save(position);
  }

  async remove(id: number): Promise<void> {
    const position = await this.findOne(id);
    await this.positionRepository.remove(position);
  }
}
