# API de Gestión de Talento Humano

API REST completa con sistema de autenticación JWT, autorización basada en roles y gestión de funcionarios, grupo familiar y estudios.

## Requisitos

- Node.js >= 14
- MySQL >= 5.7

## Instalación

1. Clonar el repositorio

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   - Copiar `env.example` como `.env`
   - Editar `.env` con tus credenciales de MySQL y un JWT_SECRET seguro

```bash
# Ejemplo de .env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=talento_humano
DB_USER=root
DB_PASSWORD=tu_password
JWT_SECRET=clave_secreta_muy_segura
JWT_EXPIRES_IN=24h
```

4. Crear la base de datos en MySQL:

```sql
CREATE DATABASE talento_humano;
```

5. Inicializar la base de datos y crear usuario admin:

```bash
npm run init-db
```

6. Iniciar el servidor:

```bash
npm start
# o en modo desarrollo
npm run dev
```

## Endpoints

### Autenticación

| Método | Ruta              | Descripción            | Acceso      |
| ------ | ----------------- | ---------------------- | ----------- |
| POST   | `/api/auth/login` | Iniciar sesión         | Público     |
| GET    | `/api/auth/me`    | Obtener usuario actual | Autenticado |

### Usuarios

| Método | Ruta                     | Descripción        | Acceso              |
| ------ | ------------------------ | ------------------ | ------------------- |
| POST   | `/api/usuarios/register` | Registrar usuario  | Solo ADMIN          |
| GET    | `/api/usuarios`          | Listar usuarios    | ADMIN, USER, GESTOR |
| GET    | `/api/usuarios/:id`      | Obtener usuario    | ADMIN, USER, GESTOR |
| PUT    | `/api/usuarios/:id`      | Actualizar usuario | Solo ADMIN          |
| DELETE | `/api/usuarios/:id`      | Eliminar usuario   | Solo ADMIN          |

### Funcionarios

| Método | Ruta                    | Descripción          | Acceso              |
| ------ | ----------------------- | -------------------- | ------------------- |
| GET    | `/api/funcionarios`     | Listar funcionarios  | ADMIN, USER, GESTOR |
| GET    | `/api/funcionarios/:id` | Obtener funcionario  | ADMIN, USER, GESTOR |
| POST   | `/api/funcionarios`     | Crear funcionario    | ADMIN, GESTOR       |
| PUT    | `/api/funcionarios/:id` | Actualizar           | ADMIN, GESTOR       |
| DELETE | `/api/funcionarios/:id` | Eliminar funcionario | Solo ADMIN          |

### Grupo Familiar

| Método | Ruta                               | Descripción       | Acceso              |
| ------ | ---------------------------------- | ----------------- | ------------------- |
| GET    | `/api/funcionarios/:id/familiares` | Listar familiares | ADMIN, USER, GESTOR |
| POST   | `/api/funcionarios/:id/familiares` | Agregar familiar  | ADMIN, GESTOR       |
| PUT    | `/api/familiares/:id`              | Actualizar        | ADMIN, GESTOR       |
| DELETE | `/api/familiares/:id`              | Eliminar familiar | Solo ADMIN          |

### Estudios

| Método | Ruta                             | Descripción      | Acceso              |
| ------ | -------------------------------- | ---------------- | ------------------- |
| GET    | `/api/funcionarios/:id/estudios` | Listar estudios  | ADMIN, USER, GESTOR |
| POST   | `/api/funcionarios/:id/estudios` | Agregar estudio  | ADMIN, GESTOR       |
| PUT    | `/api/estudios/:id`              | Actualizar       | ADMIN, GESTOR       |
| DELETE | `/api/estudios/:id`              | Eliminar estudio | Solo ADMIN          |

## Uso de la API

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo": "admin@sistema.com", "password": "admin123"}'
```

Respuesta:

```json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "correo": "admin@sistema.com",
    "rol": "admin"
  }
}
```

### Usar el token

Incluir el token en el header `Authorization`:

```bash
curl http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
```

### Registrar nuevo usuario (requiere ser admin)

```bash
curl -X POST http://localhost:3000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token_admin>" \
  -d '{
    "nombre": "Juan Pérez",
    "correo": "juan@ejemplo.com",
    "password": "password123",
    "rol": "user"
  }'
```

### Crear funcionario

```bash
curl -X POST http://localhost:3000/api/funcionarios \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "tipo_identificacion": "CC",
    "numero_identificacion": "1008888888",
    "nombres": "Laura",
    "apellidos": "Rodríguez Torres",
    "estado_civil": "Soltera",
    "sexo": "F",
    "direccion": "Calle 80 #25-40",
    "telefono": "3157778899",
    "fecha_nacimiento": "1995-07-20"
  }'
```

### Obtener funcionarios con relaciones

```bash
curl http://localhost:3000/api/funcionarios/1 \
  -H "Authorization: Bearer <token>"
```

Respuesta incluye familiares y estudios:

```json
{
  "funcionario": {
    "id_funcionario": 1,
    "nombres": "Carlos",
    "apellidos": "Pérez López",
    "familiares": [...],
    "estudios": [...]
  }
}
```

## Roles disponibles

- **`admin`**: Acceso completo a todos los recursos. Puede crear/editar/eliminar usuarios, funcionarios, familiares y estudios.
- **`gestor`**: Puede gestionar funcionarios (crear/editar), agregar familiares y estudios. No puede eliminar ni gestionar usuarios.
- **`user`**: Solo consulta. Puede ver usuarios y funcionarios pero no modificarlos.

## Estructura del proyecto

```
├── app.js                 # Punto de entrada
├── config/
│   └── database.js        # Configuración de Sequelize
├── controllers/
│   ├── authController.js  # Login y autenticación
│   └── usuarioController.js # CRUD de usuarios
├── middlewares/
│   ├── authMiddleware.js  # Verificar JWT
│   └── roleMiddleware.js  # Verificar roles
├── models/
│   ├── index.js           # Exportar modelos y relaciones
│   ├── Usuario.js         # Modelo de usuario
│   ├── Funcionario.js     # Modelo de funcionario
│   ├── GrupoFamiliar.js   # Modelo de grupo familiar
│   └── Estudio.js         # Modelo de estudios
├── routes/
│   ├── authRoutes.js          # Rutas de autenticación
│   ├── usuarioRoutes.js       # Rutas de usuarios
│   ├── funcionarioRoutes.js   # Rutas de funcionarios
│   ├── grupoFamiliarRoutes.js # Rutas de grupo familiar
│   └── estudioRoutes.js       # Rutas de estudios
├── scripts/
│   ├── init-db.js         # Inicializar BD
│   └── datos-ejemplo.sql  # Datos de ejemplo
└── env.example            # Ejemplo de variables de entorno

## Relaciones de la Base de Datos

- **Funcionario** tiene muchos **GrupoFamiliar** (familiares)
- **Funcionario** tiene muchos **Estudio** (estudios)
- DELETE CASCADE: Al eliminar un funcionario, se eliminan sus familiares y estudios
```

## Usuario por defecto

Al ejecutar `npm run init-db` se crea:

- **Correo:** admin@sistema.com
- **Contraseña:** admin123
- **Rol:** admin

**¡Importante!** Cambiar la contraseña del administrador después del primer login.
