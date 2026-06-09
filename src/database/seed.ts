import 'reflect-metadata';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Category } from '../modules/categories/entities/category.entity';
import { Position } from '../modules/position/entities/position.entity';
import { Role } from '../modules/roles/entities/role.entity';
import { User } from '../modules/users/entities/user.entity';
import { Resource } from '../modules/resources/entities/resource.entity';
import { ComplexityRef } from '../modules/resources/entities/complexity-ref.entity';
import { ResourcePosition } from '../modules/resources/entities/resource-position.entity';

const BCRYPT_ROUNDS = 10;

const categories = [
  { name: 'Audiovisual', icon: 'Video' },
  { name: 'Gráfico/Impreso', icon: 'ImageIcon' },
  { name: 'Audio', icon: 'Mic' },
  { name: 'Digitales Interactivos', icon: 'MousePointer2' },
  { name: 'Actividades de Moodle', icon: 'CheckCircle2' },
  { name: 'Identidad Gráfica', icon: 'Layers' },
  { name: 'Texto diagramado', icon: 'FileText' },
  { name: 'Texto plano', icon: 'FileText' },
] as const;

const positions = [
  'Fuentes',
  'Guion',
  'Estilo',
  'Ilustración',
  'Diseño',
  'Aud.',
  'Locución',
  'Anim.',
  'Desarrollo frontend',
  'Publicador',
] as const;

const roles = ['admin', 'user'] as const;

const users = [
  {
    name: 'Admin Ude@',
    email: 'admin@udea.edu.co',
    password: '12345678',
    roleName: 'admin',
  },
  {
    name: 'Jhon Doe',
    email: 'jhondoe@udea.edu.co',
    password: '12345678',
    roleName: 'admin',
  },
] as const;

function env(name: string, fallback: string): string {
  return (process.env[name] ?? fallback).trim();
}

function envNumber(name: string, fallback: number): number {
  const value = Number(env(name, String(fallback)));
  return Number.isFinite(value) ? value : fallback;
}

const dataSource = new DataSource({
  type: 'mysql',
  host: env('DB_HOST', 'localhost'),
  port: envNumber('DB_PORT', 3307),
  username: env('DB_USERNAME', 'recursos_user'),
  password: env('DB_PASSWORD', 'admin'),
  database: env('DB_NAME', 'recursos_educativos'),
  entities: [Role, User, Category, Position, Resource, ComplexityRef, ResourcePosition],
  synchronize: true,
});

async function findOrCreateByName<T extends { name: string }>(
  repository: Repository<T>,
  name: string,
  defaults?: DeepPartial<T>,
): Promise<T> {
  const existing = await repository.findOne({ where: { name } as any });
  const values = defaults ?? ({} as DeepPartial<T>);

  if (existing) {
    const next = repository.merge(existing, values as any);
    return repository.save(next);
  }

  const entity = repository.create({ name, ...values } as DeepPartial<T>);
  return repository.save(entity as T);
}

async function seedRoles(roleRepository: Repository<Role>): Promise<Map<string, Role>> {
  const seededRoles = new Map<string, Role>();

  for (const name of roles) {
    const role = await findOrCreateByName(roleRepository, name);
    seededRoles.set(name, role);
  }

  return seededRoles;
}

async function seedUsers(
  userRepository: Repository<User>,
  seededRoles: Map<string, Role>,
): Promise<void> {
  for (const userData of users) {
    const role = seededRoles.get(userData.roleName);

    if (!role) {
      throw new Error(`Missing role: ${userData.roleName}`);
    }

    const password = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);
    const existing = await userRepository.findOne({
      where: { email: userData.email },
      relations: ['role'],
    });

    if (existing) {
      existing.name = userData.name;
      existing.password = password;
      existing.role = role;
      await userRepository.save(existing);
      continue;
    }

    await userRepository.save(
      userRepository.create({
        name: userData.name,
        email: userData.email,
        password,
        role,
      }),
    );
  }
}

async function seedCategories(categoryRepository: Repository<Category>): Promise<void> {
  for (const category of categories) {
    await findOrCreateByName(categoryRepository, category.name, {
      icon: category.icon,
    });
  }
}

async function seedPositions(positionRepository: Repository<Position>): Promise<void> {
  for (const name of positions) {
    await findOrCreateByName(positionRepository, name);
  }
}

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    const seededRoles = await seedRoles(dataSource.getRepository(Role));
    await seedUsers(dataSource.getRepository(User), seededRoles);
    await seedCategories(dataSource.getRepository(Category));
    await seedPositions(dataSource.getRepository(Position));

    const [roleCount, userCount, categoryCount, positionCount, resourceCount] =
      await Promise.all([
        dataSource.getRepository(Role).count(),
        dataSource.getRepository(User).count(),
        dataSource.getRepository(Category).count(),
        dataSource.getRepository(Position).count(),
        dataSource.getRepository(Resource).count(),
      ]);

    console.log('Seed completed');
    console.table({
      roles: roleCount,
      users: userCount,
      categories: categoryCount,
      positions: positionCount,
      resources: resourceCount,
    });
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Seed failed');
  console.error(error);
  process.exit(1);
});
