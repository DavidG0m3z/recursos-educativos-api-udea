import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Resource } from './resource.entity';


@Entity('complexity_refs')
export class ComplexityRef {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'text', nullable: true })
  desc: string;

  @Column({ type: 'text', nullable: true })
  link: string;

  @ManyToOne(() => Resource, (resource) => resource.complexity, {
    onDelete: 'CASCADE',
  })
  resource: Resource;
}