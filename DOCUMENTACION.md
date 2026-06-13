# Guía del Proyecto — La Dulce Vida 🍰

Sitio web de pastelería artesanal construido con **React + Vite**. Este documento explica la arquitectura, decisiones técnicas y funcionamiento de todos los módulos. El código fuente está completamente libre de comentarios.

---

## Stack Tecnológico

| Herramienta | Versión | Uso |
|---|---|---|
| React | 19 | Framework de UI |
| Vite | 8 | Bundler y servidor de desarrollo |
| React Router DOM | 7 | Navegación y rutas |
| Lucide React | Última | Iconos SVG |
| Vanilla CSS | — | Estilos (sin frameworks externos) |

---

## Estructura de Archivos

```
src/
├── components/
│   ├── Breadcrumbs.jsx   ← Migas de pan dinámicas (requisito del profesor)
│   ├── Navbar.jsx        ← Barra de navegación con estado de sesión, carrito y redes sociales
│   ├── Footer.jsx        ← Pie de página global
│   └── PageTransition.jsx← Animaciones suaves entre rutas
├── context/
│   ├── AuthContext.jsx   ← Sesión de usuario simulada
│   ├── CartContext.jsx   ← Carrito de compras con persistencia
│   └── ToastContext.jsx  ← Sistema de notificaciones
├── pages/
│   ├── Inicio.jsx        ← Hero, features, CTA
│   ├── Nosotros.jsx      ← Historia, estadísticas, equipo con fotos reales
│   ├── Catalogo.jsx      ← Catálogo con buscador y filtros por categoría
│   ├── Detalle.jsx       ← Vista individual de producto por ID
│   ├── Personalizado.jsx ← Cotizador en 2 pasos con vista previa
│   ├── Carrito.jsx       ← Carrito con controles de cantidad
│   ├── Contacto.jsx      ← Formulario de contacto con confirmación
│   ├── Login.jsx         ← Inicio de sesión simulado
│   ├── Registro.jsx      ← Creación de cuenta simulada
│   ├── Perfil.jsx        ← Historial de pedidos (ruta protegida)
│   └── NotFound.jsx      ← Página 404 personalizada
├── App.jsx               ← Árbol de rutas principal
├── main.jsx              ← Entry point con todos los Providers
└── index.css             ← Sistema de diseño completo (variables, clases, responsive)

public/
├── data/
│   └── catalog.json      ← 12 productos con nombre, descripción, precio, imagen y categoría
└── images/               ← Imágenes generadas con IA
```

---

## Rutas de la Aplicación

| Ruta | Componente | Notas |
|---|---|---|
| `/` | Inicio | Hero section animado |
| `/nosotros` | Nosotros | — |
| `/catalogo` | Catalogo | Acepta búsqueda y filtros en la URL |
| `/catalogo/:id` | Detalle | `id` viene del catalog.json |
| `/personalizado` | Personalizado | Flujo de 2 pasos (form → preview) |
| `/carrito` | Carrito | Lee CartContext |
| `/contacto` | Contacto | — |
| `/login` | Login | Redirige a `/` al ingresar |
| `/registro` | Registro | Llama a `login()` y redirige a `/` |
| `/perfil` | Perfil | Ruta protegida: redirige a `/login` si no hay sesión |
| `*` | NotFound | Captura cualquier ruta no definida |

---

## Breadcrumbs (Migas de Pan)

**Archivo:** `src/components/Breadcrumbs.jsx`

Componente dinámico que usa el hook `useLocation` de React Router para leer la URL actual. Divide el pathname en segmentos y genera el rastro de navegación automáticamente.

**Ejemplo de comportamiento:**

| URL actual | Breadcrumb mostrado |
|---|---|
| `/` | *(no se muestra, es el inicio)* |
| `/catalogo` | Inicio / **Catálogo** |
| `/catalogo/3` | Inicio / Catalogo / **3** |
| `/personalizado` | Inicio / **Personalizado** |
| `/perfil` | Inicio / **Perfil** |

El último segmento siempre se muestra en negrita sin ser un enlace. Los anteriores son navegables.

---

## Estado Global (Context API)

### AuthContext
**Archivo:** `src/context/AuthContext.jsx`

Provee: `user` (objeto `{ name }` o `null`), `login(name)`, `logout()`.

Al llamar `login(name)` se guarda el usuario en memoria. La página de `Perfil` usa `<Navigate to="/login" replace />` si `user` es `null`, implementando protección de rutas sin librerías externas.

### CartContext
**Archivo:** `src/context/CartContext.jsx`

Provee: `cart`, `addToCart(product)`, `removeFromCart(id)`, `updateQuantity(id, delta)`, `clearCart()`, `getCartTotal()`.

**Persistencia:** Usa `localStorage` con la clave `ldv_cart`. El estado inicial se lee de `localStorage` via función de inicialización lazy de `useState`. Cualquier cambio en `cart` dispara un `useEffect` que sincroniza `localStorage`.

**`updateQuantity(id, delta)`:** Suma `delta` a la cantidad del producto. Si el resultado es ≤ 0, el producto es eliminado automáticamente del array via `.filter()`.

### ToastContext
**Archivo:** `src/context/ToastContext.jsx`

Provee: `addToast(message, type)`.

Gestiona un array de notificaciones. Cada toast tiene un `id` único basado en `Date.now()`. Un `setTimeout` de 3000ms elimina cada toast automáticamente. El componente `ToastContainer` vive dentro del Provider y renderiza los toasts sobre todo el contenido con `position: fixed`.

---

## Catálogo y Filtrado

**Archivo:** `src/pages/Catalogo.jsx`

El componente carga `catalog.json` con `fetch` al montarse. Mantiene tres estados locales: `categoria` (string), `busqueda` (string) y `orden` (string).

Los productos se filtran en cada render calculando `productosFiltrados`:
- Si `categoria` es `'todos'`, no filtra por categoría
- La búsqueda compara `p.name.toLowerCase()` contra `busqueda.toLowerCase()`
- Se ordenan según la opción elegida (relevancia, precio asc/desc, alfabético)
- Filtros y ordenamiento funcionan combinados simultáneamente

**Categorías disponibles en catalog.json:** `pasteles`, `tartas`, `postres`

---

## Cotizador en 2 Pasos

**Archivo:** `src/pages/Personalizado.jsx`

Usa un estado `paso` que alterna entre `'form'` y `'preview'`. El formulario llama `handlePreview` (que solo cambia el paso) en lugar de enviar directamente. En el paso de preview se muestra un resumen de los datos. Al confirmar, se llama `addToast` y se reinicia el formulario.

---

## Sistema de Diseño (CSS)

**Archivo:** `src/index.css`

Todas las variables de diseño se definen en `:root`. **No usar valores hardcodeados** en los componentes; siempre referenciar las variables CSS.

| Variable | Valor | Uso |
|---|---|---|
| `--color-secondary` | `#6B3F2A` | Color principal (chocolate) |
| `--color-accent` | `#C87E6A` | Color de énfasis (terracota) |
| `--color-accent-light` | `#EDD5CC` | Fondos de badges e iconos |
| `--color-bg` | `#FBF7F4` | Fondo general de la página |
| `--font-display` | Playfair Display | Títulos y headings |
| `--font-body` | Inter | Texto general |

**Breakpoints responsive:**
- `900px` → Grids de 3 columnas pasan a 2
- `768px` → Navbar muestra hamburguesa, todo pasa a 1 columna
- `480px` → Ajustes de texto y elementos de pantalla pequeña

---

## Imágenes (Generadas con IA)

Todas las imágenes del proyecto fueron generadas mediante Inteligencia Artificial y se encuentran en `public/images/`.

| Archivo | Uso |
|---|---|
| `bakery_banner.png` | Hero de la página de Inicio |
| `chocolate_cake.png` | Producto #1 |
| `fruit_tart.png` | Producto #2 |
| `wedding_cake.png` | Producto #3 |
| `cheesecake.png` | Producto #4 |
| `croissants.png` | Producto #5 |
| `macarons.png` | Producto #6 |
| `carrot_cake.png` | Producto #7 |
| `naked_cake.png` | Producto #8 |
| `lemon_tart.png` | Producto #9 |
| `apple_tart.png` | Producto #10 |
| `tiramisu.png` | Producto #11 |
| `red_velvet_cupcakes.png` | Producto #12 |
| `team_sofia.png` | Foto de equipo — Sofía Ramírez |
| `team_carlos.png` | Foto de equipo — Carlos Mendoza |
| `team_valentina.png` | Foto de equipo — Valentina Cruz |

---

## Comandos

```bash
npm run dev      # Inicia el servidor de desarrollo en http://localhost:5173
npm run build    # Genera el bundle de producción en /dist
npm run preview  # Previsualiza el bundle de producción localmente
```
