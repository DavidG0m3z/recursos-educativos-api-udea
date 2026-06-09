import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { Resource } from './entities/resource.entity';
import { ResourcePosition } from './entities/resource-position.entity';
import { Category } from '../categories/entities/category.entity';
import { Position } from '../position/entities/position.entity';
import { Participation } from '../../common/enums/participation.enum';

// --- MOCKS --- //

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
  findOne: jest.fn(),
};

const mockResourcePositionRepository = {
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

// --- DATOS DE PRUEBA --- //

const mockCategory: Category = {
  id: 1,
  name: 'Video',
  icon: 'video',
  resources: [],
};

const mockPosition: Position = {
  id: 1,
  name: 'Guion',
  resourcePositions: [],
};

const mockResourcePosition: ResourcePosition = {
  id: 1,
  participation: Participation.SI,
  resource: {} as Resource,
  position: mockPosition,
};

const mockResource: Resource = {
  id: 1,
  title: 'Video explicativo',
  description: 'Video corto para explicar un concepto',
  hidden: false,
  deletedAt: null,
  complexityRefs: [],
  categories: [],
  resourcePositions: [],
};

// --- SUITE DE PRUEBAS --- //

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
        {
          provide: getRepositoryToken(ResourcePosition),
          useValue: mockResourcePositionRepository,
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
    it('debe crear un recurso sin categorías ni posiciones', async () => {
      const dto = {
        title: 'Video explicativo',
        description: 'Video corto',
        hidden: false,
      };

      mockResourceRepository.create.mockReturnValue(mockResource);
      mockResourceRepository.save.mockResolvedValue(mockResource);
      mockResourceRepository.findOne.mockResolvedValue(mockResource);

      const result = await service.create(dto);

      expect(mockResourceRepository.create).toHaveBeenCalled();
      expect(mockResourceRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockResource);
    });

    it('debe crear un recurso con categorías y posiciones', async () => {
      const dto = {
        title: 'Video explicativo',
        description: 'Video corto',
        hidden: false,
        categoryIds: [1],
        positions: [
          {
            positionId: 1,
            participation: Participation.SI,
          },
        ],
      };

      mockResourceRepository.create.mockReturnValue({
        ...mockResource,
      });

      mockCategoryRepository.findByIds.mockResolvedValue([
        mockCategory,
      ]);

      mockResourceRepository.save.mockResolvedValue(
        mockResource,
      );

      mockPositionRepository.findOne.mockResolvedValue(
        mockPosition,
      );

      mockResourcePositionRepository.create.mockReturnValue(
        mockResourcePosition,
      );

      mockResourcePositionRepository.save.mockResolvedValue(
        mockResourcePosition,
      );

      mockResourceRepository.findOne.mockResolvedValue({
        ...mockResource,
        categories: [mockCategory],
        resourcePositions: [mockResourcePosition],
      });

      const result = await service.create(dto);

      expect(mockCategoryRepository.findByIds)
        .toHaveBeenCalledWith([1]);

      expect(mockPositionRepository.findOne)
        .toHaveBeenCalledWith({
          where: { id: 1 },
        });

      expect(mockResourcePositionRepository.create)
        .toHaveBeenCalled();

      expect(mockResourcePositionRepository.save)
        .toHaveBeenCalled();

      expect(result.categories)
        .toEqual([mockCategory]);
    });

    it('debe lanzar NotFoundException si la posición no existe', async () => {
      const dto = {
        title: 'Video explicativo',
        description: 'Video corto',
        positions: [
          {
            positionId: 999,
            participation: Participation.SI,
          },
        ],
      };

      mockResourceRepository.create.mockReturnValue(
        mockResource,
      );

      mockResourceRepository.save.mockResolvedValue(
        mockResource,
      );

      mockPositionRepository.findOne.mockResolvedValue(
        null,
      );

      await expect(
        service.create(dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // --- FIND ALL --- //

  describe('findAll', () => {
    it('debe retornar un array de recursos', async () => {
      mockResourceRepository.find.mockResolvedValue([
        mockResource,
      ]);

      const result = await service.findAll();

      expect(mockResourceRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockResource]);
    });

    it('debe retornar un array vacío si no hay recursos', async () => {
      mockResourceRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // --- FIND ONE --- //

  describe('findOne', () => {
    it('debe retornar un recurso si existe', async () => {
      mockResourceRepository.findOne.mockResolvedValue(
        mockResource,
      );

      const result = await service.findOne(1);

      expect(mockResourceRepository.findOne)
        .toHaveBeenCalledWith({
          where: { id: 1 },
        });

      expect(result).toEqual(mockResource);
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      mockResourceRepository.findOne.mockResolvedValue(
        null,
      );

      await expect(
        service.findOne(999),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.findOne(999),
      ).rejects.toThrow(
        'Resource with id 999 not found',
      );
    });
  });

  // --- UPDATE --- //

  describe('update', () => {
    it('debe actualizar un recurso existente', async () => {
      const dto = {
        title: 'Título actualizado',
      };

      const updatedResource = {
        ...mockResource,
        title: 'Título actualizado',
      };

      mockResourceRepository.findOne.mockResolvedValue(
        { ...mockResource },
      );

      mockResourceRepository.save.mockResolvedValue(
        updatedResource,
      );

      const result = await service.update(1, dto);

      expect(result.title)
        .toBe('Título actualizado');
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      mockResourceRepository.findOne.mockResolvedValue(
        null,
      );

      await expect(
        service.update(999, {} as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // --- REMOVE --- //

  describe('remove', () => {
    it('debe hacer soft delete de un recurso existente', async () => {
      mockResourceRepository.findOne.mockResolvedValue(
        mockResource,
      );

      mockResourceRepository.softDelete.mockResolvedValue(
        undefined,
      );

      await service.remove(1);

      expect(
        mockResourceRepository.softDelete,
      ).toHaveBeenCalledWith(1);
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      mockResourceRepository.findOne.mockResolvedValue(
        null,
      );

      await expect(
        service.remove(999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // --- RESTORE --- //

  describe('restore', () => {
    it('debe restaurar un recurso eliminado', async () => {
      const deletedResource = {
        ...mockResource,
        deletedAt: new Date(),
      };

      mockResourceRepository.findOne
        .mockResolvedValueOnce(deletedResource)
        .mockResolvedValueOnce(mockResource);

      mockResourceRepository.restore.mockResolvedValue(
        undefined,
      );

      const result = await service.restore(1);

      expect(
        mockResourceRepository.restore,
      ).toHaveBeenCalledWith(1);

      expect(result).toEqual(mockResource);
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      mockResourceRepository.findOne.mockResolvedValue(
        null,
      );

      await expect(
        service.restore(999),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // --- TOGGLE VISIBILITY --- //

  describe('toggleVisibility', () => {
    it('debe cambiar hidden de false a true', async () => {
      const resourceVisible = {
        ...mockResource,
        hidden: false,
      };

      const resourceHidden = {
        ...mockResource,
        hidden: true,
      };

      mockResourceRepository.findOne.mockResolvedValue(
        resourceVisible,
      );

      mockResourceRepository.save.mockResolvedValue(
        resourceHidden,
      );

      const result = await service.toggleVisibility(1);

      expect(result.hidden).toBe(true);
    });

    it('debe cambiar hidden de true a false', async () => {
      const resourceHidden = {
        ...mockResource,
        hidden: true,
      };

      const resourceVisible = {
        ...mockResource,
        hidden: false,
      };

      mockResourceRepository.findOne.mockResolvedValue(
        resourceHidden,
      );

      mockResourceRepository.save.mockResolvedValue(
        resourceVisible,
      );

      const result = await service.toggleVisibility(1);

      expect(result.hidden).toBe(false);
    });

    it('debe lanzar NotFoundException si el recurso no existe', async () => {
      mockResourceRepository.findOne.mockResolvedValue(
        null,
      );

      await expect(
        service.toggleVisibility(999),
      ).rejects.toThrow(NotFoundException);
    });
  });
});