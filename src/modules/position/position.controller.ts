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
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleEnum } from '../../common/enums/role.enum';

@Controller('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Roles(RoleEnum.ADMIN)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear position' })
  @ApiResponse({ status: 201, description: 'Position creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionService.create(createPositionDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los positions' })
  @ApiResponse({ status: 200, description: 'Lista de positions' })
  findAll() {
    return this.positionService.findAll();
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un position por id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Position encontrado' })
  @ApiResponse({ status: 404, description: 'Position no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.positionService.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un position' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Position actualizado' })
  @ApiResponse({ status: 404, description: 'Position no encontrado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionService.update(id, updatePositionDto);
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un position' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Position eliminado' })
  @ApiResponse({ status: 404, description: 'Position no encontrado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.positionService.remove(id);
  }
}
