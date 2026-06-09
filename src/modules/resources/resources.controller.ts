import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleEnum } from '../../common/enums/role.enum';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Roles(RoleEnum.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear recurso' })
  @ApiResponse({ status: 201, description: 'Recurso creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todos los recursos',
    description:
      'Solo retorna recursos activos — excluye los eliminados con soft delete',
  })
  @ApiResponse({ status: 200, description: 'Lista de recursos' })
  findAll() {
    return this.resourcesService.findAll();
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un recurso por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Recurso encontrado' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un recurso' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Recurso actualizado' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un recurso (soft delete)',
    description:
      'No borra el registro — solo marca deletedAt con la fecha actual',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Recurso eliminado' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.remove(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id/visibility')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Alternar visibilidad',
    description:
      'Invierte el valor del campo hidden — true pasa a false y viceversa',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Visibilidad actualizada' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  toggleVisibility(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.toggleVisibility(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id/restore')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Restaurar recurso eliminado',
    description:
      'Restaura un recurso eliminado con soft delete — pone deletedAt en null',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Recurso restaurado' })
  @ApiResponse({ status: 404, description: 'Recurso no encontrado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.restore(id);
  }
}
