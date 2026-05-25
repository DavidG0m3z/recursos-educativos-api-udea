import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from '../../resources/entities/resource.entity';

@Entity('categories')
export class Category {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  icon!: string;

  // Lado inverso de la relación N:M con resources
  // Sin @JoinTable porque ese va solo en Resource
  @ManyToMany(() => Resource, (resource) => resource.categories)
  resources!: Resource[];
}