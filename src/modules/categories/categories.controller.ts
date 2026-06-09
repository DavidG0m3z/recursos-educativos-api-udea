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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleEnum } from '../../common/enums/role.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesServices: CategoriesService) {}

  @Roles(RoleEnum.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  create(@Body() CreateCategoryDto: CreateCategoryDto) {
    return this.categoriesServices.create(CreateCategoryDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías' })
  findAll() {
    return this.categoriesServices.findAll();
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener una categoría por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesServices.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Categoría actualizada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesServices.update(id, updateCategoryDto);
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Categoría eliminada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesServices.remove(id);
  }
}
