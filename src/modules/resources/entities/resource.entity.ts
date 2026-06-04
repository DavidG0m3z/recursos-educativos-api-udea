import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ComplexityRef } from './complexity-ref.entity';
import { Category } from '../../categories/entities/category.entity';
import { Position } from '../../position/entities/position.entity';

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'boolean', default: false })
  hidden!: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  @OneToMany(() => ComplexityRef, (ref) => ref.resource, {
    cascade: true,
    eager: true,
  })
  complexityRefs!: ComplexityRef[];

  @ManyToMany(() => Category, (category) => category.resources, {
    eager: true,
  })
  @JoinTable({ name: 'resources_categories' })
  categories!: Category[];

  @ManyToMany(() => Position, (position) => position.resources, {
    eager: true,
  })
  @JoinTable({ name: 'resources_positions' })
  position!: Position[];
}
