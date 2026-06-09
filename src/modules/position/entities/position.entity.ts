import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ResourcePosition } from '../../resources/entities/resource-position.entity';

@Entity('positions')
export class Position {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @OneToMany(() => ResourcePosition, (rp) => rp.position)
  resourcePositions!: ResourcePosition[];
}