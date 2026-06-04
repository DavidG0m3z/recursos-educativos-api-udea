import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';
import { Participation } from '../../../common/enums/participation.enum';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'enum', enum: Participation })
  participation!: Participation;

  @ManyToMany(() => Resource, (resource) => resource.position)
  resources!: Resource[];
}
