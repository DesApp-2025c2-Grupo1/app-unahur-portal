# app-unahur-portal

## Documentación

La documentación de la API se encuentra en la ruta: http://localhost:{PORT}/api-docs

## Configuración

### Variables de entorno
```bash
PORT={PORT}
```

### Configuración de docker-compose
```bash
docker-compose up -d # Levanta el servicio en segundo plano
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
