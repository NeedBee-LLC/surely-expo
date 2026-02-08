# Navigation Migration Plan: React Navigation to Expo Router

This document outlines the migration plan for switching from React Navigation to Expo Router. The plan is organized into phases with checkboxes to track progress.

**Reference Document**: See [docs/navigation-screenshots.md](./navigation-screenshots.md) for the authoritative visual and behavioral specification of all navigation states. This migration MUST preserve all behaviors documented there.

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
│   ├── _layout.js               # Auth stack layout
│   ├── index.js                 # /signin (initial route, no back button)
│   └── signup.js                # /signup (shows back button to signin)
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

- [ ] Create `app/(auth)/_layout.js` for auth stack:

  - Configure as stack navigator
  - Sign In is initial route (no back button)
  - Sign Up is child route (shows back button)

- [ ] Create `app/(auth)/index.js` (or `signin.js` with linking config) - move content from `src/screens/Login/SignInForm.js`:

  - URL: `/signin`
  - Initial route in auth stack
  - No back button shown

- [ ] Create `app/(auth)/signup.js` - move content from `src/screens/Login/SignUpForm.js`:

  - URL: `/signup`
  - Shows back button to return to Sign In
  - Navigated to via "Don't have an account?" link

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
  - Configure `drawerType` to switch between `permanent` (≥600px) and `back` (<600px) based on breakpoint
  - Set `drawerStyle.width` to `220`
  - Set `headerShown: false` at drawer level

- [ ] Create custom drawer content component (migrate from `CustomNavigationDrawer`):

  - **Logged-in items (in order)**: Available, Tomorrow, Future, Completed, Deleted, Categories, About, Sign out
  - **Logged-out items (in order)**: Sign in, Sign up, About
  - Include "Sign out" item when logged in
  - Include App Store download button on web only
  - Preserve test IDs: `${route.name.toLowerCase()}-nav-button`, `sign-out-button`
  - Highlight active route

- [ ] Ensure drawer items navigate to list-level paths (not preserving detail screen state)

- [ ] Implement drawer item tap behavior (medium breakpoint):
  - Navigating to a different section: Navigate to that section's initial route (list screen) and dismiss the drawer
  - Tapping the current section while on its initial route (list screen): Dismiss the drawer only; screen does not change
  - Tapping the current section while on a detail/sub-screen: Pop the stack back to the section's initial route (list screen) and dismiss the drawer

- [ ] Verify drawer behavior at each breakpoint:
  - Large (≥600px): Permanent sidebar, always visible
  - Medium (<600px): Collapsible, overlays content, closes on item selection

### Drawer Route Mapping

Preserve the following URL mappings:

| Route      | URL Path           | Notes                           |
| ---------- | ------------------ | ------------------------------- |
| Available  | `/todos/available` | Initial route when logged in    |
| Tomorrow   | `/todos/tomorrow`  |                                 |
| Future     | `/todos/future`    |                                 |
| Completed  | `/todos/completed` |                                 |
| Deleted    | `/todos/deleted`   |                                 |
| Categories | `/categories`      |                                 |
| About      | `/about`           | Available to both auth states   |
| Sign in    | `/signin`          | Initial route in auth stack     |
| Sign up    | `/signup`          | Child route (shows back button) |

**Auth Stack Navigation Flow:**

- Sign In is initial route (no back button)
- Sign Up is reached via "Don't have an account?" link (shows back button to return to Sign In)
- This is a stack navigator, not just drawer items

---

## Phase 4: Implement Stack Navigation

### Configure Stack Layouts

For each section, create a `_layout.js` with stack configuration:

- [ ] Implement stack layout pattern with:

  - Custom header component (migrate from `CustomNavigationBar`)
  - Proper screen options and titles

- [ ] Migrate `CustomNavigationBar` to work with Expo Router:
  - Back button should use `router.back()` instead of `navigation.goBack()`
  - Back button visibility: Show only when NOT on initial route in stack
  - Drawer toggle (hamburger menu) should work with Expo Router drawer
  - Hamburger visibility: Show only on medium breakpoint (<600px), hide on large (≥600px)
  - Preserve test IDs: `back-button`, `toggle-navigation-button`
  - Preserve accessibility labels: "Back" for back button, "Menu" for hamburger

### Screen Titles Configuration

**Static Titles:**

| Screen         | Title              |
| -------------- | ------------------ |
| AvailableTodos | Available          |
| TomorrowTodos  | Tomorrow           |
| FutureTodos    | Future             |
| CompletedTodos | Completed          |
| DeletedTodos   | Deleted            |
| CategoryList   | Categories         |
| AboutScreen    | About              |
| SupportScreen  | Support            |
| PrivacyScreen  | Privacy Policy     |
| ThanksScreen   | Ways to Say Thanks |
| SignInScreen   | Sign In            |
| SignUpScreen   | Sign Up            |

**Dynamic Titles:**

| Screen                    | Title Logic                         |
| ------------------------- | ----------------------------------- |
| TodoDetail (all sections) | The todo's name (dynamic from data) |
| CategoryDetail (edit)     | "Edit Category"                     |
| CategoryDetail (new)      | "New Category"                      |

**Note**: Todo detail screens must display the todo's name as the header title, not a static "Todo" string.

---

## Phase 5: Migrate Navigation Hooks

### Replace Navigation APIs

Replace React Navigation hooks with Expo Router equivalents:

| React Navigation            | Expo Router                                             |
| --------------------------- | ------------------------------------------------------- |
| `useLinkTo()`               | `useRouter()` with `router.push()` / `router.replace()` |
| `navigation.goBack()`       | `router.back()`                                         |
| `navigation.toggleDrawer()` | Access via drawer ref or context                        |
| `useFocusEffect()`          | `useFocusEffect()` from `expo-router`                   |
| `route.params`              | `useLocalSearchParams()` or `useGlobalSearchParams()`   |

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

Verify all URL paths work correctly (per navigation-screenshots.md Quick Reference Table):

**Authenticated Routes:**

| URL                    | Screen                 | Initial Route | Back Button |
| ---------------------- | ---------------------- | ------------- | ----------- |
| `/todos/available`     | Available List         | Yes           | No          |
| `/todos/available/:id` | Available Detail       | No            | Yes         |
| `/todos/tomorrow`      | Tomorrow List          | Yes           | No          |
| `/todos/tomorrow/:id`  | Tomorrow Detail        | No            | Yes         |
| `/todos/future`        | Future List            | Yes           | No          |
| `/todos/future/:id`    | Future Detail          | No            | Yes         |
| `/todos/completed`     | Completed List         | Yes           | No          |
| `/todos/completed/:id` | Completed Detail       | No            | Yes         |
| `/todos/deleted`       | Deleted List           | Yes           | No          |
| `/todos/deleted/:id`   | Deleted Detail         | No            | Yes         |
| `/categories`          | Category List          | Yes           | No          |
| `/categories/:id`      | Category Detail (edit) | No            | Yes         |
| `/categories/new`      | Category Detail (new)  | No            | Yes         |

**Unauthenticated Routes:**

| URL       | Screen  | Initial Route | Back Button |
| --------- | ------- | ------------- | ----------- |
| `/signin` | Sign In | Yes           | No          |
| `/signup` | Sign Up | No            | Yes         |

**Accessible Regardless of Auth State:**

| URL                 | Screen             | Initial Route | Back Button |
| ------------------- | ------------------ | ------------- | ----------- |
| `/about`            | About              | Yes           | No          |
| `/about/support`    | Support            | No            | Yes         |
| `/about/privacy`    | Privacy Policy     | No            | Yes         |
| `/about/say-thanks` | Ways to Say Thanks | No            | Yes         |

### Deep Link Verification Checklist

- [ ] `/todos/available` - Available todos list
- [ ] `/todos/available/:id` - Available todo detail (back button present)
- [ ] `/todos/tomorrow` - Tomorrow todos list
- [ ] `/todos/tomorrow/:id` - Tomorrow todo detail (back button present)
- [ ] `/todos/future` - Future todos list
- [ ] `/todos/future/:id` - Future todo detail (back button present)
- [ ] `/todos/completed` - Completed todos list
- [ ] `/todos/completed/:id` - Completed todo detail (back button present)
- [ ] `/todos/deleted` - Deleted todos list
- [ ] `/todos/deleted/:id` - Deleted todo detail (back button present)
- [ ] `/categories` - Category list
- [ ] `/categories/:id` - Category detail (back button present, title "Edit Category")
- [ ] `/categories/new` - New category (back button present, title "New Category")
- [ ] `/about` - About screen
- [ ] `/about/support` - Support screen (back button present)
- [ ] `/about/privacy` - Privacy policy screen (back button present)
- [ ] `/about/say-thanks` - Thanks screen (back button present)
- [ ] `/signin` - Sign in screen
- [ ] `/signup` - Sign up screen (back button present)

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

### Navigation Behaviors to Verify (per navigation-screenshots.md)

**Back Button Behavior:**

- [ ] Back button calls `router.back()` and navigates correctly
- [ ] Back button visible on all detail/child screens
- [ ] Back button NOT visible on initial route screens (list screens, Sign In, About)
- [ ] Sign Up screen shows back button (returns to Sign In)

**Drawer Behavior:**

- [ ] Drawer toggle shows/hides drawer on medium screens (<600px)
- [ ] Drawer is permanent on large screens (≥600px)
- [ ] Drawer width is 220px
- [ ] Hamburger menu visible on ALL screens at medium breakpoint
- [ ] Hamburger menu NOT visible at large breakpoint

**Drawer Items:**

- [ ] Logged in: Shows Available, Tomorrow, Future, Completed, Deleted, Categories, About, Sign out
- [ ] Logged out: Shows Sign in, Sign up, About (no todo sections)

**Drawer Item Tap Behavior (Medium Breakpoint):**

- [ ] Tapping a different section navigates to that section's initial route and dismisses drawer
- [ ] Tapping the current section while on its initial route dismisses drawer without changing screen
- [ ] Tapping the current section while on a detail/sub-screen pops stack to initial route and dismisses drawer

**Stack Reset Behavior:**

- [ ] Switching sections via drawer resets stack to list screen (not detail)
- [ ] Navigating away from detail screen resets that stack

**Auth Navigation:**

- [ ] Sign out navigates to `/signin`
- [ ] Sign in redirects to `/todos/available` on success
- [ ] "Don't have an account?" link navigates to Sign Up with back button

**Cross-Stack Navigation:**

- [ ] Completing a todo navigates to Completed section
- [ ] Deleting a todo navigates to Deleted section
- [ ] Deferring a todo navigates to Tomorrow or Future section
- [ ] Restoring a todo from Deleted navigates to Available section

**Header Titles:**

- [ ] Todo detail screens show todo's name (not static "Todo")
- [ ] Category edit shows "Edit Category"
- [ ] Category new shows "New Category"

---

## Phase 11: Cleanup

### Remove Old Navigation Code

- [ ] Delete `src/Navigation.js` (after migration complete)
- [ ] Remove unused imports from migrated files
- [ ] Remove React Navigation dependencies from `package.json`:
  - `@react-navigation/drawer`
  - `@react-navigation/native`
  - `@react-navigation/native-stack`

### Update Documentation

- [ ] Update `CLAUDE.md` navigation section
- [ ] Rename `docs/navigation.md` to `docs/old-navigation.md` and add a note that it documents the old approach
- [ ] Update `README.md` if navigation instructions exist

### Code Quality

- [ ] Run `yarn lint` and fix any issues
- [ ] Run `yarn test` and ensure all tests pass
- [ ] Run `yarn test:coverage` to check test coverage

---

## Phase 12: Manual Verification

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

### Header Element Verification (per navigation-screenshots.md)

Verify header elements match the specification in the Behavioral Specifications section:

- [ ] **Large Breakpoint (≥600px)**:

  - [ ] No hamburger menu visible on any screen
  - [ ] Back button visible on all detail/child screens
  - [ ] Correct titles on all screens

- [ ] **Medium Breakpoint (<600px)**:

  - [ ] Hamburger menu visible on ALL screens
  - [ ] Back button visible on all detail/child screens
  - [ ] Correct titles on all screens

- [ ] **List Screens (No Back Button)**:

  - [ ] Available List: Title "Available", no back button
  - [ ] Tomorrow List: Title "Tomorrow", no back button
  - [ ] Future List: Title "Future", no back button
  - [ ] Completed List: Title "Completed", no back button
  - [ ] Deleted List: Title "Deleted", no back button
  - [ ] Category List: Title "Categories", no back button
  - [ ] Sign In: Title "Sign In", no back button
  - [ ] About: Title "About", no back button

- [ ] **Detail/Child Screens (Has Back Button)**:
  - [ ] Todo Detail (all sections): Title shows todo's name, has back button
  - [ ] Category Detail (edit): Title "Edit Category", has back button
  - [ ] Category Detail (new): Title "New Category", has back button
  - [ ] Sign Up: Title "Sign Up", has back button
  - [ ] Support: Title "Support", has back button
  - [ ] Privacy: Title "Privacy Policy", has back button
  - [ ] Thanks: Title "Ways to Say Thanks", has back button

### Drawer Verification

- [ ] **Drawer Width**: Verify drawer width is 220px

- [ ] **Drawer Items (Logged In)**:

  - [ ] Available item present
  - [ ] Tomorrow item present
  - [ ] Future item present
  - [ ] Completed item present
  - [ ] Deleted item present
  - [ ] Categories item present
  - [ ] About item present
  - [ ] Sign out item present
  - [ ] Items appear in correct order

- [ ] **Drawer Items (Logged Out)**:

  - [ ] Sign in item present
  - [ ] Sign up item present
  - [ ] About item present
  - [ ] NO todo section items visible
  - [ ] Items appear in correct order

- [ ] **Large Breakpoint Drawer**:

  - [ ] Drawer is always visible (permanent)
  - [ ] No overlay when interacting with content
  - [ ] Active route is highlighted

- [ ] **Medium Breakpoint Drawer**:
  - [ ] Drawer hidden by default
  - [ ] Opens on hamburger menu tap
  - [ ] Overlays content when open
  - [ ] Closes when item is selected
  - [ ] Active route is highlighted
  - [ ] Tapping a different section navigates to initial route and dismisses drawer
  - [ ] Tapping current section on initial route dismisses drawer without navigation
  - [ ] Tapping current section on detail/sub-screen pops to initial route and dismisses drawer

### Functional Verification Checklist

- [ ] **Auth Flow**:

  - [ ] Sign in form submits and redirects to Available
  - [ ] Sign up form works and redirects to Sign in
  - [ ] Sign out clears token and redirects to Sign in
  - [ ] Protected routes redirect to Sign in when logged out
  - [ ] Sign Up screen has back button to return to Sign In

- [ ] **Todo Lists**:

  - [ ] Available list loads and displays todos
  - [ ] Tomorrow list loads and displays todos
  - [ ] Future list loads and displays todos
  - [ ] Completed list loads and displays todos
  - [ ] Deleted list loads and displays todos
  - [ ] Creating new todos works from Available, Tomorrow, Future
  - [ ] Completed list has NO Add button
  - [ ] Deleted list has NO Add button
  - [ ] All lists have search bar and pagination controls

- [ ] **Todo Detail**:

  - [ ] Detail screen loads todo data
  - [ ] Header title shows the todo's name (not "Todo")
  - [ ] Edit mode works correctly
  - [ ] Complete action navigates back
  - [ ] Delete action navigates back
  - [ ] Defer action navigates back
  - [ ] Back button returns to list

- [ ] **Categories**:

  - [ ] Category list loads and displays
  - [ ] Category list has Add button (+)
  - [ ] Add button navigates to `/categories/new`
  - [ ] Edit category shows title "Edit Category"
  - [ ] New category shows title "New Category"
  - [ ] Edit mode has Save, Delete, Cancel buttons
  - [ ] New mode has Save, Cancel buttons (no Delete)
  - [ ] Save navigates back to list
  - [ ] Delete navigates back to list
  - [ ] Cancel navigates back to list
  - [ ] Reordering (move up/down) works

- [ ] **About Section**:

  - [ ] About screen displays version info
  - [ ] About screen shows App Store badge on web only
  - [ ] About screen shows GitHub link
  - [ ] Support link navigates correctly
  - [ ] Thanks link navigates correctly
  - [ ] Privacy link navigates correctly
  - [ ] Back navigation works from all sub-screens

- [ ] **Drawer Navigation**:

  - [ ] All drawer items have correct icons
  - [ ] Active route is highlighted
  - [ ] Switching routes works correctly
  - [ ] App Store button shows on web only
  - [ ] Switching sections via drawer resets stack to list screen (not detail)

- [ ] **Cross-Stack Navigation**:

  - [ ] Completing a todo navigates to Completed section
  - [ ] Deleting a todo navigates to Deleted section
  - [ ] Deferring a todo navigates to Tomorrow or Future section
  - [ ] Restoring a deleted todo navigates to Available section

- [ ] **Accessibility**:
  - [ ] Back button has "Back" accessibility label
  - [ ] Menu button has "Menu" accessibility label
  - [ ] Drawer items have accessibility labels
  - [ ] Test with iOS Voice Control

---

## Behavioral Specifications (from navigation-screenshots.md)

This section documents the exact navigation behaviors that must be preserved. See [navigation-screenshots.md](./navigation-screenshots.md) for visual references.

### Header Elements Per Screen

Each screen has specific header configuration based on breakpoint:

| Screen                 | Title              | Back Button | Hamburger (Medium) | Auth Required |
| ---------------------- | ------------------ | ----------- | ------------------ | ------------- |
| Available List         | Available          | No          | Yes                | Yes           |
| Available Detail       | Todo's name        | Yes         | Yes                | Yes           |
| Tomorrow List          | Tomorrow           | No          | Yes                | Yes           |
| Tomorrow Detail        | Todo's name        | Yes         | Yes                | Yes           |
| Future List            | Future             | No          | Yes                | Yes           |
| Future Detail          | Todo's name        | Yes         | Yes                | Yes           |
| Completed List         | Completed          | No          | Yes                | Yes           |
| Completed Detail       | Todo's name        | Yes         | Yes                | Yes           |
| Deleted List           | Deleted            | No          | Yes                | Yes           |
| Deleted Detail         | Todo's name        | Yes         | Yes                | Yes           |
| Category List          | Categories         | No          | Yes                | Yes           |
| Category Detail (edit) | Edit Category      | Yes         | Yes                | Yes           |
| Category Detail (new)  | New Category       | Yes         | Yes                | Yes           |
| Sign In                | Sign In            | No          | Yes                | No            |
| Sign Up                | Sign Up            | Yes         | Yes                | No            |
| About                  | About              | No          | Yes                | No            |
| Support                | Support            | Yes         | Yes                | No            |
| Privacy                | Privacy Policy     | Yes         | Yes                | No            |
| Thanks                 | Ways to Say Thanks | Yes         | Yes                | No            |

**Key Rules:**

- Back button shows only when screen is NOT the initial route in its stack
- Hamburger menu shows only on medium breakpoint (< 600px)
- Large breakpoint (≥ 600px) never shows hamburger menu (drawer is permanent)

### Drawer Configuration

**Drawer Width**: 220px

**Breakpoint Behavior:**

| Breakpoint       | Drawer Type | Behavior                                  |
| ---------------- | ----------- | ----------------------------------------- |
| Large (≥ 600px)  | Permanent   | Always visible as sidebar                 |
| Medium (< 600px) | Collapsible | Slides in from left, toggle via hamburger |

**Drawer Item Tap Behavior (Medium Breakpoint):**

1. **Navigating to a different section**: The app navigates to that section's initial route (list screen) and the drawer is dismissed.
2. **Tapping the current section while on its initial route (list screen)**: The drawer is dismissed. The screen does not change — the user remains on the same list screen.
3. **Tapping the current section while on a detail/sub-screen**: The stack is popped back to the section's initial route (list screen) and the drawer is dismissed. For example, tapping "Available" while viewing a todo detail returns to the Available list; tapping "About" while on the Support sub-screen returns to the About screen.

**Drawer Items (Logged In):**

1. Available
2. Tomorrow
3. Future
4. Completed
5. Deleted
6. Categories
7. About
8. Sign out

**Drawer Items (Logged Out):**

1. Sign in
2. Sign up
3. About

### Screen-Specific Notes

**Todo List Screens:**

- Available, Tomorrow, Future: Have Add button (+) for creating new todos
- Completed, Deleted: NO Add button (can't create directly)
- All have search bar and pagination controls

**Category Screens:**

- List: Has Add button (+) to navigate to `/categories/new`
- Detail (Edit): Has Save, Delete, Cancel buttons
- Detail (New): Has Save, Cancel buttons (no Delete - can't delete unsaved)

**Auth Screens:**

- Sign In: Initial route, no back button
- Sign Up: NOT initial route, shows back button (navigated from Sign In)

**About Stack:**

- About screen is initial route (no back button)
- Support, Privacy, Thanks are child routes (show back button)

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

### Cross-Stack Navigation

Actions on todo detail screens trigger navigation to different stacks:

- **Complete**: Navigates from current stack (e.g., AvailableStack) to CompletedStack
- **Delete**: Navigates from any stack to DeletedStack
- **Defer**: Navigates from AvailableStack to TomorrowStack or FutureStack (based on defer date)
- **Restore** (from Deleted): Navigates from DeletedStack to AvailableStack

Ensure these cross-stack navigations work correctly with Expo Router's navigation model.

### Add Button Presence

Not all list screens have the Add button (+):

- **Has Add button**: Available, Tomorrow, Future, Categories
- **No Add button**: Completed, Deleted (cannot create items directly in these states)

### Dynamic Header Titles

Todo detail screens display the todo's name as the header title (not a static "Todo" string). This requires:

- Fetching todo data and extracting the name
- Setting the header title dynamically via screen options

### Stack Organization (per navigation-screenshots.md)

The app must maintain this exact stack organization:

```
DrawerNavigator (Root)
├── AvailableStack
│   ├── AvailableTodos (list) - initial route
│   └── AvailableTodoDetail (detail)
├── TomorrowStack
│   ├── TomorrowTodos (list) - initial route
│   └── TomorrowTodoDetail (detail)
├── FutureStack
│   ├── FutureTodos (list) - initial route
│   └── FutureTodoDetail (detail)
├── CompletedStack
│   ├── CompletedTodos (list) - initial route
│   └── CompletedTodoDetail (detail)
├── DeletedStack
│   ├── DeletedTodos (list) - initial route
│   └── DeletedTodoDetail (detail)
├── CategoriesStack
│   ├── CategoryList (list) - initial route
│   └── CategoryDetail (detail/new)
├── AboutStack
│   ├── AboutScreen - initial route
│   ├── SupportScreen
│   ├── PrivacyScreen
│   └── ThanksScreen
└── AuthStack (when not logged in)
    ├── SignInScreen - initial route
    └── SignUpScreen
```

Each stack's initial route should NOT show a back button. All non-initial routes should show a back button.

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

## Phase 13: Screenshots Document Verification

### Verify Against navigation-screenshots.md

Use [docs/navigation-screenshots.md](./navigation-screenshots.md) as the acceptance criteria. For each screen documented:

- [ ] **Available List**: Matches screenshot behavior (URL, header elements, drawer state)
- [ ] **Available Detail**: Matches screenshot behavior (dynamic title, back button)
- [ ] **Tomorrow List**: Matches screenshot behavior
- [ ] **Tomorrow Detail**: Matches screenshot behavior (inferred from pattern)
- [ ] **Future List**: Matches screenshot behavior
- [ ] **Future Detail**: Matches screenshot behavior (inferred from pattern)
- [ ] **Completed List**: Matches screenshot behavior (no Add button)
- [ ] **Completed Detail**: Matches screenshot behavior (inferred from pattern)
- [ ] **Deleted List**: Matches screenshot behavior (no Add button)
- [ ] **Deleted Detail**: Matches screenshot behavior (inferred from pattern)
- [ ] **Category List**: Matches screenshot behavior
- [ ] **Category Detail (Edit)**: Matches screenshot behavior (title "Edit Category")
- [ ] **Category Detail (New)**: Matches screenshot behavior (title "New Category", no Delete)
- [ ] **Sign In**: Matches screenshot behavior (drawer shows limited items)
- [ ] **Sign Up**: Matches screenshot behavior (has back button)
- [ ] **About**: Matches screenshot behavior
- [ ] **Support**: Matches screenshot behavior (has back button)
- [ ] **Privacy**: Matches screenshot behavior (inferred from pattern)
- [ ] **Thanks**: Matches screenshot behavior (inferred from pattern)

### Verify Quick Reference Table

Cross-reference each row in the Quick Reference Table (lines 638-658 of navigation-screenshots.md):

- [ ] All 19 screens have correct URL paths
- [ ] All Initial Route values are accurate (determines back button visibility)
- [ ] All Back Button values match (No for initial routes, Yes for others)
- [ ] All Drawer Toggle (Medium) values are Yes
- [ ] All Auth Required values are accurate

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
10. Clean up and finalize (Phase 11)
11. Perform manual verification (Phase 12)
12. Final verification against navigation-screenshots.md (Phase 13)

Consider migrating one section at a time (e.g., Available todos first) and verifying it works before moving to the next section.

**Important**: Use [docs/navigation-screenshots.md](./navigation-screenshots.md) as the source of truth for visual and behavioral specifications throughout the migration. Any deviation from the documented behaviors should be intentional and documented.
