<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


## information of Project and endpoints

# Recursos Educativos — Backend

API REST desarrollada con **NestJS**, **TypeORM** y **MariaDB** para el Repositorio de Recursos Educomunicativos de Ude@ Educación Virtual — Universidad de Antioquia.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) y Docker Compose
- [Postman](https://www.postman.com/) u otro cliente HTTP

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd recursos-educativos-back
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_NAME=recursos_educativos
```

### 4. Levantar la base de datos

```bash
docker-compose up -d
```

Verifica que el contenedor esté corriendo:

```bash
docker ps
```

Deberías ver `recursos_educativos_db` con status `Up`.

### 5. Ejecutar la aplicación

```bash
# Modo desarrollo (watch)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La API estará disponible en `http://localhost:3000`.

> **Nota:** Al arrancar la aplicación por primera vez, el seeder inserta automáticamente los roles `admin` y `user` en la base de datos.

---

## Estructura del proyecto

```
src/
├── common/
│   └── enums/
│       └── participation.enum.ts
├── modules/
│   ├── categories/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   └── categories.service.ts
│   ├── position/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── position.controller.ts
│   │   ├── position.module.ts
│   │   └── position.service.ts
│   ├── resources/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── resources.controller.ts
│   │   ├── resources.module.ts
│   │   └── resources.service.ts
│   ├── roles/
│   │   ├── entities/
│   │   ├── roles.module.ts
│   │   └── roles-seeder.service.ts
│   └── users/
│       ├── dto/
│       ├── entities/
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
└── app.module.ts
```

---

## Base de datos

El proyecto usa **MariaDB 10.11** via Docker. Las tablas se crean automáticamente al arrancar gracias a `synchronize: true` de TypeORM.

| Tabla | Descripción |
|---|---|
| `resources` | Recursos educomunicativos |
| `complexity_refs` | Referencias de complejidad de cada recurso |
| `categories` | Categorías de recursos |
| `resources_categories` | Relación N:M entre recursos y categorías |
| `positions` | Cargos del equipo de producción |
| `resources_positions` | Relación N:M entre recursos y cargos |
| `roles` | Roles de usuario (admin, user) |
| `users` | Usuarios de la plataforma |

---

## Endpoints

La URL base es `http://localhost:3000`.

---

### Categories

#### Crear categoría
```
POST /categories
```
**Body:**
```json
{
    "name": "Video",
    "icon": "video"
}
```
**Respuesta `201`:**
```json
{
    "id": 1,
    "name": "Video",
    "icon": "video"
}
```

---

#### Obtener todas las categorías
```
GET /categories
```
**Respuesta `200`:**
```json
[
    {
        "id": 1,
        "name": "Video",
        "icon": "video"
    }
]
```

---

#### Obtener una categoría por id
```
GET /categories/:id
```
**Respuesta `200`:**
```json
{
    "id": 1,
    "name": "Video",
    "icon": "video"
}
```

---

#### Actualizar una categoría
```
PATCH /categories/:id
```
**Body (todos los campos son opcionales):**
```json
{
    "name": "Video actualizado",
    "icon": "video-camera"
}
```
**Respuesta `200`:**
```json
{
    "id": 1,
    "name": "Video actualizado",
    "icon": "video-camera"
}
```

---

#### Eliminar una categoría
```
DELETE /categories/:id
```
**Respuesta `204 No Content`**

---

### Positions

Los valores válidos para `participation` son: `Si`, `No`, `Depende`.

#### Crear position
```
POST /position
```
**Body:**
```json
{
    "name": "Guion",
    "participation": "Si"
}
```
**Respuesta `201`:**
```json
{
    "id": 1,
    "name": "Guion",
    "participation": "Si"
}
```

---

#### Obtener todos los positions
```
GET /position
```
**Respuesta `200`:**
```json
[
    {
        "id": 1,
        "name": "Guion",
        "participation": "Si"
    }
]
```

---

#### Obtener un position por id
```
GET /position/:id
```
**Respuesta `200`:**
```json
{
    "id": 1,
    "name": "Guion",
    "participation": "Si"
}
```

---

#### Actualizar un position
```
PATCH /position/:id
```
**Body (todos los campos son opcionales):**
```json
{
    "name": "Diseño",
    "participation": "Depende"
}
```
**Respuesta `200`:**
```json
{
    "id": 1,
    "name": "Diseño",
    "participation": "Depende"
}
```

---

#### Eliminar un position
```
DELETE /position/:id
```
**Respuesta `204 No Content`**

---

### Users

#### Crear usuario
```
POST /users
```
**Body:**
```json
{
    "name": "Jhon Doe",
    "email": "jhondoe@udea.edu.co",
    "password": "12345678",
    "roleId": 1
}
```
> `roleId`: `1` = admin, `2` = user

**Respuesta `201`:**
```json
{
    "id": 1,
    "name": "Jhon Doe",
    "email": "jhondoe@udea.edu.co",
    "password": "12345678",
    "createdAt": "2026-05-26T19:48:08.849Z",
    "role": {
        "id": 1,
        "name": "admin"
    }
}
```

---

#### Obtener todos los usuarios
```
GET /users
```
**Respuesta `200`:**
```json
[
    {
        "id": 1,
        "name": "Jhon Doe",
        "email": "jhondoe@udea.edu.co",
        "createdAt": "2026-05-26T19:48:08.849Z",
        "role": {
            "id": 1,
            "name": "admin"
        }
    }
]
```

---

#### Obtener un usuario por id
```
GET /users/:id
```
**Respuesta `200`:**
```json
{
    "id": 1,
    "name": "Jhon Doe",
    "email": "jhondoe@udea.edu.co",
    "createdAt": "2026-05-26T19:48:08.849Z",
    "role": {
        "id": 1,
        "name": "admin"
    }
}
```

---

#### Actualizar un usuario
```
PATCH /users/:id
```
**Body (todos los campos son opcionales):**
```json
{
    "name": "Jhon Doe Actualizado",
    "roleId": 2
}
```
**Respuesta `200`:**
```json
{
    "id": 1,
    "name": "Jhon Doe Actualizado",
    "email": "jhondoe@udea.edu.co",
    "createdAt": "2026-05-26T19:48:08.849Z",
    "role": {
        "id": 2,
        "name": "user"
    }
}
```

---

#### Eliminar un usuario
```
DELETE /users/:id
```
**Respuesta `204 No Content`**

---

### Resources

#### Crear recurso
```
POST /resources
```
**Body:**
```json
{
    "title": "Video explicativo",
    "description": "Video corto para explicar un concepto",
    "hidden": false,
    "categoryIds": [1],
    "positionIds": [1],
    "complexityRefs": [
        {
            "level": 1,
            "description": "Ejemplo básico",
            "link": "https://www.youtube.com"
        }
    ]
}
```
> `categoryIds` y `positionIds` son arrays de IDs. `complexityRefs` puede estar vacío `[]`.

**Respuesta `201`:**
```json
{
    "id": 1,
    "title": "Video explicativo",
    "description": "Video corto para explicar un concepto",
    "hidden": false,
    "deletedAt": null,
    "complexityRefs": [
        {
            "id": 1,
            "level": 1,
            "description": "Ejemplo básico",
            "link": "https://www.youtube.com"
        }
    ],
    "categories": [
        {
            "id": 1,
            "name": "Video",
            "icon": "video"
        }
    ],
    "position": [
        {
            "id": 1,
            "name": "Guion",
            "participation": "Si"
        }
    ]
}
```

---

#### Obtener todos los recursos
```
GET /resources
```
> Solo retorna recursos activos (no eliminados con soft delete).

**Respuesta `200`:** Array de recursos con el mismo formato de arriba.

---

#### Obtener un recurso por id
```
GET /resources/:id
```
**Respuesta `200`:** Objeto recurso con el mismo formato de arriba.

---

#### Actualizar un recurso
```
PATCH /resources/:id
```
**Body (todos los campos son opcionales):**
```json
{
    "title": "Nuevo título",
    "hidden": true,
    "categoryIds": [1, 2],
    "positionIds": [1, 2]
}
```
**Respuesta `200`:** Objeto recurso actualizado.

---

#### Eliminar un recurso (soft delete)
```
DELETE /resources/:id
```
> El recurso **no se borra** de la base de datos. Solo se marca con la fecha de eliminación en `deletedAt`. No aparecerá en el `GET /resources`.

**Respuesta `204 No Content`**

---

#### Restaurar un recurso eliminado
```
PATCH /resources/:id/restore
```
> Restaura un recurso que fue eliminado con soft delete. Pone `deletedAt` en `null` nuevamente.

**Respuesta `200`:** Objeto recurso restaurado.

---

#### Alternar visibilidad de un recurso
```
PATCH /resources/:id/visibility
```
> Invierte el valor del campo `hidden`. Si estaba `true` pasa a `false` y viceversa.

**Respuesta `200`:** Objeto recurso con el campo `hidden` invertido.

---

## Códigos de respuesta

| Código | Descripción |
|---|---|
| `200` | OK — operación exitosa |
| `201` | Created — recurso creado |
| `204` | No Content — eliminación exitosa |
| `400` | Bad Request — datos inválidos |
| `404` | Not Found — recurso no encontrado |

---

## Tecnologías

| Tecnología | Versión |
|---|---|
| NestJS | 11 |
| TypeORM | latest |
| MariaDB | 10.11 |
| Node.js | 18+ |
| TypeScript | 5.7 |

---

*Ude@ Educación Virtual — Universidad de Antioquia*

