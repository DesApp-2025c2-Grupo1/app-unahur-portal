# Portal de la Universidad Nacional de Hurlingham (UNAHUR)

Este proyecto es el backend para el portal de la UNAHUR, construido con Node.js, Express y PostgreSQL.

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## 🛠️ Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd app-unahur-portal
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente configuración (ajusta según sea necesario):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=app-unahur-portal
JWT_SECRET=tu_secreto_super_seguro
```

> [!NOTE]
> El puerto de la base de datos en `docker-compose` está mapeado al **5433** para evitar conflictos con instalaciones locales de PostgreSQL.

## 🐳 Docker y Base de Datos

### Levantar los servicios (PostgreSQL + pgAdmin)
```bash
docker-compose up -d
```

Esto levantará:
- **PostgreSQL**: puerto 5433
- **pgAdmin**: http://localhost:8080 (Credenciales en docker-compose.yml)

### Inicializar la Base de Datos
Debes ejecutar las migraciones y las semillas para tener la estructura y datos básicos:

```bash
# Correr migraciones
npm run migrate

# Correr semillas (Roles y Usuario Admin)
npm run seed
```

## 💻 Desarrollo Local

Para iniciar el servidor en modo desarrollo con recarga automática:
```bash
npm run dev
```

El servidor estará corriendo en: [http://localhost:5000](http://localhost:5000)

## 📖 Documentación de la API (Swagger)

Una vez levantada la aplicación, puedes acceder a la documentación interactiva en:
[http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor con `node --watch`.
- `npm run migrate`: Ejecuta las migraciones pendientes.
- `npm run rollback`: Revierte la última migración.
- `npm run rollback-all`: Revierte todas las migraciones.
- `npm run seed`: Puebla la base de datos con datos de prueba.
- `npm test`: Ejecuta los tests con Jest.

## 📁 Estructura del Proyecto

- `src/config`: Configuraciones (DB, Swagger, etc.)
- `src/database`: Migraciones y Semillas de Knex.
- `src/modules`: Lógica de negocio dividida por módulos (Auth, etc.)
  - `routes/`: Definición de endpoints.
  - `services/`: Lógica de control.
  - `repositories/`: Consultas a la base de datos.
  - `utils/`: Utilidades y servicios compartidos.
