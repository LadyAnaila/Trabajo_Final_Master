# Trabajo Final de Máster

# Manual de instalación y despliegue

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- npm (gestor de paquetes de Node.js)
- Angular CLI  
  ```bash
  npm install -g @angular/cli
  ```
- PostgreSQL instalado y funcionando en local
---

## Instalación y configuración de la base de datos

1. Crea una base de datos vacía en PostgreSQL.
2. Restaura tu backup ejecutando:
   ```bash
   psql -U TU_USUARIO -d NOMBRE_DE_TU_DB -f ruta/al/backup.sql
   ```
   
---


## Backend (Node.js + Express)

1. Clona el repositorio o descarga el código fuente.
2. Entra en la carpeta del backend:
   ```bash
   cd backend
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:
   ```env
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nombre_de_tu_db
   JWT_SECRET=un_secreto_seguro
   ```
5. Inicia el backend:
   ```bash
   npm start
   ```
6. El backend estará disponible en `http://localhost:5000`

---

## Frontend (Angular)

1. Entra en la carpeta del frontend:
   ```bash
   cd tabletop_manager
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Asegúrate de que los servicios Angular (por ejemplo, `user.service.ts`, `auth.service.ts`, etc.) apunten a la API local:
   ```ts
   private apiUrl = 'http://localhost:5000/api';
   ```
4. Inicia Angular en modo desarrollo:
   ```bash
   ng serve
   ```
5. El frontend estará disponible en `http://localhost:4200`

---
