# Navigation behavior (React Navigation)

This document captures the current navigation behavior to support a future
reimplementation. It summarizes how React Navigation is configured, how routes
map to URLs, and how screens trigger navigation. References are included for
both production code and tests.

## Architecture overview

Navigation is defined in `src/Navigation.js` and uses a drawer + stack pattern:

- **Root**: `NavigationContainer` with a `linking` config for deep links.
  - The container is kept stable to avoid Safari/Firefox history API limits.
  - Hooks are placed in `NavigationContents` to prevent container re-renders.
- **Drawer navigator** (root navigator):
  - `drawerType` is `permanent` on large breakpoints and `back` on smaller
    screens (`getDrawerTypeForBreakpoint`).
  - `drawerStyle` width is `220`.
  - `headerShown` is `false` at the drawer level.
  - Custom drawer content is rendered via `CustomNavigationDrawer`.
- **Stack navigators** (per drawer section):
  - Each section uses `createNativeStackNavigator`.
  - Each stack uses a custom header component: `CustomNavigationBar`.

## Drawer routes and stacks

The drawer content is conditional on auth state (`useToken().isLoggedIn`):

### Logged-in drawer routes

| Drawer route name | Stack screens (order) | Header titles |
| --- | --- | --- |
| Available | `AvailableTodos`, `AvailableTodoDetail` | `Available`, `Todo` |
| Tomorrow | `TomorrowTodos`, `TomorrowTodoDetail` | `Tomorrow`, `Todo` |
| Future | `FutureTodos`, `FutureTodoDetail` | `Future`, `Todo` |
| Completed | `CompletedTodos`, `CompletedTodoDetail` | `Completed`, `Todo` |
| Deleted | `DeletedTodos`, `DeletedTodoDetail` | `Deleted`, `Todo` |
| Categories | `CategoryList`, `CategoryDetail` | `Categories`, `Category` |

### Logged-out drawer routes

| Drawer route name | Stack screens (order) | Header titles |
| --- | --- | --- |
| Sign in | `SignInScreen` | `Sign in` |
| Sign up | `SignUpScreen` | `Sign up` |

### Always-available route

| Drawer route name | Stack screens (order) | Header titles |
| --- | --- | --- |
| About | `AboutScreen`, `SupportScreen`, `PrivacyScreen`, `ThanksScreen` | `About`, `Support`, `Privacy Policy`, `Ways to Say Thanks` |

### Auth-driven navigation behavior

- **Sign in flow**: `SignInForm` triggers `setToken` on success; the drawer
  switches to the logged-in routes.
- **Sign out**: Drawer includes a "Sign out" item when logged in. It calls
  `clearToken()` and then navigates via `useLinkTo('/signin')`.

## Deep linking and URL mapping

The root `NavigationContainer` is configured with a `linking` map. Paths are
used directly by `useLinkTo()` for forward navigation across screens.

The drawer uses its own `ROUTE_PATH_MAP` to translate drawer route names to
paths before calling `useLinkTo()`. Keep this mapping aligned with the linking
config and stack screen definitions.

### Todos

| Stack screen | URL path |
| --- | --- |
| AvailableTodos | `/todos/available` |
| AvailableTodoDetail | `/todos/available/:id` |
| TomorrowTodos | `/todos/tomorrow` |
| TomorrowTodoDetail | `/todos/tomorrow/:id` |
| FutureTodos | `/todos/future` |
| FutureTodoDetail | `/todos/future/:id` |
| CompletedTodos | `/todos/completed` |
| CompletedTodoDetail | `/todos/completed/:id` |
| DeletedTodos | `/todos/deleted` |
| DeletedTodoDetail | `/todos/deleted/:id` |

### Categories

| Stack screen | URL path |
| --- | --- |
| CategoryList | `/categories` |
| CategoryDetail | `/categories/:id` |

Note: Category creation uses the "new" sentinel (`/categories/new`), and the
detail screen treats `route.params.id === 'new'` as the creation mode.

### About and auth

| Stack screen | URL path |
| --- | --- |
| AboutScreen | `/about` |
| SupportScreen | `/about/support` |
| PrivacyScreen | `/about/privacy` |
| ThanksScreen | `/about/say-thanks` |
| SignInScreen | `/signin` |
| SignUpScreen | `/signup` |

## Navigation triggers by screen

### Custom header (`CustomNavigationBar`)

`src/components/NavigationBar.js`:

- Shows a **back button** when React Navigation provides a truthy `back` prop.
  - Calls `navigation.goBack()`.
  - Test ID: `back-button`.
- Shows a **drawer toggle** only on non-large breakpoints.
  - Calls `navigation.toggleDrawer()`.
  - Test ID: `toggle-navigation-button`.
- On large screens the drawer is permanent and the toggle is hidden.

### Custom drawer (`CustomNavigationDrawer`)

`src/components/NavigationDrawer.js`:

- Renders a drawer item for each route in the current drawer state.
  - Each item calls `linkTo(ROUTE_PATH_MAP[route.name])`.
  - Route name-to-path mappings live in `ROUTE_PATH_MAP`.
  - Test ID format: `${route.name.toLowerCase()}-nav-button`.
- When logged in, renders a "Sign out" item.
  - Calls `clearToken()` and then `linkTo('/signin')`.
  - Test ID: `sign-out-button`.
- On web, displays the App Store download button in the drawer footer.

### Todo lists and detail

`src/screens/TodoList/*.js`:

- Each list screen uses `useLinkTo()` to navigate to the detail route.
  - Example: Available list uses `/todos/available/:id`.
- `TodoListScreen` uses `useFocusEffect()` to reload when the screen gains
  focus (list reloads after returning from detail).

`src/screens/TodoDetail/index.js`:

- Uses `navigation.goBack()` for returning to the list.
- Actions that navigate back:
  - Completing a todo
  - Deleting a todo
  - Deferring a todo (after choosing a date)

### Categories

`src/screens/CategoryList.js`:

- Uses `useLinkTo()` to navigate to `/categories/:id` on list item tap.
- Uses `useLinkTo()` to navigate to `/categories/new` for adding a category.
- Uses `useFocusEffect()` to reload when focused.

`src/screens/CategoryDetail.js`:

- Uses `useLinkTo('/categories')` for Cancel, Save, and Delete flows.
- Uses `route.params.id === 'new'` to determine creation mode.

### About

`src/screens/About/AboutScreen.js`:

- Uses `useLinkTo()` to navigate to:
  - `/about/support`
  - `/about/say-thanks`
  - `/about/privacy`

### Auth

`src/screens/Login/SignInForm.js`:

- Uses `useLinkTo('/signup')` to move from Sign in to Sign up.

`src/screens/Login/SignUpForm.js`:

- Uses `useLinkTo('/signin')` on cancel and after successful sign-up.

## React Navigation touchpoints (reference list)

Production code:

- `src/Navigation.js` (NavigationContainer, drawer, stacks, linking config)
- `src/components/NavigationBar.js` (goBack, toggleDrawer)
- `src/components/NavigationDrawer.js` (useLinkTo, route path map)
- `src/screens/TodoList/*.js` (useLinkTo)
- `src/screens/TodoList/TodoListScreen.js` (useFocusEffect)
- `src/screens/TodoDetail/index.js` (navigation.goBack)
- `src/screens/CategoryList.js` / `CategoryDetail.js` (useLinkTo)
- `src/screens/About/AboutScreen.js` (useLinkTo)
- `src/screens/Login/SignInForm.js` / `SignUpForm.js` (useLinkTo)

Test utilities and unit tests:

- `src/testUtils.js` mocks `useFocusEffect`.
- `src/components/NavigationBar.spec.js` exercises back/toggle behavior.
- `src/components/NavigationDrawer.spec.js` asserts `useLinkTo` and sign-out.
- `src/screens/TodoList/*.spec.js` verifies `useLinkTo` paths.
- `src/screens/CategoryList.spec.js`, `CategoryDetail.spec.js`,
  `src/screens/Login/SignUpForm.spec.js`, `SignInForm.spec.js` verify
  `useLinkTo` usage.
- `src/screens/TodoDetail/index.spec.js` asserts `navigation.goBack()` is called
  after complete/delete/defer flows.

## End-to-end navigation coverage

### Detox (mobile) tests

Located in `e2e/*.test.js`:

- Uses `toggle-navigation-button` to open the drawer.
- Confirms drawer visibility (example: `about-nav-button`).
- Navigates via drawer items (Completed, Deleted, Tomorrow, Future).
- Signs out via `sign-out-button` when needed.

### Cypress (web) tests

Located in `cypress/e2e/*.cy.js`:

- `smoke.cy.js` signs in at `/`, adds a todo, and navigates to detail.
- `todo-detail-available.cy.js` uses deep linking:
  - Visits `/todos/available/:id` directly.
  - Exercises editing flows on the detail screen.

These tests confirm that URL-based navigation and drawer-driven navigation are
both relied upon in the current implementation.
