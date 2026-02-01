# Navigation migration plan (React Navigation -> Expo Router)

This checklist tracks the work needed to replace the current React Navigation
setup with Expo Router while preserving the behavior documented in
`docs/navigation.md`.

## 1) Discovery and baseline validation

- [ ] Review `docs/navigation.md` and confirm all routes and behaviors are
  still accurate in the current app.
- [ ] Capture any navigation-related TODOs or regressions in the current app
  before migration begins.
- [ ] Verify test IDs relied on by tests (drawer toggle, back button, etc.)
  are still present to avoid breaking tests during refactors.

## 2) Dependencies and package updates

- [ ] Add Expo Router and any required supporting dependencies per Expo docs.
- [ ] Update `package.json` and lockfile to reflect new dependencies.
- [ ] Remove React Navigation packages and other now-unused dependencies after
  the Expo Router migration is complete.

## 3) Expo Router structure and layouts

- [ ] Create the Expo Router route tree matching current URL paths:
  - [ ] `/todos/available` (list)
  - [ ] `/todos/available/[id]` (detail)
  - [ ] `/todos/tomorrow`
  - [ ] `/todos/tomorrow/[id]`
  - [ ] `/todos/future`
  - [ ] `/todos/future/[id]`
  - [ ] `/todos/completed`
  - [ ] `/todos/completed/[id]`
  - [ ] `/todos/deleted`
  - [ ] `/todos/deleted/[id]`
  - [ ] `/categories`
  - [ ] `/categories/[id]` (including `new` sentinel)
  - [ ] `/about`
  - [ ] `/about/support`
  - [ ] `/about/privacy`
  - [ ] `/about/say-thanks`
  - [ ] `/signin`
  - [ ] `/signup`
- [ ] Implement root layout(s) that mirror the current drawer + stack pattern.
- [ ] Preserve the drawer width (`220`) and breakpoint-driven drawer type
  (`permanent` on large screens, `back` on smaller screens).
- [ ] Ensure the navigation container (Expo Router root) stays stable and
  does not rerender unnecessarily, to avoid Safari/Firefox history API limits.

## 4) Auth-driven routing and drawer contents

- [ ] Implement auth-aware routing groups or redirects so that:
  - [ ] Logged-in users see the main todo/category routes in the drawer.
  - [ ] Logged-out users see Sign in/Sign up in the drawer.
  - [ ] The About section remains visible in both states.
- [ ] Preserve the Sign out drawer item behavior:
  - [ ] Calls `clearToken()`.
  - [ ] Navigates to `/signin`.
  - [ ] Keeps the `sign-out-button` test ID.
- [ ] Ensure drawer items always route to list-level paths (not the last-opened
  detail screen), matching current behavior.
- [ ] Preserve the App Store download button in the drawer footer on web.

## 5) Custom header and navigation controls

- [ ] Recreate the custom header (NavigationBar) in Expo Router:
  - [ ] Back button appears only when the screen is not the initial route.
  - [ ] Back button uses `router.back()` or equivalent.
  - [ ] Keeps the `back-button` test ID.
  - [ ] Drawer toggle appears only on non-large breakpoints.
  - [ ] Drawer toggle keeps `toggle-navigation-button` test ID.
- [ ] Ensure the header titles match current behavior for each stack screen.

## 6) Screen navigation updates

- [ ] Update list screens to navigate to detail routes via Expo Router APIs.
- [ ] Update detail screens to navigate back after actions (complete/delete/
  defer) using Expo Router equivalents.
- [ ] Maintain `useFocusEffect()` or equivalent focus-based refresh behavior
  for list screens (available, tomorrow, future, completed, deleted, categories).
- [ ] Update About screen links to new router navigation calls.
- [ ] Update Sign-in and Sign-up navigation flows (signin <-> signup).
- [ ] Keep category creation behavior using `/categories/new` and sentinel
  handling in the detail screen.

## 7) URL and deep link parity

- [ ] Validate the Expo Router path structure exactly matches existing URL
  paths (no breaking changes for web deep links).
- [ ] Confirm drawer navigation and direct URL entry work for all list/detail
  screens.
- [ ] Verify the `ROUTE_PATH_MAP` behavior is replaced or reimplemented so that
  drawer navigation uses explicit URL paths.

## 8) Tests, verification, and regression checks

- [ ] Update unit tests to use Expo Router navigation primitives:
  - [ ] NavigationBar and NavigationDrawer specs.
  - [ ] Todo list screen specs.
  - [ ] Category list/detail specs.
  - [ ] Todo detail specs.
  - [ ] Sign-in/Sign-up specs.
- [ ] Update test utilities/mocks for Expo Router equivalents.
- [ ] Run Jest unit tests for navigation-related components.
- [ ] Run Cypress tests and ensure all Cypress specs pass:
  - [ ] `cypress/e2e/smoke.cy.js`
  - [ ] `cypress/e2e/navigation.cy.js`
  - [ ] `cypress/e2e/todo-detail-available.cy.js`
- [ ] Verify Detox tests still pass or update them if needed.

## 9) Manual verification checklist

- [ ] Manual: Sign in, navigate via drawer to each todo list, open a detail,
  go back, and confirm list refreshes.
- [ ] Manual: Deep link directly to a todo detail URL and confirm it loads.
- [ ] Manual: Open the drawer on small screens (toggle button) and verify it
  is permanent on large screens.
- [ ] Manual: Sign out from the drawer and confirm redirect to `/signin`.
- [ ] Manual: Verify category creation with `/categories/new` still works.
- [ ] Manual: Navigate About -> Support/Privacy/Thanks links.

## 10) Cleanup and documentation

- [ ] Remove unused React Navigation configuration and route maps that are no
  longer needed after Expo Router adoption.
- [ ] Update `docs/navigation.md` (or add a new section) to describe the
  Expo Router-based navigation structure once migration is complete.
