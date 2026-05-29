import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '../auth/decorators/public.decorators';
import { Roles } from '../auth/decorators/roles.decorators';
import { RoleEnum } from '../../common/enums/role.enum';


@Controller('categories')
export class CategoriesController {
    
    constructor(
        private readonly categoriesServices: CategoriesService
    ){}

    @Roles(RoleEnum.ADMIN)
    @Post()
    create(@Body() CreateCategoryDto: CreateCategoryDto) {
        return this.categoriesServices.create(CreateCategoryDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.categoriesServices.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesServices.findOne(id);
    }

    @Roles(RoleEnum.ADMIN)
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoriesServices.update(id, updateCategoryDto);
    }

    @Roles(RoleEnum.ADMIN)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesServices.remove(id);
    }
}