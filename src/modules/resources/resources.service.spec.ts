import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { Resource } from './entities/resource.entity';
import { Category } from '../categories/entities/category.entity';
import { Position } from '../position/entities/position.entity';

// --- MOKS --- //

const mockResourceRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
};

const mockCategoryRepository = {
  findByIds: jest.fn(),
};

const mockPositionRepository = {
  findByIds: jest.fn(),
};

// --- DATOS DE PRUEBA --- //

const mockResource: Resource = {
  id: 1,
  title: 'Video explicativo',
  description: 'Video corto para explicar un concepto',
  hidden: false,
  deletedAt: null,
  complexityRefs: [],
  categories: [],
  position: [],
};

const mockCategory: Category = {
  id: 1,
  name: 'Video',
  icon: 'video',
  resources: [],
};

const mockPosition: Position = {
  id: 1,
  name: 'Guion',
  participation: 'Si' as any,
  resources: [],
};

// --- SUITE DE PRUENAS --- //

describe('ResourcesService', () => {
  let service: ResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: getRepositoryToken(Resource),
          useValue: mockResourceRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: getRepositoryToken(Position),
          useValue: mockPositionRepository,
        },
      ],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE --- //

  describe('create', () => {
    it('debe crear un recurso sin categorías ni positions', async () => {
      // Arrange
      const dto = {
        title: 'Video explicativo',
        description: 'Video corto',
        hidden: false,
      };
      mockResourceRepository.create.mockReturnValue(mockResource);
      mockResourceRepository.save.mockResolvedValue(mockResource);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(mockResourceRepository.create).toHaveBeenCalledWith(dto);
      expect(mockResourceRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockResource);
    });

    it('debe crear un recurso con categorías y positions', async () => {
      // Arrange
      const dto = {
        title: 'Video explicativo',
        description: 'Video corto',
        hidden: false,
        categoryIds: [1],
        positionIds: [1],
      };
      mockResourceRepository.create.mockReturnValue({ ...mockResource });
      mockCategoryRepository.findByIds.mockResolvedValue([mockCategory]);
      mockPositionRepository.findByIds.mockResolvedValue([mockPosition]);
      mockResourceRepository.save.mockResolvedValue({
        ...mockResource,
        categories: [mockCategory],
        position: [mockPosition],
      });

      // Act
      const result = await service.create(dto);

      // Assert
      expect(mockCategoryRepository.findByIds).toHaveBeenCalledWith([1]);
      expect(mockPositionRepository.findByIds).toHaveBeenCalledWith([1]);
      expect(result.categories).toEqual([mockCategory]);
      expect(result.position).toEqual([mockPosition]);
    });
  });

  // --- FIND ALL --- //

  describe('findAll', () => {
    it('debe retornar un array de recursos', async () => {
      // Arrange
      mockResourceRepository.find.mockResolvedValue([mockResource]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockResourceRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockResource]);
    });

    it('debe retornar un array vacío si no hay recursos', async () => {
      // Arrange
      mockResourceRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // --- FIND ONE --- //

  describe('findOne', () => {
    it('debe retornar un recurso si existe', async () => {
      // Arrange
      mockResourceRepository.findOne.mockResolvedValue(mockResource);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(mockResourceRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockResource);
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      // Arrange
      mockResourceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Resource with id 999 not found',
      );
    });
  });

  // --- UPDATE --- //

  describe('update', () => {
    it('debe actualizar un recurso existente', async () => {
      // Arrange
      const dto = { title: 'Título actualizado' };
      const updatedResource = { ...mockResource, title: 'Título actualizado' };
      mockResourceRepository.findOne.mockResolvedValue({ ...mockResource });
      mockResourceRepository.save.mockResolvedValue(updatedResource);

      // Act
      const result = await service.update(1, dto);

      // Assert
      expect(result.title).toBe('Título actualizado');
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      // Arrange
      mockResourceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // --- REMOVE --- //

  describe('remove', () => {
    it('debe hacer soft delete de un recurso existente', async () => {
      // Arrange
      mockResourceRepository.findOne.mockResolvedValue(mockResource);
      mockResourceRepository.softDelete.mockResolvedValue(undefined);

      // Act
      await service.remove(1);

      // Assert
      expect(mockResourceRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      // Arrange
      mockResourceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  // --- RESTORE --- //

  describe('restore', () => {
    it('debe restaurar un recurso eliminado', async () => {
      // Arrange
      const deletedResource = { ...mockResource, deletedAt: new Date() };
      mockResourceRepository.findOne
        .mockResolvedValueOnce(deletedResource)
        .mockResolvedValueOnce(mockResource);
      mockResourceRepository.restore.mockResolvedValue(undefined);

      // Act
      const result = await service.restore(1);

      // Assert
      expect(mockResourceRepository.restore).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResource);
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      // Arrange
      mockResourceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.restore(999)).rejects.toThrow(NotFoundException);
    });
  });

  // --- TOGGLE VISIBILITY --- //

  describe('toggleVisibility', () => {
    it('debe cambiar hidden de false a true', async () => {
      // Arrange
      const resourceVisible = { ...mockResource, hidden: false };
      const resourceHidden = { ...mockResource, hidden: true };
      mockResourceRepository.findOne.mockResolvedValue(resourceVisible);
      mockResourceRepository.save.mockResolvedValue(resourceHidden);

      // Act
      const result = await service.toggleVisibility(1);

      // Assert
      expect(result.hidden).toBe(true);
    });

    it('debe cambiar hidden de true a false', async () => {
      // Arrange
      const resourceHidden = { ...mockResource, hidden: true };
      const resourceVisible = { ...mockResource, hidden: false };
      mockResourceRepository.findOne.mockResolvedValue(resourceHidden);
      mockResourceRepository.save.mockResolvedValue(resourceVisible);

      // Act
      const result = await service.toggleVisibility(1);

      // Assert
      expect(result.hidden).toBe(false);
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      // Arrange
      mockResourceRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.toggleVisibility(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
