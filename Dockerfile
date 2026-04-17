# Instalar dependencias
FROM node:24-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 9002

# Comando de arranque
CMD ["npm", "run", "dev"]