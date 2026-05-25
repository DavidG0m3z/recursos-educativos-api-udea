import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Role {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20 })
  name!: string;

  // 1:N — un rol puede tener muchos usuarios
  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}