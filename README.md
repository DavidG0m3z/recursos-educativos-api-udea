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
JWT_SECRET=supersecretkey_udea_2026
JWT_EXPIRES_IN=24h
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
│       ├── participation.enum.ts
│       └── role.enum.ts
├── modules/
│   ├── auth/
│   │   ├── decorators/
│   │   │   ├── public.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   └── auth.service.ts
│   ├── categories/
│   │   ├── dto/
│   │   │   ├── create-category.dto.ts
│   │   │   └── update-category.dto.ts
│   │   ├── entities/
│   │   │   └── category.entity.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   ├── categories.service.spec.ts
│   │   └── categories.service.ts
│   ├── position/
│   │   ├── dto/
│   │   │   ├── create-position.dto.ts
│   │   │   └── update-position.dto.ts
│   │   ├── entities/
│   │   │   └── position.entity.ts
│   │   ├── position.controller.ts
│   │   ├── position.module.ts
│   │   ├── position.service.spec.ts
│   │   └── position.service.ts
│   ├── resources/
│   │   ├── dto/
│   │   │   ├── complexity-ref.dto.ts
│   │   │   ├── create-resource.dto.ts
│   │   │   ├── resource-position.dto.ts
│   │   │   └── update-resource.dto.ts
│   │   ├── entities/
│   │   │   ├── complexity-ref.entity.ts
│   │   │   ├── resource-position.entity.ts
│   │   │   └── resource.entity.ts
│   │   ├── resources.controller.ts
│   │   ├── resources.module.ts
│   │   ├── resources.service.spec.ts
│   │   └── resources.service.ts
│   ├── roles/
│   │   ├── entities/
│   │   │   └── role.entity.ts
│   │   ├── roles.module.ts
│   │   └── roles-seeder.service.ts
│   └── users/
│       ├── dto/
│       │   ├── create-user.dto.ts
│       │   └── update-user.dto.ts
│       ├── entities/
│       │   └── user.entity.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       ├── users.service.spec.ts
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
| `resources_positions` | Relación N:M entre recursos y positions — incluye campo `participation` |
| `roles` | Roles de usuario (admin, user) |
| `users` | Usuarios de la plataforma |

---

## Autenticación y autorización

La API usa **JWT (JSON Web Tokens)** para autenticación y un sistema de roles para autorización.

> **Todos los endpoints requieren token**, excepto `POST /auth/login` y `POST /auth/register`.

### Roles

| Rol | Permisos |
|---|---|
| `admin` | Lectura y escritura — acceso total a todos los endpoints |
| `user` | Solo lectura — acceso únicamente a endpoints GET |

### Permisos por método HTTP

| Método | Rol requerido |
|---|---|
| `GET` | `admin` o `user` |
| `POST` | Solo `admin` |
| `PATCH` | Solo `admin` |
| `DELETE` | Solo `admin` |

### Cómo usar el token en Postman

1. Hacer login en `POST /auth/login` y copiar el `access_token`
2. En cada request ir a **Authorization → Bearer Token**
3. Pegar el token en el campo **Token**

### Códigos de error de autenticación

| Código | Descripción |
|---|---|
| `401 Unauthorized` | Token ausente o inválido |
| `403 Forbidden` | Token válido pero rol insuficiente |

---

## Documentación interactiva (Swagger)

La API cuenta con documentación interactiva generada automáticamente con **Swagger**.

Una vez que la aplicación esté corriendo, accede a: `http://localhost:3000/api`.

Desde ahí puedes ver y probar todos los endpoints directamente en el navegador.

### Cómo autenticarte en Swagger

1. Hacer login en `POST /auth/login` con tus credenciales
2. Copiar el `access_token` de la respuesta
3. Hacer clic en el botón **Authorize** en la esquina superior derecha
4. Pegar el token en el campo **Value** y hacer clic en **Authorize**
5. Todos los endpoints protegidos usarán ese token automáticamente

---

## Endpoints

La URL base es `http://localhost:3000`.

Los endpoints marcados con 🔒 requieren token con rol `admin`.
Los endpoints marcados con 👁 requieren token con rol `admin` o `user`.
Los endpoints marcados con 🌐 son públicos y no requieren token.

```
Authorization: Bearer <token>
```

---

### Auth

#### Registro de usuario 🌐

```
POST /auth/register
```

> Endpoint público para crear el primer usuario administrador.

**Body:**

```json
{
    "name": "Admin Ude@",
    "email": "admin@udea.edu.co",
    "password": "12345678",
    "roleId": 1
}
```

> `roleId`: `1` = admin, `2` = user

**Respuesta `201`:**

```json
{
    "id": 1,
    "name": "Admin Ude@",
    "email": "admin@udea.edu.co",
    "password": "$2b$10$...",
    "createdAt": "2026-05-29T00:12:57.419Z",
    "role": {
        "id": 1,
        "name": "admin"
    }
}
```

---

#### Login 🌐

```
POST /auth/login
```

**Body:**

```json
{
    "email": "admin@udea.edu.co",
    "password": "12345678"
}
```

**Respuesta `200`:**

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "Admin Ude@",
        "email": "admin@udea.edu.co",
        "role": "admin"
    }
}
```

---

### Categories

#### Crear categoría 🔒

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

#### Obtener todas las categorías 👁

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

#### Obtener una categoría por id 👁

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

#### Actualizar una categoría 🔒

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

#### Eliminar una categoría 🔒

```
DELETE /categories/:id
```

**Respuesta `204 No Content`**

---

### Positions

> Los positions solo tienen `name`. El campo `participation` ahora vive en la relación con el recurso — se define al crear o actualizar un recurso.

#### Crear position 🔒

```
POST /position
```

**Body:**

```json
{
    "name": "Guion"
}
```

**Respuesta `201`:**

```json
{
    "id": 1,
    "name": "Guion"
}
```

---

#### Obtener todos los positions 👁

```
GET /position
```

**Respuesta `200`:**

```json
[
    {
        "id": 1,
        "name": "Guion"
    }
]
```

---

#### Obtener un position por id 👁

```
GET /position/:id
```

**Respuesta `200`:**

```json
{
    "id": 1,
    "name": "Guion"
}
```

---

#### Actualizar un position 🔒

```
PATCH /position/:id
```

**Body (todos los campos son opcionales):**

```json
{
    "name": "Diseño"
}
```

**Respuesta `200`:**

```json
{
    "id": 1,
    "name": "Diseño"
}
```

---

#### Eliminar un position 🔒

```
DELETE /position/:id
```

**Respuesta `204 No Content`**

---

### Users

#### Crear usuario 🔒

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
    "password": "$2b$10$...",
    "createdAt": "2026-05-26T19:48:08.849Z",
    "role": {
        "id": 1,
        "name": "admin"
    }
}
```

---

#### Obtener todos los usuarios 🔒

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

#### Obtener un usuario por id 🔒

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

#### Actualizar un usuario 🔒

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

#### Eliminar un usuario 🔒

```
DELETE /users/:id
```

**Respuesta `204 No Content`**

---

### Resources

#### Crear recurso 🔒

```
POST /resources
```

> Cada position se envía con su propio valor de `participation`. Los valores válidos son `Si`, `No`, `Depende`.

**Body:**

```json
{
    "title": "Video explicativo",
    "description": "Video corto para explicar un concepto",
    "hidden": false,
    "categoryIds": [1],
    "positions": [
        {
            "positionId": 1,
            "participation": "Si"
        }
    ],
    "complexityRefs": [
        {
            "level": 1,
            "description": "Ejemplo básico",
            "link": "https://www.youtube.com"
        }
    ]
}
```

> `categoryIds` es un array de IDs. `positions` es un array de objetos con `positionId` y `participation`. `complexityRefs` puede estar vacío `[]`.

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
    "resourcePositions": [
        {
            "id": 1,
            "participation": "Si",
            "position": {
                "id": 1,
                "name": "Guion"
            }
        }
    ]
}
```

---

#### Obtener todos los recursos 👁

```
GET /resources
```

> Solo retorna recursos activos (no eliminados con soft delete).

**Respuesta `200`:** Array de recursos con el mismo formato de arriba.

---

#### Obtener un recurso por id 👁

```
GET /resources/:id
```

**Respuesta `200`:** Objeto recurso con el mismo formato de arriba.

---

#### Actualizar un recurso 🔒

```
PATCH /resources/:id
```

**Body (todos los campos son opcionales):**

```json
{
    "title": "Nuevo título",
    "hidden": true,
    "categoryIds": [1, 2],
    "positions": [
        {
            "positionId": 1,
            "participation": "Depende"
        },
        {
            "positionId": 2,
            "participation": "No"
        }
    ]
}
```

**Respuesta `200`:** Objeto recurso actualizado.

---

#### Eliminar un recurso (soft delete) 🔒

```
DELETE /resources/:id
```

> El recurso **no se borra** de la base de datos. Solo se marca con la fecha de eliminación en `deletedAt`. No aparecerá en el `GET /resources`.

**Respuesta `204 No Content`**

---

#### Restaurar un recurso eliminado 🔒

```
PATCH /resources/:id/restore
```

> Restaura un recurso que fue eliminado con soft delete. Pone `deletedAt` en `null` nuevamente.

**Respuesta `200`:** Objeto recurso restaurado.

---

#### Alternar visibilidad de un recurso 🔒

```
PATCH /resources/:id/visibility
```

> Invierte el valor del campo `hidden`. Si estaba `true` pasa a `false` y viceversa.

**Respuesta `200`:** Objeto recurso con el campo `hidden` invertido.

---

## Pruebas unitarias

El proyecto incluye pruebas unitarias para todos los services usando **Jest** con el patrón **AAA (Arrange, Act, Assert)**.

```bash
# Correr todas las pruebas
npm run test

# Correr pruebas con cobertura
npm run test:cov
```

| Archivo | Cobertura |
|---|---|
| `resources.service.spec.ts` | CRUD, soft delete, restore, toggleVisibility |
| `categories.service.spec.ts` | CRUD completo |
| `position.service.spec.ts` | CRUD completo |
| `users.service.spec.ts` | CRUD, hash de contraseña, cambio de rol |
| `auth.service.spec.ts` | Login exitoso, credenciales inválidas, generación de token |

---

## Códigos de respuesta

| Código | Descripción |
|---|---|
| `200` | OK — operación exitosa |
| `201` | Created — recurso creado |
| `204` | No Content — eliminación exitosa |
| `400` | Bad Request — datos inválidos |
| `401` | Unauthorized — token ausente o inválido |
| `403` | Forbidden — rol insuficiente |
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
| JWT | @nestjs/jwt |
| Bcrypt | bcrypt |
| Swagger | @nestjs/swagger |
| Jest | 30 |

---

*Ude@ Educación Virtual — Universidad de Antioquia*