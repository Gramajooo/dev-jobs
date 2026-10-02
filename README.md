# 💼 DevJobs — Plataforma de Empleos Tech y Gestión de Talento

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite\&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter\&logoColor=white)](https://reactrouter.com/)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?logo=zod\&logoColor=white)](https://zod.dev/)

**DevJobs** es una plataforma web que conecta a desarrolladores con empresas que buscan talento tecnológico. Permite buscar empleos, enviar solicitudes y dar seguimiento a las postulaciones. También cuenta con herramientas para que las empresas publiquen ofertas y administren a sus candidatos.

---

## 🛠️ Desarrollo del proyecto

Para desarrollar DevJobs, utilicé herramientas de inteligencia artificial como apoyo para agilizar el trabajo, crear componentes y resolver tareas repetitivas.

La estructura, el diseño y la organización del proyecto se realizaron teniendo en cuenta buenas prácticas de desarrollo, con el objetivo de mantener un código ordenado, fácil de entender y sencillo de modificar.

Durante el proceso también se revisó y ajustó el código para mejorar su funcionamiento y facilitar futuras mejoras.

---

## 🚀 Características principales

### 🔍 Para desarrolladores

* **Búsqueda de empleos:** permite encontrar ofertas utilizando palabras clave y diferentes filtros.
* **Filtros avanzados:** búsqueda por tecnologías, modalidad de trabajo, experiencia, salario y tipo de jornada.
* **Detalles de las ofertas:** cada empleo cuenta con información sobre sus requisitos, responsabilidades, beneficios y salario.
* **Seguimiento de postulaciones:** permite consultar las solicitudes enviadas y revisar su estado.
* **Explorador de empresas:** muestra información de las empresas y sus ofertas de trabajo disponibles.

### 👔 Para reclutadores y administradores

* **Gestión de empleos:** permite crear, editar y eliminar ofertas laborales.
* **Gestión de candidatos:** facilita la revisión de las personas que se postulan a cada empleo.
* **Control de usuarios:** el sistema cuenta con diferentes roles y permisos:

  * `developer`: acceso a las funciones para buscar empleos y postularse.
  * `recruiter`: herramientas para publicar ofertas y gestionar candidatos.
  * `admin`: acceso a funciones de administración.

### 🔐 Seguridad y autenticación

* **Control de acceso:** cada usuario tiene acceso a las funciones que corresponden a su rol.
* **Manejo de sesiones:** el sistema utiliza tokens de acceso y renovación para mantener las sesiones activas.
* **Control de errores de autenticación:** incluye un sistema para manejar sesiones vencidas y evitar problemas con las solicitudes al servidor.

---

## 🛠️ Stack de tecnologías utilizadas

| Área            | Tecnologías                      |
| --------------- | -------------------------------- |
| **Frontend**    | React 19, TypeScript, Vite       |
| **Diseño**      | Tailwind CSS v4, Lucide React    |
| **Navegación**  | React Router DOM v7  (para manejar la navegación entre páginas.)             |
| **Estado**      | React Context API y Custom Hooks |
| **Formularios** | React Hook Form y Zod (para validar datos y formularios.)           |
| **Análisis de Código**      | ESLint y TypeScript-ESLint       |
---

## 🏗️ Estructura del proyecto

El proyecto está organizado por carpetas para que sea más fácil encontrar y mantener cada parte de la aplicación.

```text
dev-jobs/
├── src/
│   ├── assets/          # Imágenes y otros recursos
│   ├── components/      # Componentes reutilizables
│   │   ├── Auth/        # Login y registro
│   │   ├── Companies/   # Empresas
│   │   ├── CompanyDetail/ # Detalles de empresas
│   │   ├── Navbar/      # Barra de navegación
│   │   ├── Searchbar/   # Barra de búsqueda
│   │   └── SearchFilters/ # Filtros de búsqueda
│   ├── context/         # Información compartida de la aplicación
│   ├── hooks/           # Funciones reutilizables
│   ├── pages/           # Páginas principales
│   ├── services/        # Conexión con la API
│   ├── types/           # Tipos de TypeScript
│   └── utils/           # Funciones auxiliares
│
├── public/              # Archivos públicos
├── package.json         # Dependencias y scripts
├── tsconfig.json        # Configuración de TypeScript
└── vite.config.ts       # Configuración de Vite
```

---

## 🔑 Cuentas de prueba

Puedes utilizar estas cuentas para probar las diferentes funciones de la aplicación:

| Rol               | Correo                        | Contraseña      | Funciones                             |
| ----------------- | ----------------------------- | --------------- | ------------------------------------- |
| **Reclutador**    | `recruiter@techsolutions.com` | `Recruiter123!` | Publicar empleos y revisar candidatos |
| **Desarrollador** | `laura.garcia@example.com`    | `Dev12345!`     | Buscar empleos y enviar postulaciones |
| **Administrador** | `admin@devjobs.com`           | `Admin123!`     | Administrar toda la aplicación        |

---

## 💻 Instalación

Para ejecutar el proyecto de forma local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/Gramajooo/dev-jobs.git

cd dev-jobs
```

### 2. Instalar las dependencias

Puedes utilizar **pnpm** o **npm**:

```bash
pnpm install
```

O:

```bash
npm install
```

### 3. Iniciar el proyecto

```bash
pnpm run dev
```

O con npm:

```bash
npm run dev
```

Después, abre en el navegador la dirección que muestre Vite, normalmente:

```text
http://localhost:5173
```

### 📜 Comandos disponibles

| Comando            | Función                                     |
| ------------------ | ------------------------------------------- |
| `pnpm run dev`     | Inicia el proyecto en modo desarrollo       |
| `pnpm run build`   | Prepara el proyecto para producción         |
| `pnpm run preview` | Muestra la versión de producción localmente |
| `pnpm run lint`    | Revisa posibles errores en el código        |

---

## 📌 Datos de prueba

Los datos utilizados para probar la aplicación, como empleos, empresas y filtros, se utilizan únicamente para el desarrollo y las pruebas del proyecto. Los datos son ficticios y no representan a ninguna empresa u organización real.

---

## 👤 Autor

Desarrollado por **Gramajooo**.

* **GitHub:** [@Gramajooo](https://github.com/Gramajooo)
