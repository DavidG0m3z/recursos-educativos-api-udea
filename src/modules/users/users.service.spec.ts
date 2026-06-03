import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

// --- MOCKS --- // 

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockRoleRepository = {
  findOne: jest.fn(),
};


const mockRole: Role = {
  id: 1,
  name: 'admin',
  users: [],
};

const mockUser: User = {
  id: 1,
  name: 'Jhon Doe',
  email: 'jhondoe@udea.edu.co',
  password: '$2b$10$hashedpassword',
  createdAt: new Date(),
  role: mockRole,
};

// --- SUITE DE PRUEBAS --- //

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE --- // 

  describe('create', () => {
    it('debe crear un usuario con la contraseña hasheada', async () => {
      // Arrange
      const dto = {
        name: 'Jhon Doe',
        email: 'jhondoe@udea.edu.co',
        password: '12345678',
        roleId: 1,
      };
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('debe hashear la contraseña antes de guardar', async () => {
      // Arrange
      const dto = {
        name: 'Jhon Doe',
        email: 'jhondoe@udea.edu.co',
        password: '12345678',
        roleId: 1,
      };
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      await service.create(dto);

      // Assert
      const createCall = mockUserRepository.create.mock.calls[0][0];
      expect(createCall.password).not.toBe('12345678');
      expect(await bcrypt.compare('12345678', createCall.password)).toBe(true);
    });

    it('debe lanzar NotFoundException si el rol no existe', async () => {
      // Arrange
      const dto = {
        name: 'Jhon Doe',
        email: 'jhondoe@udea.edu.co',
        password: '12345678',
        roleId: 999,
      };
      mockRoleRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      await expect(service.create(dto)).rejects.toThrow('Role with id 999 not found');
    });
  });

  // --- FIND ALL --- //

  describe('findAll', () => {
    it('debe retornar un array de usuarios', async () => {
      // Arrange
      mockUserRepository.find.mockResolvedValue([mockUser]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('debe retornar un array vacío si no hay usuarios', async () => {
      // Arrange
      mockUserRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // --- FIND ONE --- //

  describe('findOne', () => {
    it('debe retornar un usuario si existe', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.findOne(1);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('User with id 999 not found');
    });
  });

  // --- UPDATE --- //

  describe('update', () => {
    it('debe actualizar un usuario existente', async () => {
      // Arrange
      const dto = { name: 'Jhon Doe Actualizado' };
      const updatedUser = { ...mockUser, name: 'Jhon Doe Actualizado' };
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockUserRepository.save.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(1, dto);

      // Assert
      expect(result.name).toBe('Jhon Doe Actualizado');
    });

    it('debe actualizar el rol si se envía roleId', async () => {
      // Arrange
      const newRole: Role = { id: 2, name: 'user', users: [] };
      const dto = { roleId: 2 };
      const updatedUser = { ...mockUser, role: newRole };
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockRoleRepository.findOne.mockResolvedValue(newRole);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      // Act
      const result = await service.update(1, dto);

      // Assert
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(result.role).toEqual(newRole);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException si el nuevo rol no existe', async () => {
      // Arrange
      const dto = { roleId: 999 };
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockRoleRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
      await expect(service.update(1, dto)).rejects.toThrow('Role with id 999 not found');
    });
  });

  // --- REMOVE ---//

  describe('remove', () => {
    it('debe eliminar un usuario existente', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(undefined);

      // Act
      await service.remove(1);

      // Assert
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});