import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { Resource } from './entities/resource.entity';
import { ComplexityRef } from './entities/complexity-ref.entity';
import { CategoriesModule } from '../categories/categories.module';
import { CargosModule } from '../cargos/cargos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, ComplexityRef]),
    CategoriesModule,
    CargosModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService, TypeOrmModule],
})
export class ResourcesModule {}