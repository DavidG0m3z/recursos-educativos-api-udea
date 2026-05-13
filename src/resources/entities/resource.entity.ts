import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ComplexityRef } from './comprexity-ref.entity';

export type RoleValue = 'Si' | 'No' | 'Depende';

export interface ResourceRoles {
    Fuentes: RoleValue;
    Guion: RoleValue;
    Estilo: RoleValue;
    Ilustracion: RoleValue;
    Diseño: RoleValue;
    Aud: RoleValue;
    Locucion: RoleValue;
    Anim: RoleValue;
    DesarrolloFrontend: RoleValue;
    Publicador: RoleValue;
}

@Entity('resources')
export class Resource {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'varchar', length: 100 })
    category: string;

    @Column({ type: 'varchar', length: 100 })
    type: string

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'boolean', default: false })
    hidden: boolean;


    @Column({ type: 'simple-json' })
    roles: ResourceRoles;

    @OneToMany( () => ComplexityRef, (ref) => ref.resource, {
        cascade: true,
        eager: true,
    })
    complexity: ComplexityRef[];
}