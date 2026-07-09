# Gepardo Stack - Docker Compose Deployment

Esta estructura permite desplegar el proyecto "El Gepardo - Hamburguesas & Mixología" utilizando Docker Compose para orquestar todos los servicios.

## 📁 Estructura

```
gepardo-stack/
├── dockerfiles/
│   ├── Dockerfile.server-admin    # Dockerfile para el backend
│   ├── Dockerfile.client-admin    # Dockerfile para el frontend
│   └── nginx.conf                 # Configuración de nginx
├── scripts/
│   └── bootstrap.sh               # Script de inicialización
├── docker-compose.yml            # Orquestación de servicios
├── .env.docker.example          # Ejemplo de variables de entorno
├── .dockerignore                # Archivos a ignorar en Docker
└── README.md                    # Esta documentación
```

## 🚀 Servicios Incluidos

1. **MongoDB** - Base de datos NoSQL
2. **Server Admin** - Backend API (Node.js/Express)
3. **Client Admin** - Frontend Admin (React/Vite + Nginx)

## 📋 Requisitos Previos

- Docker instalado
- Docker Compose instalado
- Acceso a los archivos del proyecto

## 🔧 Configuración

1. **Copiar el archivo de entorno:**
   ```bash
   cd gepardo-stack
   cp .env.docker.example .env
   ```

2. **Editar el archivo `.env` con tus valores:**
   ```env
   MONGO_ROOT_USERNAME=tu_usuario
   MONGO_ROOT_PASSWORD=tu_password_seguro
   MONGO_DATABASE=gepardo_restaurant
   JWT_SECRET=tu_secreto_jwt_muy_seguro
   ```

## 🚀 Despliegue

### Opción 1: Usando el script de bootstrap (Recomendado)

```bash
cd gepardo-stack
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

### Opción 2: Manualmente

```bash
cd gepardo-stack

# Copiar y configurar variables de entorno
cp .env.docker.example .env
# Editar .env con tus valores

# Construir las imágenes
docker-compose build

# Iniciar los servicios
docker-compose up -d

# Verificar el estado
docker-compose ps
```

## 📊 Acceso a los Servicios

Una vez iniciado, los servicios estarán disponibles en:

- **Frontend Admin:** http://localhost
- **Backend API:** http://localhost:3000
- **API Documentation:** http://localhost:3000/api-docs
- **MongoDB:** localhost:27017

## 🔍 Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f server-admin
docker-compose logs -f client-admin
docker-compose logs -f mongodb

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (cuidado: elimina datos)
docker-compose down -v

# Reiniciar un servicio
docker-compose restart server-admin

# Reconstruir un servicio
docker-compose build server-admin
docker-compose up -d server-admin

# Ver estado de los servicios
docker-compose ps

# Ejecutar comandos en un contenedor
docker-compose exec server-admin sh
docker-compose exec mongodb mongosh
```

## 🔒 Seguridad en Producción

Para despliegue en producción:

1. **Cambiar contraseñas por defecto** en `.env`
2. **Usar MongoDB Atlas** en lugar de MongoDB local
3. **Configurar HTTPS** usando un proxy reverso
4. **Limitar acceso a MongoDB** desde IPs específicas
5. **Usar secrets de Docker** para variables sensibles

## 🐛 Troubleshooting

### Los servicios no inician
```bash
# Ver logs para identificar el problema
docker-compose logs

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
docker-compose exec mongodb mongosh

# Verificar las credenciales en .env
```

### Frontend no conecta al backend
```bash
# Verificar la variable API_URL en .env
# Verificar que el backend esté corriendo
docker-compose ps server-admin
```

## 📝 Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| MONGO_ROOT_USERNAME | Usuario root de MongoDB | admin |
| MONGO_ROOT_PASSWORD | Password root de MongoDB | admin123 |
| MONGO_DATABASE | Nombre de la base de datos | gepardo_restaurant |
| MONGO_PORT | Puerto de MongoDB | 27017 |
| SERVER_PORT | Puerto del backend | 3000 |
| JWT_SECRET | Secreto para JWT tokens | (requerido) |
| FRONTEND_PORT | Puerto del frontend | 80 |
| FRONTEND_URL | URL del frontend | http://localhost |
| API_URL | URL del backend API | http://localhost:3000 |
| NODE_ENV | Entorno de ejecución | production |

## 🎯 Para el Laboratorio

Este stack cumple con los requisitos del laboratorio:

✅ **Disponibilidad pública** - Puede ser desplegado en servicios cloud
✅ **Funcionamiento completo** - Frontend, backend y base de datos integrados
✅ **Base de datos operativa** - MongoDB configurado y conectado
✅ **Prácticas profesionales** - Variables de entorno, health checks, volúmenes
✅ **Evidencia del despliegue** - Documentación y scripts incluidos

## 📦 Alternativa: Despliegue en Cloud

Si prefieres desplegar en servicios cloud en lugar de Docker local:

1. **MongoDB Atlas** - Para la base de datos
2. **Render** o **Railway** - Para el backend
3. **Vercel** o **Netlify** - Para el frontend

Ver la documentación de despliegue cloud para más detalles.
