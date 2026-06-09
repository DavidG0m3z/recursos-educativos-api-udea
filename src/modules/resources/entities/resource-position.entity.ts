import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';
import { Position } from '../../position/entities/position.entity';
import { Participation } from '../../../common/enums/participation.enum';

@Entity('resources_positions')
export class ResourcePosition {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: Participation })
  participation!: Participation;

  @ManyToOne(() => Resource, (resource) => resource.resourcePositions, {
    onDelete: 'CASCADE',
  })
  resource!: Resource;

  @ManyToOne(() => Position, (position) => position.resourcePositions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  position!: Position;
}