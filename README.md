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

| Aspecto | Librería |
|---|---|
| Navegación | expo-router (file-based) |
| Listas / rendimiento | @shopify/flash-list v2 |
| Data fetching + paginación | @tanstack/react-query (`useInfiniteQuery`) |
| Imágenes remotas | expo-image (caché disco/memoria) |
| Animaciones | react-native-reanimated 4 (`FadeIn/FadeInUp/FadeInDown`) |
| Tests | jest-expo + @testing-library/react-native |

## Arquitectura

Feature-based con capas de Clean Architecture dentro de cada feature:

```
src/
├── app/                          # Rutas (expo-router): solo componen, sin lógica
│   ├── _layout.tsx               # Providers (React Query) + Stack
│   ├── index.tsx                 # Lista
│   └── pokemon/[id].tsx          # Detalle
├── features/pokemon/
│   ├── domain/                   # Entidades + contrato del repositorio (sin deps externas)
│   │   ├── entities.ts
│   │   └── PokemonRepository.ts  # Interfaz (DIP)
│   ├── data/                     # Implementación contra PokeAPI
│   │   ├── dto.ts                # Forma exacta de la API
│   │   ├── mappers.ts            # DTO → dominio (Adapter): unidades, ids, artwork
│   │   └── pokemonRepositoryImpl.ts
│   ├── hooks/                    # Casos de uso como hooks
│   │   ├── usePokemonList.ts     # useInfiniteQuery, PAGE_SIZE = 20
│   │   └── usePokemonDetail.ts
│   ├── components/               # UI del feature
│   └── __tests__/
└── shared/
    ├── lib/                      # http, queryClient, format
    └── theme/                    # colores (tipos, stats, paleta)
```

Reglas de dependencia: `app → features → shared`; dentro del feature, `components/hooks → domain ← data`. El dominio no importa nada externo.

## Decisiones

- **Imágenes**: `PokemonImage` intenta una cadena de orígenes (jsDelivr → raw.githubusercontent → sprite simple) porque algunas redes/dispositivos Android bloquean `raw.githubusercontent.com`. Usa `recyclingKey` para que FlashList no muestre la imagen de otro pokémon al reciclar celdas.
- **Sin `entering` de Reanimated en celdas de lista**: las animaciones de entrada dentro de celdas recicladas de FlashList provocan items invisibles o sin contenido (el bug visto en iOS). En la lista el fade lo da `transition` de expo-image; Reanimated se usa solo en la pantalla de detalle.
- **Flecha back**: `Ionicons` con `arrow-back` en Android y `chevron-back` en iOS para respetar la convención de cada plataforma.

- **Color de tarjetas por tipo**: cada tarjeta pide el detalle (cacheado, `staleTime: Infinity`) para colorear según el tipo principal; esto además precarga el detalle, así la navegación abre al instante. El mock parece usar el color dominante de la imagen — si se quiere eso exacto, `react-native-image-colors` (requiere development build).
- **Stats**: HP/ATK/DEF/SPD sobre 300 y EXP (`base_experience`) sobre 1000, como en el diseño. Peso y altura se convierten de hectogramos/decímetros a kg/m en el mapper.
- **Persistencia**: la caché de React Query cubre la sesión. Para persistir entre arranques: `react-native-mmkv` + `@tanstack/query-persist-client` (MMKV requiere development build, no funciona en Expo Go).
