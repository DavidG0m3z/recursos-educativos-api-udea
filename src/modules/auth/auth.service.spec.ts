import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

// ─── MOCKS ───────────────────────────────────────────────────────────────────

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

// ─── DATOS DE PRUEBA ─────────────────────────────────────────────────────────

const mockRole = {
  id: 1,
  name: 'admin',
  users: [],
};

const mockUser: User = {
  id: 1,
  name: 'Admin Ude@',
  email: 'admin@udea.edu.co',
  password: '$2b$10$hashedpassword',
  createdAt: new Date(),
  role: mockRole,
};

// ─── SUITE DE PRUEBAS ────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── LOGIN ────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('debe retornar access_token y datos del usuario con credenciales válidas', async () => {
      // Arrange
      const dto = { email: 'admin@udea.edu.co', password: '12345678' };
      const hashedPassword = await bcrypt.hash('12345678', 10);
      const userWithHash = { ...mockUser, password: hashedPassword };
      mockUserRepository.findOne.mockResolvedValue(userWithHash);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      // Act
      const result = await service.login(dto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
        relations: ['role'],
      });
      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockRole.name,
      });
    });

    it('debe lanzar UnauthorizedException si el email no existe', async () => {
      // Arrange
      const dto = { email: 'noexiste@udea.edu.co', password: '12345678' };
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(dto)).rejects.toThrow('Invalid credentials');
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      // Arrange
      const dto = { email: 'admin@udea.edu.co', password: 'wrongpassword' };
      const hashedPassword = await bcrypt.hash('12345678', 10);
      const userWithHash = { ...mockUser, password: hashedPassword };
      mockUserRepository.findOne.mockResolvedValue(userWithHash);

      // Act & Assert
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(dto)).rejects.toThrow('Invalid credentials');
    });

    it('debe generar el token con el payload correcto', async () => {
      // Arrange
      const dto = { email: 'admin@udea.edu.co', password: '12345678' };
      const hashedPassword = await bcrypt.hash('12345678', 10);
      const userWithHash = { ...mockUser, password: hashedPassword };
      mockUserRepository.findOne.mockResolvedValue(userWithHash);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      // Act
      await service.login(dto);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockRole.name,
      });
    });
  });
});
