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

  // TypeORM llena esta columna automáticamente al hacer softDelete()
  // Si es null el recurso está activo, si tiene fecha fue eliminado
  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date | null;

  // 1:N — un resource tiene muchos complexity_refs
  @OneToMany(() => ComplexityRef, (ref) => ref.resource, {
    cascade: true,
    eager: true,
  })
  complexityRefs!: ComplexityRef[];

  // N:M con categories
  // @JoinTable le dice a TypeORM que cree la tabla intermedia resources_categories
  // Solo va en uno de los dos lados (el lado "dueño")
  @ManyToMany(() => Category, (category) => category.resources, {
    eager: true,
  })
  @JoinTable({ name: 'resources_categories' })
  categories!: Category[];

  // N:M con cargos
  // TypeORM crea la tabla intermedia resources_cargos automáticamente
  @ManyToMany(() => Position, (position) => position.resources, {
    eager: true,
  })
  @JoinTable({ name: 'resources_cargos' })
  position!: Position[];
}

