import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';


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
      
      const exists = await this.roleRepository.findOne({ where: { name } });
      if (!exists) {
        await this.roleRepository.save(this.roleRepository.create({ name }));
      }
    }
  }
}