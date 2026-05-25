import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  // unique: true garantiza que no haya dos usuarios con el mismo email
  @Column({ type: 'varchar', length: 150, unique: true })
  email!: string;

  // Nunca guardar contraseña en texto plano — aquí irá el hash (bcrypt)
  @Column({ type: 'varchar' })
  password!: string;

  // TypeORM asigna automáticamente la fecha actual al crear el registro
  @CreateDateColumn()
  createdAt!: Date;

  // N:1 — muchos usuarios pertenecen a un rol
  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role!: Role;
}