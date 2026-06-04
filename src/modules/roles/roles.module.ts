import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesSeederService } from './roles--seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesSeederService],
  exports: [TypeOrmModule],
})
export class RolesModule {}
