# 💼 DevJobs — Plataforma de Empleos Tech & Gestión de Talento

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)

**DevJobs** es una plataforma web moderna y escalable orientada al ecosistema tecnológico, diseñada para conectar desarrolladores de software con empresas líderes en la industria. Ofrece una experiencia fluida tanto para candidatos (búsqueda avanzada de empleo, postulación y seguimiento de candidaturas) como para reclutadores (publicación y gestión de vacantes, revisión de postulaciones y perfiles corporativos).

---

## 🎯 Filosofía de Desarrollo & Dirección Técnica

> **AI-Assisted Architecture & Engineering ("Controlled Vibe Coding")**  
> Este proyecto implementa una metodología de desarrollo contemporánea donde se utiliza la **Inteligencia Artificial generativa como multiplicador de velocidad y prototipado**, bajo la **estricta dirección técnica, diseño arquitectónico y criterio de ingeniería del desarrollador**.

### ¿Cómo se construyó este proyecto?
- **El rol del desarrollador como Arquitecto de Software:**  
  La definición de la estructura del sistema, los patrones de diseño, los contratos de tipos en TypeScript, la modularización de servicios, el flujo de autenticación RBAC y la jerarquía del estado global fueron diseñados e impuestos con base en buenas prácticas de ingeniería de software.
- **Orquestación y Prompt Engineering Técnico:**  
  En lugar de delegar decisiones críticas a ciegas, se utilizaron instrucciones de alta precisión técnica para acelerar la generación de código boilerplate, componentes UI y lógica repetitiva.
- **Revisión Continua de Código y Refactorización:**  
  Cada módulo generado pasó por un proceso riguroso de revisión, tipado estricto, desacoplamiento y depuración para garantizar un código limpio, legible y listo para entornos de producción.

Este enfoque demuestra la capacidad de liderar flujos de trabajo modernos de desarrollo de software asistido por IA, maximizando la productividad sin sacrificar solidez técnica, arquitectura ni mantenibilidad.

---

## 🚀 Características Principales

### 🔍 Para Candidatos (Desarrolladores)
- **Buscador & Filtrado Multicriterio en Tiempo Real:**
  - Búsqueda por palabras clave con técnica de *debounce* (`useDebounce`) para optimizar el rendimiento.
  - Filtros combinados por tecnologías (React, TypeScript, Node.js, Python, etc.), modalidad (remoto, híbrido, presencial), nivel de experiencia (Junior, Mid, Senior, Lead), rango salarial y jornada laboral.
- **Vista Detallada de Ofertas:**
  - Descripción completa, requerimientos técnicos, responsabilidades, beneficios y salario estimado.
- **Sistema de Postulaciones (Application Tracker):**
  - Registro de candidaturas con control de estado y persistencia reactiva mediante Context API.
- **Explorador de Empresas:**
  - Directorio de empresas con información corporativa, tamaño de equipo y lista de empleos activos por organización.

### 👔 Para Reclutadores & Administración (RBAC)
- **Panel de Reclutador:**
  - Creación, edición y administración de ofertas laborales.
  - Vista y seguimiento de candidatos postulados.
- **Control de Acceso Basado en Roles (RBAC):**
  - Roles soportados: `developer`, `recruiter`, `admin`.
  - Vistas y acciones condicionadas según los permisos del usuario activo.
- **Cliente HTTP Seguro con Interceptor 401 & Cola de Concurrencia:**
  - Arquitectura inspirada en clientes empresariales con soporte de rotación de tokens (Access Token / Refresh Token) y resolución ordenada de peticiones en vuelo ante expiración de sesión.

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnologías |
|---|---|
| **Frontend Core** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) |
| **Estilos & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (iconos vectoriales) |
| **Enrutamiento** | [React Router DOM v7](https://reactrouter.com/) |
| **Gestión de Estado** | React Context API (`AuthContext`, `ApplicationsContext`, `RecruiterContext`) + Custom Hooks |
| **Formularios & Validación** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) con `@hookform/resolvers` |
| **Calidad de Código** | ESLint, TypeScript-ESLint |

---

## 🏛️ Arquitectura del Proyecto

El código está organizado siguiendo los principios de **separación de responsabilidades (SoC)** y **diseño por componentes atómicos y modulares**:

```plaintext
dev-jobs/
├── src/
│   ├── assets/            # Recursos estáticos (estilos generados, imágenes)
│   ├── components/        # Componentes UI reutilizables y modulares
│   │   ├── Auth/          # Modales y formularios de acceso
│   │   ├── Companies/     # Componentes de listado y filtrado de empresas
│   │   ├── CompanyDetail/ # Vistas de detalles corporativos y empleos de empresa
│   │   ├── Navbar/        # Barra de navegación adaptable según rol
│   │   ├── Searchbar/     # Barra de búsqueda con debounce
│   │   └── SearchFilters/ # Selectores y controles de filtrado dinámico
│   ├── context/           # Estado global (Autenticación, Postulaciones, Reclutadores)
│   ├── hooks/             # Custom Hooks reutilizables (useAuth, useDebounce, etc.)
│   ├── pages/             # Vistas principales de la aplicación (Home, Jobs, Applications, Profile)
│   ├── services/          # Capa de comunicación HTTP y autenticación (apiClient, authService)
│   ├── types/             # Definiciones e interfaces TypeScript (Job, Company, Auth, Application)
│   └── utils/             # Funciones de utilidad y transformaciones de datos
├── public/                # Archivos públicos estáticos
├── package.json           # Dependencias y scripts del proyecto
├── tsconfig.json          # Configuración estricta de TypeScript
└── vite.config.ts         # Configuración del bundler Vite
```

---

## 🔑 Cuentas de Demostración para Pruebas

Para evaluar la aplicación con diferentes permisos y flujos de usuario, se pueden utilizar las siguientes credenciales preconfiguradas:

| Rol | Correo Electrónico | Contraseña | Capacidades |
|---|---|---|---|
| **Reclutador / Empresa** | `recruiter@techsolutions.com` | `Recruiter123!` | Publicar vacantes, revisar candidatos, gestionar ofertas |
| **Desarrollador / Candidato** | `laura.garcia@example.com` | `Dev12345!` | Buscar empleos, postularse, gestionar perfil y seguimiento |
| **Administrador** | `admin@devjobs.com` | `Admin123!` | Acceso completo de supervisión y gestión |

---

## 💻 Instalación y Configuración Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina:

### 1. Clonar el repositorio
```bash
git clone https://github.com/Gramajooo/dev-jobs.git
cd dev-jobs
```

### 2. Instalar dependencias
Se recomienda utilizar [pnpm](https://pnpm.io/), aunque puedes usar npm o yarn:
```bash
pnpm install
# o con npm:
# npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
pnpm run dev
# o con npm:
# npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto asignado por Vite).

### 4. Scripts disponibles
- `pnpm run dev`: Inicia el servidor de desarrollo con Hot Module Replacement (HMR).
- `pnpm run build`: Compila los archivos TypeScript y genera el bundle optimizado para producción en `dist/`.
- `pnpm run preview`: Previsualiza localmente el build de producción.
- `pnpm run lint`: Ejecuta el análisis estático con ESLint.

---

## 📌 Gestión de Datos Locales

> Los conjuntos de datos de prueba (ofertas, empresas y opciones de filtrado) utilizados para desarrollo local y simulaciones se encuentran ignorados en el control de versiones (`.gitignore`) para mantener el repositorio limpio y desacoplado de contenido mock voluminoso.

---

## 👤 Autor

Desarrollado con dedicación técnica y pasión por el buen diseño de software.  
- **GitHub:** [@Gramajooo](https://github.com/Gramajooo)
