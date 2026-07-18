# Pokédex

App en React Native (Expo SDK 57 + TypeScript) que consume [PokeAPI v2](https://pokeapi.co/docs/v2): lista paginada de 20 en 20 con scroll infinito y pantalla de detalle.

## Cómo correrla

```bash
npm install
npm start          # escanea el QR con Expo Go, o pulsa i (iOS) / a (Android)
```

```bash
npm test           # tests (Jest + React Native Testing Library)
npm run typecheck  # verificación de tipos
```

## Stack

| Aspecto | Librería | Razón |
|---|---|---|
| Navegación | expo-router (file-based) | Sintaxis familiar (Next.js-like), type-safe, ideal para Expo |
| Listas / rendimiento | @shopify/flash-list v2 | Mejor rendimiento que FlatList en listas largas; reciclaje eficiente de celdas |
| Data fetching + paginación | @tanstack/react-query | Gestión robusta de caché, refetch automático, ideal para scroll infinito |
| Imágenes remotas | expo-image | Caché dual (memoria + disco), soporta multiple URIs como fallback |
| Animaciones | react-native-reanimated 4 | 60fps nativo, worklets, ideal para shimmer y transiciones suaves |
| Gradientes | expo-linear-gradient | Integral en Expo, shimmer effect con reanim |
| Tests | jest-expo + @testing-library/react-native | Setup integrado con Expo, testing behavior (no implementation) |
| Inyección de dependencias | React Context API | Lightweight, built-in, sin dependencias externas para swappear mocks en tests |

## Arquitectura

Feature-based con Clean Architecture + SOLID dentro de cada feature:

```
src/
├── app/                                    # Rutas (expo-router): solo composición, sin lógica
│   ├── _layout.tsx                         # Root: Providers (QueryClient, DI Context), Stack
│   ├── index.tsx                           # List screen
│   └── pokemon/[id].tsx                    # Detail screen
├── features/pokemon/
│   ├── domain/                             # Entidades + contratos (sin deps externas)
│   │   ├── entities.ts                     # Pokemon, Stat, Type
│   │   └── PokemonRepository.ts            # Interfaz (Dependency Inversion Principle)
│   ├── data/                               # Implementación contra PokeAPI (Adapter)
│   │   ├── dto.ts                          # DTO (forma exacta de PokeAPI)
│   │   ├── mappers.ts                      # DTO → entities, conversiones de unidades
│   │   └── pokemonRepositoryImpl.ts         # HTTP + caché (React Query)
│   ├── hooks/                              # Casos de uso como hooks (orchestration)
│   │   ├── usePokemonList.ts               # useInfiniteQuery, PAGE_SIZE=20, React Query DI
│   │   └── usePokemonDetail.ts             # useQuery con Context DI fallback
│   ├── di/                                 # Dependency Injection
│   │   └── PokemonRepositoryContext.tsx    # React Context para swappear repositorio
│   ├── components/                         # UI del feature
│   │   ├── PokemonCard.tsx                 # Card con animación de imagen
│   │   ├── PokemonGrid.tsx                 # FlashList con skeleton en carga/paginación
│   │   ├── StatBar.tsx                     # Barra de stats con porcentaje
│   │   ├── TypeBadge.tsx                   # Badge tipado
│   │   ├── PokemonImage.tsx                # Imagen con fallback URL chain
│   │   ├── SkeletonTile.tsx                # Skeleton animado (shimmer) para grid
│   │   ├── SkeletonDetailScreen.tsx        # Skeleton animado para detalle
│   │   ├── TopProgressBar.tsx              # Progress bar indeterminado en header
│   │   └── __tests__/                      # Tests unitarios
│   └── __tests__/                          # Tests de hooks
└── shared/
    ├── lib/                                # Utilidades genéricas
    │   ├── http.ts                         # Axios instance
    │   ├── queryClient.ts                  # React Query config
    │   └── format.ts                       # Formatters (número pokedex, capitalize)
    └── theme/
        └── colors.ts                       # Paleta + colores por tipo
```

**Reglas de dependencia:**
- `app → features → shared` (unidireccional)
- Dentro del feature: `components/hooks → domain ← data`
- El dominio no importa nada externo (portable, testeable)
- `components` pueden importar otros `components` del mismo feature
- `hooks` orquestan `domain` + `data` con React Query

## Principios SOLID & Clean Architecture

### Dependency Inversion Principle (DIP)
- **Contrato**: `PokemonRepository` (interfaz) define el contrato
- **Implementación**: `pokemonRepositoryImpl` contra PokeAPI
- **Inyección**: React Context en `_layout.tsx` permite swappear la implementación para tests sin afectar la app
- **Beneficio**: Hooks + Components no conocen detalles de HTTP o caché

### Single Responsibility
- **Domain** (entities, interfaces): definir qué es un Pokemon
- **Data** (mappers, DTO): transformar PokeAPI → dominio
- **Hooks**: orquestar domain + data con React Query
- **Components**: renderizar UI con props, sin lógica de negocio

### Open/Closed & Liskov Substitution
- `PokemonImage` con cadena de URLs: fallback inteligente (no hardcoded)
- `StatBar` agnóstico del tipo de stat: label + valor + máximo
- `SkeletonTile`/`SkeletonDetailScreen` reutilizables para cualquier carga

### Desacoplamiento
- **Layout decoupling**: `PokemonGrid` acepta props (`UsePokemonListResult`) en vez de owning el hook → permite progress bar en header
- **Animation decoupling**: Shimmer en `SkeletonTile` es independiente de `PokemonCard`
- **Test decoupling**: Hooks + Components pueden inyectar mock repository vía Context

## Decisiones Técnicas

### Imágenes & Cell Recycling
- `PokemonImage` intenta cadena de orígenes (jsDelivr → raw.githubusercontent → sprite) porque Android bloquea algunos dominios
- Usa `recyclingKey={pokemonId}` para evitar que FlashList muestre imagen de otro Pokémon al reciclar
- expo-image maneja caché disco/memoria automáticamente

### Animaciones
- **Sin `entering` de Reanimated en celdas**: animaciones en celdas recicladas causan items invisibles (bug en iOS)
- En la lista: fade suave con `transition` de expo-image
- En el detalle: Reanimated para entrada (FadeInUp/FadeInDown)
- Skeleton shimmer: Reanimated + LinearGradient (60fps, nativo)

### Loading States
- **List initial load + pagination**: Skeleton tiles con shimmer (UX consistente)
- **Detail load**: Skeleton detail screen (refleja layout real, sin ActivityIndicator estático)
- **Top progress bar**: Indeterminate en header durante fetch (visual feedback)
- **Benefit**: Usuario sabe qué espera sin cambios de layout

### Platform Conventions
- Back arrow: `arrow-back` en Android, `chevron-back` en iOS (Ionicons)
- StatusBar: Light style para hero section oscuro

### Color & Precarga
- Cada card pide el detalle (`staleTime: Infinity`) → colorea por tipo principal + precarga detalle
- Navegación abre al instante (caché hit)
- Si se requiere color dominante de imagen: `react-native-image-colors` (requiere EAS build)

### Stats Normalization
- HP/ATK/DEF/SPD escala sobre 300
- EXP (`base_experience`) escala sobre 1000
- Peso: hectogramos → kg; Altura: decímetros → m (mappers)

### Testing Strategy
- Jest + React Native Testing Library: tests de behavior, no implementation
- Mock de Reanimated en tests: `useSharedValue`, `useAnimatedStyle` retornan stubs
- `act()` para tests de componentes animados (FlashList, Animated)
- Context DI en tests: swappear repositorio sin afectar app

### Persistencia
- Session: React Query caché (default)
- Permanente entre arranques: `react-native-mmkv` + `@tanstack/query-persist-client`
  - ⚠️ MMKV requiere `eas build`, no funciona en Expo Go (solo en dev build)
