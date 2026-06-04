import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

// --- MOCKS --- //

const mockCategoryRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockCategory: Category = {
  id: 1,
  name: 'Video',
  icon: 'video',
  resources: [],
};

// --- SUITE DE PRUEBAS --- //

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE --- //

  describe('create', () => {
    it('debe crear una categoría correctamente', async () => {
      // Arrange
      const dto = { name: 'Video', icon: 'video' };
      mockCategoryRepository.create.mockReturnValue(mockCategory);
      mockCategoryRepository.save.mockResolvedValue(mockCategory);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(dto);
      expect(mockCategoryRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });
  });

  // --- FIND ALL --- //

  describe('findAll', () => {
    it('debe retornar un array de categorías', async () => {
      // Arrange
      mockCategoryRepository.find.mockResolvedValue([mockCategory]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockCategoryRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockCategory]);
    });

    it('debe retornar un array vacío si no hay categorías', async () => {
      // Arrange
      mockCategoryRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // --- FIND ONE --- //

  describe('findOne', () => {
    it('debe retornar una categoría si existe', async () => {
      // Arrange
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockCategory);
    });

    it('debe lanzar NotFoundException si la categoría no existe', async () => {
      // Arrange
      mockCategoryRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Category with 999 not found',
      );
    });
  });

  // --- UPDATE --- //

  describe('update', () => {
    it('debe actualizar una categoría existente', async () => {
      // Arrange
      const dto = { name: 'Video actualizado' };
      const updatedCategory = { ...mockCategory, name: 'Video actualizado' };
      mockCategoryRepository.findOne.mockResolvedValue({ ...mockCategory });
      mockCategoryRepository.save.mockResolvedValue(updatedCategory);

      // Act
      const result = await service.update(1, dto);

      // Assert
      expect(result.name).toBe('Video actualizado');
    });

    it('debe lanzar NotFoundException si la categoría no existe', async () => {
      // Arrange
      mockCategoryRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // --- REMOVE --- //

  describe('remove', () => {
    it('debe eliminar una categoría existente', async () => {
      // Arrange
      mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
      mockCategoryRepository.remove.mockResolvedValue(undefined);

      // Act
      await service.remove(1);

      // Assert
      expect(mockCategoryRepository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('debe lanzar NotFoundException si la categoría no existe', async () => {
      // Arrange
      mockCategoryRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
