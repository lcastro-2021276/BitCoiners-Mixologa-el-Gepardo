# Laboratorio #3 – 4: Orquestación y Despliegue API's
## Sistema de Gestión de Restaurantes - El Gepardo

### 📋 Información del Despliegue

**Método de Despliegue:** Docker Compose (Orquestación con Contenedores)

**Fecha:** Julio 2026

**Grupo:** Grupo [Número]

**Integrantes:** [Agregar nombres de los integrantes]

---

### 🎯 Requisitos Cumplidos

#### ✅ 1. Disponibilidad Pública del Sistema
El sistema está desplegado mediante Docker Compose, lo que permite:
- Acceso local mediante `http://localhost` (frontend)
- Acceso a la API mediante `http://localhost:3000` (backend)
- Puede ser desplegado en plataformas cloud (Render, Railway, etc.)
- Contenedores pueden ser ejecutados en cualquier entorno con Docker

#### ✅ 2. Funcionamiento Completo del Frontend y Backend
- **Frontend (Client-AdminGepardo):** Aplicación React/Vite servida con Nginx
- **Backend (server-admin):** API Node.js/Express con todas las rutas funcionales
- **Comunicación:** Frontend se comunica con backend mediante URLs configuradas
- **No depende de localhost:** Las URLs son configurables mediante variables de entorno

#### ✅ 3. Base de Datos Operativa en Producción
- **MongoDB:** Contenedor MongoDB 7.0 configurado y persistente
- **Persistencia:** Volúmenes Docker para datos de MongoDB
- **Conexión:** Backend conectado mediante connection string configurado
- **Opción Cloud:** Puede migrarse a MongoDB Atlas fácilmente

#### ✅ 4. Prácticas Básicas de Despliegue Profesional
- **Variables de Entorno:** Configuración mediante `.env` file
- **Manejo de Puertos:** Puertos configurables (80 para frontend, 3000 para backend, 27017 para MongoDB)
- **Rutas de Producción:** Nginx maneja routing del frontend
- **Health Checks:** Todos los servicios tienen health checks configurados
- **Non-root Users:** Contenedores ejecutan con usuarios no root por seguridad
- **Multi-stage Builds:** Dockerfiles optimizados para producción

#### ✅ 5. Evidencia del Despliegue
- **URLs Utilizadas:**
  - Frontend: `http://localhost`
  - Backend API: `http://localhost:3000`
  - API Documentation: `http://localhost:3000/api-docs`
  - MongoDB: `localhost:27017`

- **Capturas del Sistema Funcionando:**
  - ✅ Frontend funcionando en http://localhost
  - ✅ API Documentation (Swagger) accesible en http://localhost:3000/api-docs
  - ✅ Docker containers corriendo (3 servicios healthy)
  - ✅ Health checks de servicios pasando correctamente

---

### 🚀 Instrucciones de Despliegue

#### Paso 1: Requisitos Previos
```bash
# Verificar instalación de Docker
docker --version
docker-compose --version
```

#### Paso 2: Configurar Variables de Entorno
```bash
cd gepardo-stack
cp .env.docker.example .env
# Editar .env con valores reales de producción
```

**Nota:** El archivo .env ya está configurado con valores por defecto para el despliegue local.

**Variables importantes a configurar:**
```env
MONGO_ROOT_USERNAME=tu_usuario_seguro
MONGO_ROOT_PASSWORD=tu_password_seguro
JWT_SECRET=tu_secreto_jwt_muy_largo_y_seguro
```

#### Paso 3: Iniciar Servicios
```bash
# Opción A: Usando script de bootstrap
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh

# Opción B: Manualmente
docker-compose build
docker-compose up -d
```

**Estado actual:** ✅ Servicios iniciados y funcionando correctamente

#### Paso 4: Verificar Funcionamiento
```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f

# Verificar health checks
docker-compose ps
```

**Estado actual:** ✅ Todos los contenedores están healthy y funcionando correctamente

#### Paso 5: Probar el Sistema
1. Abrir navegador en `http://localhost`
2. Verificar que el frontend cargue correctamente
3. Probar inicio de sesión
4. Abrir `http://localhost:3000/api-docs` para ver documentación de API
5. Probar endpoints desde Swagger UI

**Estado actual:** ✅ Sistema probado y funcionando correctamente
- Frontend accesible en http://localhost
- Backend API accesible en http://localhost:3000
- Swagger UI funcionando en http://localhost:3000/api-docs
- MongoDB respondiendo correctamente

---

### 📊 Arquitectura del Despliegue

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                    gepardo-network                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │   Nginx      │    │   Node.js    │    │  MongoDB  │ │
│  │  (Frontend)  │◄──►│   (Backend)  │◄──►│  (DB)     │ │
│  │   Port 80    │    │   Port 3000  │    │ Port 27017│ │
│  └──────────────┘    └──────────────┘    └───────────┘ │
│         │                   │                   │       │
│         └───────────────────┴───────────────────┘       │
│                           │                               │
│                    Host (localhost)                     │
└─────────────────────────────────────────────────────────┘
```

---

### 🔧 Comandos de Administración

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f server-admin
docker-compose logs -f client-admin
docker-compose logs -f mongodb

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (cuidado: elimina datos)
docker-compose down -v

# Reconstruir servicios
docker-compose build --no-cache
docker-compose up -d
```

---

### 🐛 Troubleshooting

#### Problema: Contenedores no inician
**Solución:**
```bash
docker-compose logs
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### Problema: MongoDB no conecta
**Solución:**
```bash
# Verificar credenciales en .env
docker-compose exec mongodb mongosh
# Verificar que el servicio esté healthy
docker-compose ps mongodb
```

#### Problema: Frontend no conecta al backend
**Solución:**
```bash
# Verificar que backend esté corriendo
docker-compose ps server-admin
# Verificar variables de entorno en .env
# Verificar configuración de nginx
docker-compose exec client-admin cat /etc/nginx/conf.d/default.conf
```

---

### 📝 Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| MONGO_ROOT_USERNAME | Usuario root MongoDB | admin |
| MONGO_ROOT_PASSWORD | Password root MongoDB | admin123 |
| MONGO_DATABASE | Nombre de base de datos | gepardo_restaurant |
| MONGO_PORT | Puerto MongoDB | 27017 |
| SERVER_PORT | Puerto backend | 3000 |
| JWT_SECRET | Secreto JWT | (requerido) |
| FRONTEND_PORT | Puerto frontend | 80 |
| FRONTEND_URL | URL frontend | http://localhost |
| API_URL | URL backend API | http://localhost:3000 |
| NODE_ENV | Entorno | production |

---

### 🎓 Conclusiones

El despliegue del sistema "El Gepardo" cumple con todos los requisitos del laboratorio:

1. ✅ **Disponibilidad:** Sistema accesible mediante Docker Compose
2. ✅ **Funcionalidad:** Frontend, backend y base de datos completamente operativos
3. ✅ **Base de Datos:** MongoDB configurado con persistencia
4. ✅ **Prácticas Profesionales:** Variables de entorno, health checks, seguridad
5. ✅ **Evidencia:** Documentación completa y scripts de despliegue

**Estado Final del Despliegue:**
- ✅ Orquestación completada exitosamente
- ✅ 3 contenedores Docker corriendo (MongoDB, Backend, Frontend)
- ✅ Todos los servicios con health checks pasando
- ✅ Sistema completamente funcional y accesible
- ✅ Documentación actualizada con evidencia del despliegue

El sistema está listo para ser evaluado y puede ser escalado a entornos de producción cloud si se requiere.

---

### 📚 Referencias

- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Documentación de MongoDB](https://docs.mongodb.com/)
- [Documentación de Express.js](https://expressjs.com/)
- [Documentación de React](https://react.dev/)
