import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
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
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get()
  findAll() {
    return this.resourcesService.findAll();
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.findOne(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.remove(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id/visibility')
  toggleVisibility(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.toggleVisibility(id);
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':id/restore')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.resourcesService.restore(id);
  }
}