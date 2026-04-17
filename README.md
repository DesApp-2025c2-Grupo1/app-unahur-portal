# app-unahur-portal

## Documentación

La documentación de la API se encuentra en la ruta: http://localhost:{PORT}/api-docs

## Configuración

### Variables de entorno
```bash
PORT={PORT}
DB_HOST={DB_HOST} 
DB_PORT={DB_PORT}
DB_USER={DB_USER}
DB_PASSWORD={DB_PASSWORD}
DB_NAME={DB_NAME}
```

### Configuración de docker-compose

Levantar primero la base de datos:

```bash
docker-compose up -d
```

Detener el servicio:
```bash
docker-compose down
```

## Comandos locales

Levantar el servicio localmente:

1° Instalar dependencias:
```bash
npm install
```

2° Levantar el servicio:
```bash
npm run dev
```

## Testing

Correr los tests:
```bash
npm test
```
