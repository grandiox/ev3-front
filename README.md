# CraftSuit Pro

Un panel de administración moderno, responsive y accesible construido con Shadcn, Vite y TypeScript. Este proyecto sirve como una colección completa de componentes y patrones reutilizables para dashboards.

## 🚀 Características

- **Componentes UI Modernos**
  - Construido con ShadcnUI (TailwindCSS + RadixUI)
  - Diseño completamente responsive
  - Soporte para modo claro/oscuro
  - Componentes accesibles siguiendo las directrices WCAG

- **Funcionalidad Principal**
  - Comando de búsqueda global
  - Navegación con barra lateral personalizada
  - Sistema de layout responsive
  - Personalización de temas

- **Experiencia de Desarrollo**
  - TypeScript para seguridad de tipos
  - ESLint + Prettier para calidad de código
  - TanStack Router para enrutamiento con tipos seguros
  - Hot Module Replacement (HMR)

## 🛠️ Stack Tecnológico

- **Framework Frontend:** React con TypeScript
- **Componentes UI:** [ShadcnUI](https://ui.shadcn.com)
- **Estilos:** [TailwindCSS](https://tailwindcss.com)
- **Herramienta de Build:** [Vite](https://vitejs.dev/)
- **Enrutamiento:** [TanStack Router](https://tanstack.com/router/latest)
- **Iconos:** [Tabler Icons](https://tabler.io/icons)
- **Calidad de Código:**
  - TypeScript para verificación de tipos
  - ESLint para linting
  - Prettier para formateo de código

## 📦 Estructura del Proyecto

```
src/
├── assets/         # Recursos estáticos (imágenes, fuentes, etc.)
├── components/     # Componentes UI reutilizables
├── config/         # Configuración de la aplicación
├── constants/      # Constantes globales
├── context/        # Proveedores de Context de React
├── features/       # Módulos basados en características
├── hooks/          # Hooks personalizados de React
├── lib/           # Bibliotecas y configuraciones de utilidad
├── routes/        # Definiciones de rutas
├── services/      # Integraciones con APIs y servicios externos
├── stores/        # Gestión de estado
├── types/         # Definiciones de tipos TypeScript
└── utils/         # Funciones y utilidades auxiliares
```

## 🚀 Comenzando

### Prerrequisitos

- Node.js (v18 o superior)
- npm

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/your-org/craftsuit-pro.git
   ```

2. Navegar al directorio del proyecto:
   ```bash
   cd craftsuit-pro
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173`

## 🧪 Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecutar ESLint
- `npm run format` - Formatear código con Prettier
- `npm run type-check` - Ejecutar verificación de tipos TypeScript

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request. Para cambios mayores, por favor abre un issue primero para discutir lo que te gustaría cambiar.

1. Haz fork del repositorio
2. Crea tu rama de feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Creado con 🤍 por [@satnaing](https://github.com/satnaing)

## 🙏 Agradecimientos

- [ShadcnUI](https://ui.shadcn.com) por la increíble biblioteca de componentes
- [Vite](https://vitejs.dev/) por la herramienta de build ultrarrápida
- [TanStack](https://tanstack.com) por el router con tipos seguros
- Todos los contribuidores y seguidores de este proyecto
