import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

// OnApplicationBootstrap es un hook de NestJS que se ejecuta
// automáticamente una vez que la app termina de inicializarse
@Injectable()
export class RolesSeederService implements OnApplicationBootstrap {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedRoles();
  }

  private async seedRoles(): Promise<void> {
    const roles = ['admin', 'user'];

    for (const name of roles) {
      // Verificamos si el rol ya existe antes de insertarlo
      // Así este seeder puede correr cada vez que arranca la app sin duplicar datos
      const exists = await this.roleRepository.findOne({ where: { name } });
      if (!exists) {
        await this.roleRepository.save(this.roleRepository.create({ name }));
      }
    }
  }
}