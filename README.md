# Ionic To-Do List con Categorías

Aplicación de gestión de tareas con categorización, construida con **Ionic 7 + Angular 17**.

## Características

- ✅ Crear, editar y eliminar tareas
- ✅ Marcar tareas como completadas
- ✅ Sistema de categorías (CRUD completo)
- ✅ Asignar categorías a tareas
- ✅ Filtrar tareas por categoría
- ✅ Firebase Remote Config (Feature Flags)
- ✅ Almacenamiento local persistente
- ✅ Interfaz intuitiva con gestos (swipe para eliminar)

## Requisitos previos

- Node.js 18+ y npm
- Ionic CLI: `npm install -g @ionic/cli`
- Cordova: `npm install -g cordova`
- Android Studio (para APK)
- Xcode (para IPA, solo macOS)

## Instalación
```bash
git clone https://github.com/TU_USUARIO/ionic-todo-categories.git
cd ionic-todo-categories
npm install
```

## Configuración de Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Agrega una app web y copia la configuración
3. Actualiza `src/environments/environment.ts` con tus credenciales
4. Configura Remote Config con los parámetros documentados

## Ejecución
```bash
# Desarrollo en navegador
ionic serve

# Android
ionic cordova run android

# iOS
ionic cordova run ios
```

## Compilación
```bash
# APK
ionic cordova build android --prod --release

# IPA
ionic cordova build ios --prod --release
```

## Optimizaciones aplicadas

- **Lazy Loading**: Módulos cargados bajo demanda vía `loadChildren`
- **trackBy**: Evita re-renders innecesarios en listas
- **OnPush-ready**: Arquitectura con Observables y BehaviorSubjects
- **Unsubscribe automático**: Patrón `takeUntil(destroy$)` en todos los componentes
- **Almacenamiento eficiente**: Un solo write por operación al storage

## Estructura del proyecto
```
src/app/
├── models/            # Interfaces TypeScript
│   ├── task.model.ts
│   └── category.model.ts
├── services/          # Lógica de negocio
│   ├── task.service.ts
│   ├── category.service.ts
│   └── firebase-config.service.ts
└── pages/
    ├── home/          # Lista principal de tareas
    ├── categories/    # Gestión de categorías
    └── task-form/     # Formulario crear/editar tarea
```
