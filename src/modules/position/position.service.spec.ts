import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PositionService } from './position.service';
import { Position } from './entities/position.entity';

// --- MOCKS --- // 

const mockPositionRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockPosition: Position = {
  id: 1,
  name: 'Guion',
  resourcePositions: [],
};

// --- SUITE DE PRUEBAS --- //

describe('PositionService', () => {
  let service: PositionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionService,
        {
          provide: getRepositoryToken(Position),
          useValue: mockPositionRepository,
        },
      ],
    }).compile();

    service = module.get<PositionService>(PositionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE --- //

  describe('create', () => {
    it('debe crear un position correctamente', async () => {
      // Arrange
      const dto = { name: 'Guion' };
      mockPositionRepository.create.mockReturnValue(mockPosition);
      mockPositionRepository.save.mockResolvedValue(mockPosition);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(mockPositionRepository.create).toHaveBeenCalledWith(dto);
      expect(mockPositionRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockPosition);
    });
  });

  // --- FIND ALL --- // 

  describe('findAll', () => {
    it('debe retornar un array de positions', async () => {
      // Arrange
      mockPositionRepository.find.mockResolvedValue([mockPosition]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockPositionRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockPosition]);
    });

    it('debe retornar un array vacío si no hay positions', async () => {
      // Arrange
      mockPositionRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // --- FIND ONE --- //

  describe('findOne', () => {
    it('debe retornar un position si existe', async () => {
      // Arrange
      mockPositionRepository.findOne.mockResolvedValue(mockPosition);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(mockPositionRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockPosition);
    });

    it('debe lanzar NotFoundException si el position no existe', async () => {
      // Arrange
      mockPositionRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Cargo with id 999 not found');
    });
  });

  // --- UPDATE --- //

  describe('update', () => {
    it('debe actualizar un position existente', async () => {
      // Arrange
      const dto = { name: 'Diseño' };
      const updatedPosition = { ...mockPosition, ...dto };
      mockPositionRepository.findOne.mockResolvedValue({ ...mockPosition });
      mockPositionRepository.save.mockResolvedValue(updatedPosition);

      // Act
      const result = await service.update(1, dto);

      // Assert
      expect(result.name).toBe('Diseño');
    });

    it('debe lanzar NotFoundException si el position no existe', async () => {
      // Arrange
      mockPositionRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  // --- REMOVE --- //

  describe('remove', () => {
    it('debe eliminar un position existente', async () => {
      // Arrange
      mockPositionRepository.findOne.mockResolvedValue(mockPosition);
      mockPositionRepository.remove.mockResolvedValue(undefined);

      // Act
      await service.remove(1);

      // Assert
      expect(mockPositionRepository.remove).toHaveBeenCalledWith(mockPosition);
    });

    it('debe lanzar NotFoundException si el position no existe', async () => {
      // Arrange
      mockPositionRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});