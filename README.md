# 🏥 ms-unahur-portal (Backend)

Sistema de gestión para el Portal de Medicina Integral UNAHUR. Este microservicio se encarga de la autenticación, gestión de afiliados y notificaciones por correo electrónico.

## 🚀 Tecnologías
- **Runtime:** Node.js (v24+)
- **Framework:** Express.js
- **Base de Datos:** PostgreSQL
- **Query Builder:** Knex.js
- **Seguridad:** JWT (Cookies HttpOnly) & Bcrypt
- **Validación:** Joi
- **Mails:** Nodemailer + Mailpit (Docker)

## 🛠️ Instalación y Ejecución

### Requisitos previos
- Docker & Docker Compose
- Node.js instalado (para desarrollo local)

### Configuración inicial
1. Clona el repositorio.
2. Asegúrate de tener el archivo `.env` configurado.
3. Copia el archivo de ejemplo de variables de entorno si no existe:
   ```bash
   cp .env.example .env (si aplica)
   ```

### Levantar con Docker (Recomendado)
```bash
docker-compose up -d --build
```
*El sistema estará disponible en el puerto configurado (ej. 9002).*

### Migraciones y Datos de Prueba
Para inicializar la base de datos y cargar los datos iniciales:
```bash
npm run migrate  # Crea las tablas (si tienes knex global o vía script)
npm run seed     # Carga planes, roles y usuarios iniciales
```

## 📂 Organización del Proyecto
El proyecto sigue una arquitectura modular y principios de Responsabilidad Única:
- `src/config/`: Configuraciones globales (DB, Mail, Swagger).
- `src/database/`: Migraciones y seeds de Knex.
- `src/modules/`: Lógica de negocio dividida por dominio:
    - `auth/`: Autenticación, registro interno y gestión de tokens.
    - `affiliates/`: Gestión de afiliados, estados y grupos familiares. Incluye validaciones con Joi y transacciones atómicas.
    - `mail/`: Servicio de notificaciones con sistema de caché de plantillas para alto rendimiento.

## 📧 Pruebas de Correo (Mailpit)
Para visualizar los correos enviados por el sistema en desarrollo:
1. Asegúrate de que el contenedor `mailpit` esté corriendo.
2. Accede a: **`http://localhost:8025`**

## 🔒 Seguridad e Integridad
- **Transacciones SQL:** El registro de afiliados utiliza transacciones para asegurar que no se creen usuarios sin su afiliación correspondiente (o viceversa).
- **Validación de Esquema:** Todas las entradas al sistema son validadas con `Joi` antes de ser procesadas.
- **Cookies HttpOnly:** Los tokens JWT se manejan vía cookies para prevenir ataques XSS.
- **BCrypt:** Hashing de contraseñas con factor de costo 10.
