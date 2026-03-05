# 📋 Ionic To-Do List con Categorías

Aplicación de gestión de tareas con categorización, construida con **Ionic 7 + Angular 17**.

## ✨ Características

- Crear, editar y eliminar tareas
- Marcar tareas como completadas
- Sistema de categorías con CRUD completo (crear, editar, eliminar)
- Asignar una categoría a cada tarea
- Filtrar tareas por categoría
- Firebase Remote Config con Feature Flags
- Banner dinámico controlado desde Firebase
- Almacenamiento local persistente
- Interfaz intuitiva con gestos (swipe to delete)
- Menú lateral de navegación

## 📦 Requisitos previos

- **Node.js** 18+ → [nodejs.org](https://nodejs.org)
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Angular CLI**: `npm install -g @angular/cli`
- **Cordova**: `npm install -g cordova`
- **Android Studio** con Android SDK 34+ (para APK)
- **Xcode** 15+ (para IPA, solo macOS)
- **Java JDK 17** → [adoptium.net](https://adoptium.net)

## 🚀 Instalación y ejecución
```bash
# 1. Clonar el repositorio
git clone https://github.com/SebastianDiazJ/Aplicacion-To-Do-List-Mobile.git
cd ionic-todo-categories

# 2. Instalar dependencias
npm install

# 3. Ejecutar en navegador
ionic serve
```

## 🔥 Configuración de Firebase

La app utiliza Firebase Remote Config para feature flags.

### Pasos para configurar:

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Registrar una app web y copiar las credenciales
3. Actualizar `src/environments/environment.ts` con las credenciales:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'TU_API_KEY',
    authDomain: 'TU_PROYECTO.firebaseapp.com',
    projectId: 'TU_PROYECTO',
    storageBucket: 'TU_PROYECTO.appspot.com',
    messagingSenderId: 'TU_SENDER_ID',
    appId: 'TU_APP_ID',
  },
};
```

4. En Firebase Console → Remote Config, crear estos parámetros:

| Parámetro | Tipo | Valor por defecto | Descripción |
|-----------|------|-------------------|-------------|
| `enable_dark_mode` | Boolean | `false` | Habilita modo oscuro |
| `enable_task_priority` | Boolean | `false` | Habilita prioridad en tareas |
| `enable_due_dates` | Boolean | `true` | Habilita fechas de vencimiento |
| `app_banner_message` | String | `""` | Mensaje del banner superior |

5. Publicar los cambios en Remote Config

### Demostración del Feature Flag:

- Con `app_banner_message = "¡Bienvenido!"` → aparece un banner amarillo
- Con `app_banner_message = ""` → el banner desaparece
- Todo se controla en tiempo real desde Firebase sin redesplegar la app

## 📱 Compilación móvil

### Android (APK)
```bash
# Agregar plataforma
ionic cordova platform add android

# Compilar APK de debug
ionic cordova build android

# Compilar APK de producción
ionic cordova build android --prod --release
```

El APK se genera en: `platforms/android/app/build/outputs/apk/`

### iOS (IPA)

> Requiere macOS con Xcode 15+ instalado.
```bash
# Agregar plataforma
ionic cordova platform add ios

# Compilar
ionic cordova build ios --prod --release
```

## 🏗️ Estructura del proyecto
```
src/app/
├── models/                    # Interfaces TypeScript
│   ├── task.model.ts          # Modelo de tarea
│   └── category.model.ts     # Modelo de categoría
├── services/                  # Lógica de negocio
│   ├── task.service.ts        # CRUD de tareas
│   ├── category.service.ts    # CRUD de categorías
│   └── firebase-config.service.ts  # Remote Config
├── pages/
│   ├── home/                  # Lista principal con filtros
│   ├── categories/            # Gestión de categorías
│   └── task-form/             # Formulario crear/editar
├── app-routing.module.ts      # Rutas con lazy loading
├── app.module.ts              # Módulo raíz con Firebase
└── app.component.ts           # Componente raíz con menú
```

## ⚡ Optimizaciones de rendimiento

| Técnica | Beneficio |
|---------|-----------|
| **Lazy Loading** | Los módulos se cargan bajo demanda, reduciendo el bundle inicial |
| **trackBy en *ngFor** | Evita re-renders innecesarios del DOM al actualizar listas |
| **BehaviorSubjects** | Arquitectura reactiva compatible con OnPush change detection |
| **takeUntil pattern** | Previene memory leaks por suscripciones no liberadas |
| **Batch storage writes** | Una sola escritura al almacenamiento por operación |
| **Preload strategy** | PreloadAllModules carga módulos en background después del inicio |

## 📝 Respuestas a las preguntas

### ¿Cuáles fueron los principales desafíos?

El principal desafío fue diseñar la relación entre tareas y categorías
usando almacenamiento local sin una base de datos relacional. Se implementó
integridad referencial manual: al eliminar una categoría, las tareas
asociadas quedan sin categoría en lugar de eliminarse. La integración de
Firebase Remote Config con Angular requirió un enfoque reactivo usando
BehaviorSubjects para que los feature flags se actualicen sin bloquear la
carga inicial.

### ¿Qué técnicas de optimización aplicaste?

Lazy Loading para reducir el tiempo de carga inicial. trackBy en todas las
directivas *ngFor para optimizar el rendering del DOM. Arquitectura reactiva
con Observables/BehaviorSubjects preparada para OnPush. Patrón takeUntil
para prevenir memory leaks. Escrituras batch al storage para minimizar I/O.

### ¿Cómo aseguraste la calidad y mantenibilidad?

Separación de responsabilidades con servicios dedicados por dominio. Modelos
tipados con interfaces TypeScript. Componentes enfocados en presentación.
Lazy-loaded modules siguiendo las convenciones de Angular. Código
documentado con nombres descriptivos y estructura consistente.

## 👤 Autor

**Sebastian Diaz Jimenez** - [GitHub](https://github.com/SebastianDiazJ)