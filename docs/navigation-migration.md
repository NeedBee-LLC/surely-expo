# Navigation Migration Plan: React Navigation to Expo Router

This document outlines the migration plan for switching from React Navigation to Expo Router. The plan is organized into phases with checkboxes to track progress.

## Overview

### Current Architecture

The app currently uses React Navigation with:
- **NavigationContainer** with a `linking` config for deep links
- **Drawer navigator** (root) with `drawerType` switching between `permanent` (large screens) and `back` (small screens)
- **Stack navigators** per drawer section using `createNativeStackNavigator`
- **Custom components**: `NavigationBar` (header) and `NavigationDrawer` (drawer content)
- **URL-based navigation** using `useLinkTo()` for all programmatic navigation

### Target Architecture

Expo Router uses:
- **File-based routing** with routes defined by file structure in `app/` directory
- **Layouts** (`_layout.js` files) to define navigation structure
- **Groups** (folders in parentheses like `(tabs)`) for organizing routes
- **Typed routes** with automatic deep linking based on file paths
- **useRouter()** hook for programmatic navigation

---

## Phase 1: Project Setup

### Install and Configure Expo Router

- [ ] Install Expo Router and dependencies:
  ```bash
  npx expo install expo-router expo-linking expo-constants
  ```

- [ ] Update `package.json` main entry point:
  ```json
  "main": "expo-router/entry"
  ```

- [ ] Update `app.json` to add the `scheme` for deep linking:
  ```json
  {
    "expo": {
      "scheme": "surely"
    }
  }
  ```

- [ ] Configure Metro bundler in `metro.config.js` for Expo Router (if needed)

- [ ] Create the `app/` directory structure for file-based routing

- [ ] Move or update `App.js` to work with Expo Router's entry point
  - Provider hierarchy needs to be preserved in a root layout

### Remove React Navigation Dependencies (after migration complete)

- [ ] Remove `@react-navigation/drawer`
- [ ] Remove `@react-navigation/native`
- [ ] Remove `@react-navigation/native-stack`

---

## Phase 2: Create Route Structure

### Define File-Based Routes

Create the following directory structure in `app/`:

```
app/
├── _layout.js                    # Root layout (providers + drawer)
├── (auth)/                       # Auth group (logged-out routes)
│   ├── _layout.js               # Auth layout
│   ├── signin.js                # /signin
│   └── signup.js                # /signup
├── (main)/                       # Main group (logged-in routes)
│   ├── _layout.js               # Main drawer layout
│   ├── todos/
│   │   ├── available/
│   │   │   ├── _layout.js       # Stack layout
│   │   │   ├── index.js         # /todos/available
│   │   │   └── [id].js          # /todos/available/:id
│   │   ├── tomorrow/
│   │   │   ├── _layout.js
│   │   │   ├── index.js         # /todos/tomorrow
│   │   │   └── [id].js          # /todos/tomorrow/:id
│   │   ├── future/
│   │   │   ├── _layout.js
│   │   │   ├── index.js         # /todos/future
│   │   │   └── [id].js          # /todos/future/:id
│   │   ├── completed/
│   │   │   ├── _layout.js
│   │   │   ├── index.js         # /todos/completed
│   │   │   └── [id].js          # /todos/completed/:id
│   │   └── deleted/
│   │       ├── _layout.js
│   │       ├── index.js         # /todos/deleted
│   │       └── [id].js          # /todos/deleted/:id
│   └── categories/
│       ├── _layout.js           # Stack layout
│       ├── index.js             # /categories
│       └── [id].js              # /categories/:id (including 'new')
├── about/
│   ├── _layout.js               # Stack layout
│   ├── index.js                 # /about
│   ├── support.js               # /about/support
│   ├── privacy.js               # /about/privacy
│   └── say-thanks.js            # /about/say-thanks
└── index.js                     # Root redirect (/ -> /todos/available or /signin)
```

### Route File Tasks

- [ ] Create `app/_layout.js` with root providers:
  - QueryClientProvider
  - TokenProvider
  - TokenLoadBuffer
  - PaperProvider
  - StatusBar
  - SafeAreaProvider
  - ScreenBackground

- [ ] Create `app/index.js` with root redirect logic based on auth state

- [ ] Create `app/(auth)/_layout.js` for auth routes

- [ ] Create `app/(auth)/signin.js` - move content from `src/screens/Login/SignInForm.js`

- [ ] Create `app/(auth)/signup.js` - move content from `src/screens/Login/SignUpForm.js`

- [ ] Create `app/(main)/_layout.js` with drawer navigator configuration

- [ ] Create todo list route files (5 sections: available, tomorrow, future, completed, deleted):
  - [ ] `app/(main)/todos/available/_layout.js`
  - [ ] `app/(main)/todos/available/index.js`
  - [ ] `app/(main)/todos/available/[id].js`
  - [ ] `app/(main)/todos/tomorrow/_layout.js`
  - [ ] `app/(main)/todos/tomorrow/index.js`
  - [ ] `app/(main)/todos/tomorrow/[id].js`
  - [ ] `app/(main)/todos/future/_layout.js`
  - [ ] `app/(main)/todos/future/index.js`
  - [ ] `app/(main)/todos/future/[id].js`
  - [ ] `app/(main)/todos/completed/_layout.js`
  - [ ] `app/(main)/todos/completed/index.js`
  - [ ] `app/(main)/todos/completed/[id].js`
  - [ ] `app/(main)/todos/deleted/_layout.js`
  - [ ] `app/(main)/todos/deleted/index.js`
  - [ ] `app/(main)/todos/deleted/[id].js`

- [ ] Create category route files:
  - [ ] `app/(main)/categories/_layout.js`
  - [ ] `app/(main)/categories/index.js`
  - [ ] `app/(main)/categories/[id].js`

- [ ] Create about route files:
  - [ ] `app/about/_layout.js`
  - [ ] `app/about/index.js`
  - [ ] `app/about/support.js`
  - [ ] `app/about/privacy.js`
  - [ ] `app/about/say-thanks.js`

---

## Phase 3: Implement Drawer Navigation

### Configure Drawer Layout

- [ ] Implement drawer in `app/(main)/_layout.js`:
  - Use Expo Router's Drawer component or custom drawer implementation
  - Configure `drawerType` to switch between `permanent` and `back` based on breakpoint
  - Set `drawerStyle.width` to `220`
  - Set `headerShown: false` at drawer level

- [ ] Create custom drawer content component (migrate from `CustomNavigationDrawer`):
  - Render drawer items for each route
  - Handle auth-conditional routes (logged-in vs logged-out)
  - Include "Sign out" item when logged in
  - Include App Store download button on web
  - Preserve test IDs: `${route.name.toLowerCase()}-nav-button`, `sign-out-button`

- [ ] Ensure drawer items navigate to list-level paths (not preserving detail screen state)

### Drawer Route Mapping

Preserve the following URL mappings:

| Route | URL Path |
|-------|----------|
| Available | `/todos/available` |
| Tomorrow | `/todos/tomorrow` |
| Future | `/todos/future` |
| Completed | `/todos/completed` |
| Deleted | `/todos/deleted` |
| Categories | `/categories` |
| About | `/about` |
| Sign in | `/signin` |
| Sign up | `/signup` |

---

## Phase 4: Implement Stack Navigation

### Configure Stack Layouts

For each section, create a `_layout.js` with stack configuration:

- [ ] Implement stack layout pattern with:
  - Custom header component (migrate from `CustomNavigationBar`)
  - Proper screen options and titles

- [ ] Migrate `CustomNavigationBar` to work with Expo Router:
  - Back button should use `router.back()` instead of `navigation.goBack()`
  - Drawer toggle should work with Expo Router drawer
  - Preserve test IDs: `back-button`, `toggle-navigation-button`
  - Preserve accessibility labels

### Screen Titles Configuration

| Screen | Title |
|--------|-------|
| AvailableTodos | Available |
| AvailableTodoDetail | Todo |
| TomorrowTodos | Tomorrow |
| TomorrowTodoDetail | Todo |
| FutureTodos | Future |
| FutureTodoDetail | Todo |
| CompletedTodos | Completed |
| CompletedTodoDetail | Todo |
| DeletedTodos | Deleted |
| DeletedTodoDetail | Todo |
| CategoryList | Categories |
| CategoryDetail | Category |
| AboutScreen | About |
| SupportScreen | Support |
| PrivacyScreen | Privacy Policy |
| ThanksScreen | Ways to Say Thanks |
| SignInScreen | Sign in |
| SignUpScreen | Sign up |

---

## Phase 5: Migrate Navigation Hooks

### Replace Navigation APIs

Replace React Navigation hooks with Expo Router equivalents:

| React Navigation | Expo Router |
|------------------|-------------|
| `useLinkTo()` | `useRouter()` with `router.push()` / `router.replace()` |
| `navigation.goBack()` | `router.back()` |
| `navigation.toggleDrawer()` | Access via drawer ref or context |
| `useFocusEffect()` | `useFocusEffect()` from `expo-router` |
| `route.params` | `useLocalSearchParams()` or `useGlobalSearchParams()` |

### Files to Update

- [ ] `src/components/NavigationBar.js`:
  - Replace `navigation.goBack()` with `router.back()`
  - Replace `navigation.toggleDrawer()` with Expo Router drawer toggle

- [ ] `src/components/NavigationDrawer.js`:
  - Replace `useLinkTo()` with `useRouter()`
  - Update route path navigation

- [ ] `src/screens/TodoList/Available.js`:
  - Replace `useLinkTo()` with `useRouter()`
  - Update: `linkTo('/todos/available/:id')` → `router.push('/todos/available/:id')`

- [ ] `src/screens/TodoList/Tomorrow.js`:
  - Replace `useLinkTo()` with `useRouter()`

- [ ] `src/screens/TodoList/Future.js`:
  - Replace `useLinkTo()` with `useRouter()`

- [ ] `src/screens/TodoList/Completed.js`:
  - Replace `useLinkTo()` with `useRouter()`

- [ ] `src/screens/TodoList/Deleted.js`:
  - Replace `useLinkTo()` with `useRouter()`

- [ ] `src/screens/TodoList/TodoListScreen.js`:
  - Replace `useFocusEffect` import from `@react-navigation/native` to `expo-router`

- [ ] `src/screens/TodoDetail/index.js`:
  - Replace `navigation.goBack()` with `router.back()`
  - Replace `route.params` with `useLocalSearchParams()`

- [ ] `src/screens/CategoryList.js`:
  - Replace `useLinkTo()` with `useRouter()`
  - Replace `useFocusEffect` import

- [ ] `src/screens/CategoryDetail.js`:
  - Replace `useLinkTo()` with `useRouter()`
  - Replace `route.params` with `useLocalSearchParams()`
  - Preserve `id === 'new'` sentinel behavior for category creation

- [ ] `src/screens/Login/SignInForm.js`:
  - Replace `useLinkTo()` with `useRouter()`

- [ ] `src/screens/Login/SignUpForm.js`:
  - Replace `useLinkTo()` with `useRouter()`

- [ ] `src/screens/About/AboutScreen.js`:
  - Replace `useLinkTo()` with `useRouter()`

---

## Phase 6: Auth-Driven Navigation

### Implement Auth Guards

- [ ] Configure root redirect in `app/index.js`:
  - If logged in: redirect to `/todos/available`
  - If logged out: redirect to `/signin`

- [ ] Implement auth protection for `(main)` group:
  - Redirect to `/signin` if not logged in
  - Can use `Redirect` component or `router.replace()` in layout

- [ ] Implement redirect from auth routes when logged in:
  - If already logged in and on `/signin` or `/signup`, redirect to `/todos/available`

- [ ] Sign out flow:
  - Call `clearToken()`
  - Navigate to `/signin` using `router.replace()`

- [ ] Sign in flow:
  - Call `setToken()` on success
  - Router should automatically redirect due to auth state change

---

## Phase 7: Deep Linking Verification

### URL Path Verification

Verify all URL paths work correctly:

- [ ] `/todos/available` - Available todos list
- [ ] `/todos/available/:id` - Available todo detail
- [ ] `/todos/tomorrow` - Tomorrow todos list
- [ ] `/todos/tomorrow/:id` - Tomorrow todo detail
- [ ] `/todos/future` - Future todos list
- [ ] `/todos/future/:id` - Future todo detail
- [ ] `/todos/completed` - Completed todos list
- [ ] `/todos/completed/:id` - Completed todo detail
- [ ] `/todos/deleted` - Deleted todos list
- [ ] `/todos/deleted/:id` - Deleted todo detail
- [ ] `/categories` - Category list
- [ ] `/categories/:id` - Category detail
- [ ] `/categories/new` - New category (sentinel ID)
- [ ] `/about` - About screen
- [ ] `/about/support` - Support screen
- [ ] `/about/privacy` - Privacy policy screen
- [ ] `/about/say-thanks` - Thanks screen
- [ ] `/signin` - Sign in screen
- [ ] `/signup` - Sign up screen

---

## Phase 8: Update Test Utilities

### Jest Test Utilities

- [ ] Update `src/testUtils.js`:
  - Update `mockUseFocusEffect()` to mock Expo Router's `useFocusEffect`
  - Add mock for `useRouter()` if needed
  - Add mock for `useLocalSearchParams()` if needed

- [ ] Update jest mocks in test files:
  - Change `jest.mock('@react-navigation/native', ...)` to mock `expo-router`

---

## Phase 9: Update Unit Tests

### Component Tests

- [ ] Update `src/components/NavigationBar.spec.js`:
  - Mock `useRouter()` instead of `navigation` prop
  - Test `router.back()` call instead of `navigation.goBack()`
  - Test drawer toggle functionality

- [ ] Update `src/components/NavigationDrawer.spec.js`:
  - Mock `useRouter()` instead of `useLinkTo()`
  - Verify URL navigation with `router.push()`
  - Test sign-out flow

### Screen Tests

- [ ] Update `src/screens/TodoList/Available.spec.js`:
  - Mock `useRouter()` instead of `useLinkTo()`
  - Verify navigation paths

- [ ] Update `src/screens/TodoList/Tomorrow.spec.js`

- [ ] Update `src/screens/TodoList/Future.spec.js`

- [ ] Update `src/screens/TodoList/Completed.spec.js`

- [ ] Update `src/screens/TodoList/Deleted.spec.js`

- [ ] Update `src/screens/CategoryList.spec.js`:
  - Mock `useRouter()` and `useFocusEffect` from `expo-router`
  - Verify navigation to `/categories/:id` and `/categories/new`

- [ ] Update `src/screens/CategoryDetail.spec.js`:
  - Mock `useRouter()` and `useLocalSearchParams()` from `expo-router`
  - Verify navigation to `/categories`

- [ ] Update `src/screens/TodoDetail/index.spec.js`:
  - Mock `useRouter()` and `useLocalSearchParams()` from `expo-router`
  - Verify `router.back()` is called after complete/delete/defer flows

- [ ] Update `src/screens/Login/SignInForm.spec.js`:
  - Mock `useRouter()` instead of `useLinkTo()`

- [ ] Update `src/screens/Login/SignUpForm.spec.js`:
  - Mock `useRouter()` instead of `useLinkTo()`

---

## Phase 10: Cypress E2E Tests

### Run All Cypress Tests

- [ ] Run `yarn cypress:open` and verify all tests pass

### Test Files to Verify

- [ ] `cypress/e2e/smoke.cy.js`:
  - Signs in at `/`
  - Adds a todo
  - Navigates to detail
  - Completes todo

- [ ] `cypress/e2e/navigation.cy.js`:
  - Navigates from sign in to sign up (`/` → `/signup`)
  - Returns to todo list using back button (`/todos/available/:id` → `/todos/available`)
  - Navigates to categories via drawer (`/todos/available` → `/categories`)
  - Returns from category detail using back button (`/categories/:id` → `/categories`)
  - Returns to list when switching away from detail via drawer
  - Navigates to support and back from about screen (`/about` → `/about/support` → `/about`)

- [ ] `cypress/e2e/todo-detail-available.cy.js`:
  - Deep links to `/todos/available/:id`
  - Exercises editing flows on detail screen
  - Tests error handling

### Navigation Behaviors to Verify

- [ ] Back button calls `router.back()` and navigates correctly
- [ ] Drawer toggle shows/hides drawer on small screens
- [ ] Drawer is permanent on large screens
- [ ] Switching sections via drawer resets stack to list screen (not detail)
- [ ] Sign out navigates to `/signin`
- [ ] Sign in redirects to `/todos/available` on success

---

## Phase 11: Manual Verification

### Web Browser Testing

- [ ] Test in Chrome/Chromium
- [ ] Test in Firefox (verify history API limits not exceeded)
- [ ] Test in Safari (verify history API limits not exceeded)
- [ ] Test responsive breakpoints:
  - [ ] Large screens (≥600px): drawer is permanent
  - [ ] Small screens (<600px): drawer is collapsible

### iOS Testing

- [ ] Build and test on iOS simulator
- [ ] Verify deep linking works from external sources
- [ ] Test drawer toggle functionality
- [ ] Test back navigation

### Functional Verification Checklist

- [ ] **Auth Flow**:
  - [ ] Sign in form submits and redirects to Available
  - [ ] Sign up form works and redirects to Sign in
  - [ ] Sign out clears token and redirects to Sign in
  - [ ] Protected routes redirect to Sign in when logged out

- [ ] **Todo Lists**:
  - [ ] Available list loads and displays todos
  - [ ] Tomorrow list loads and displays todos
  - [ ] Future list loads and displays todos
  - [ ] Completed list loads and displays todos
  - [ ] Deleted list loads and displays todos
  - [ ] Creating new todos works from Available

- [ ] **Todo Detail**:
  - [ ] Detail screen loads todo data
  - [ ] Edit mode works correctly
  - [ ] Complete action navigates back
  - [ ] Delete action navigates back
  - [ ] Defer action navigates back

- [ ] **Categories**:
  - [ ] Category list loads and displays
  - [ ] Category detail loads for existing categories
  - [ ] New category creation works (`/categories/new`)
  - [ ] Save navigates back to list
  - [ ] Delete navigates back to list
  - [ ] Reordering (move up/down) works

- [ ] **About Section**:
  - [ ] About screen displays version info
  - [ ] Support link navigates correctly
  - [ ] Thanks link navigates correctly
  - [ ] Privacy link navigates correctly
  - [ ] Back navigation works from all sub-screens

- [ ] **Drawer Navigation**:
  - [ ] All drawer items have correct icons
  - [ ] Active route is highlighted
  - [ ] Switching routes works correctly
  - [ ] App Store button shows on web only

- [ ] **Accessibility**:
  - [ ] Back button has "Back" accessibility label
  - [ ] Menu button has "Menu" accessibility label
  - [ ] Drawer items have accessibility labels
  - [ ] Test with iOS Voice Control

---

## Phase 12: Cleanup

### Remove Old Navigation Code

- [ ] Delete `src/Navigation.js` (after migration complete)
- [ ] Remove unused imports from migrated files
- [ ] Remove React Navigation dependencies from `package.json`:
  - `@react-navigation/drawer`
  - `@react-navigation/native`
  - `@react-navigation/native-stack`

### Update Documentation

- [ ] Update `CLAUDE.md` navigation section
- [ ] Update `docs/navigation.md` to reflect Expo Router architecture
- [ ] Update `README.md` if navigation instructions exist

### Code Quality

- [ ] Run `yarn lint` and fix any issues
- [ ] Run `yarn test` and ensure all tests pass
- [ ] Run `yarn test:coverage` to check test coverage

---

## Known Considerations

### Safari/Firefox History API Limits

The current implementation notes that `NavigationContainer` must not rerender frequently due to Safari/Firefox limits on history API calls (100 calls per 30 seconds). Verify that Expo Router handles this appropriately, and if not, implement similar safeguards in the root layout.

### Breakpoint-Based Drawer Behavior

The current drawer uses:
- `drawerType: 'permanent'` on large breakpoints (≥600px)
- `drawerType: 'back'` on small breakpoints (<600px)

Ensure Expo Router's drawer implementation supports this behavior, or implement a custom solution using the `useBreakpoint()` hook.

### Category "new" Sentinel

The category detail screen uses `id === 'new'` as a sentinel value to determine creation mode. Ensure this pattern works correctly with Expo Router's `[id].js` dynamic route.

### Test ID Preservation

The following test IDs are used in Cypress and Detox tests and must be preserved:
- `back-button`
- `toggle-navigation-button`
- `${route.name.toLowerCase()}-nav-button` (e.g., `available-nav-button`, `categories-nav-button`)
- `sign-out-button`
- `sign-up-button`
- `sign-in-button`
- Various form field test IDs

---

## Migration Order Recommendation

1. Start with Phase 1 (Project Setup) to get Expo Router installed
2. Create the route structure (Phase 2) with placeholder components
3. Implement layouts (Phases 3-4) to establish navigation structure
4. Migrate screen components and update hooks (Phase 5)
5. Implement auth guards (Phase 6)
6. Verify deep linking (Phase 7)
7. Update test utilities (Phase 8)
8. Update unit tests incrementally as files are migrated (Phase 9)
9. Run Cypress tests continuously throughout migration (Phase 10)
10. Perform manual verification (Phase 11)
11. Clean up and finalize (Phase 12)

Consider migrating one section at a time (e.g., Available todos first) and verifying it works before moving to the next section.
