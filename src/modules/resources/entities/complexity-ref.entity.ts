import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';

@Entity('complexity_refs')
export class ComplexityRef {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  level!: number;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'text', nullable: true })
  link!: string;

  // N:1 — muchos complexity_refs pertenecen a un resource
  // onDelete CASCADE: si se borra el resource, se borran sus refs
  @ManyToOne(() => Resource, (resource) => resource.complexityRefs, {
    onDelete: 'CASCADE',
  })
  resource!: Resource;
}