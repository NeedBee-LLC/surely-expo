# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Surely is a cross-platform todo app built with Expo React Native that deploys to both iOS and web. It uses a JSON:API backend (https://api.surelytodo.com) for data persistence. The app features Material Design with dark mode support, responsive layouts, and a drawer navigation system that adapts to different screen sizes.

## Requirements

- Node 22.x
- Yarn 1.x
- Expo CLI
- EAS CLI (for builds)
- Cocoapods (for iOS)
- Detox CLI (for end-to-end tests)

Install requirements and dependencies: `bin/setup` or `yarn install`

## Common Commands

### Development
- `yarn start` - Start Expo dev server (press `i` for iOS simulator, `w` for web)
- `yarn start:mock` - Start with mock API enabled
- `yarn ios` - Build and run native dev client on iOS simulator
- `yarn web` - Start web version
- `yarn clean` - Clean prebuild and restart with cleared cache
- `yarn prebuild` - Run Expo prebuild for iOS

### Testing
- `yarn test` - Run Jest tests in watch mode
- `yarn test:coverage` - Run tests with coverage report
- `yarn lint` - Run ESLint on source files
- `yarn cypress:open` - Open Cypress for e2e web tests (requires `yarn start` running first)
- `yarn maestro:ios` - Run Maestro tests on iOS
- `yarn maestro:web` - Run Maestro tests on web

### Building & Deployment
- `yarn build:web` - Build for web (outputs to `dist/`)
- `yarn build:ios` - Build iOS locally with EAS
- `yarn build:ios:remote` - Build iOS remotely with EAS
- `yarn deploy:web` - Deploy to Netlify

**Before iOS release:** Increment `ios.buildNumber` in [app.json](app.json), then run `yarn build:ios` and upload the `.ipa` via Apple Transporter app.

## Architecture

### Navigation Structure

The app uses React Navigation with a **drawer + stack navigation pattern**:

- **Drawer Navigator** (root) - Contains main sections, switches between persistent (large screens) and collapsible (small screens) via breakpoint system
- **Stack Navigators** (per section) - Each drawer section (Available, Tomorrow, Future, etc.) has its own stack with list + detail screens
- **Web URL Support** - Full deep linking configured in [src/Navigation.js](src/Navigation.js) with paths like `/todos/available`, `/categories/:id`

Navigation is defined in [src/Navigation.js](src/Navigation.js). Each main section (Available, Tomorrow, Future, Completed, Deleted, Categories) contains a stack with a list screen and a detail screen.

**Important:** The `NavigationContainer` must not rerender frequently due to Safari/Firefox limits on history API calls (100 calls per 30 seconds). Hooks are placed in `NavigationContents` to prevent parent rerenders.

### State Management

- **React Query (@tanstack/react-query)** - Server state and data fetching
- **React Context** - Authentication token management ([src/data/token.js](src/data/token.js))
- **Component State** - Local UI state with hooks

### Data Layer

The app uses **JSON:API** via the `@codingitwrong/jsonapi-client` library for all API communication:

- **Resource Clients** - Created per resource type (todos, categories, users)
- **Custom HTTP Client** - [src/data/authenticatedHttpClient.js](src/data/authenticatedHttpClient.js) creates Axios instances with Bearer token auth
- **Hooks Pattern** - Each resource has a hook (e.g., `useTodos()`) that returns a configured resource client
- **Mock Mode** - Mock implementations (e.g., [src/data/authenticatedHttpClient.mock.js](src/data/authenticatedHttpClient.mock.js)) for development without backend

### Storage Abstraction

Platform-specific storage is abstracted in [src/storage/](src/storage/):
- [src/storage/native.js](src/storage/native.js) - Uses Expo SecureStore for iOS/Android
- [src/storage/web.js](src/storage/web.js) - Uses localStorage for web
- [src/storage/index.js](src/storage/index.js) - Exports unified API that switches based on platform

### Responsive Design

Uses a custom library `react-native-style-queries` for responsive styling:

- **Breakpoints** - Defined in [src/breakpoints.js](src/breakpoints.js): medium (<600px) and large (≥600px)
- **useBreakpoint() hook** - Returns current breakpoint based on window dimensions
- **Style Queries** - Apply styles declaratively similar to CSS media queries
- **Shared Styles** - Common responsive patterns in [src/sharedStyleQueries.js](src/sharedStyleQueries.js) and [src/sharedStyles.js](src/sharedStyles.js)

### Theming

- **React Native Paper** - Material Design components and theming
- **Custom Theme Hook** - [src/useTheme.js](src/useTheme.js) provides theme configuration
- **Dark Mode** - Automatic dark mode support via `userInterfaceStyle: "automatic"` in [app.json](app.json)

### App Structure

Provider hierarchy in [App.js](App.js):
```
QueryClientProvider (React Query)
└─ TokenProvider (Auth state)
   └─ TokenLoadBuffer (Waits for token to load from storage)
      └─ PaperProvider (Material Design theme)
         └─ StatusBar
         └─ SafeAreaProvider
            └─ ScreenBackground
               └─ Navigation
```

### Base URL Configuration

API base URL logic in [src/baseUrl.js](src/baseUrl.js):
- **Development:** `localhost:3000` (iOS), `10.0.2.2:3000` (Android)
- **Physical Device:** Set `LOCAL_IP` to dev machine IP
- **Production:** `https://api.surelytodo.com`

### Testing

- **Unit Tests** - Jest with React Native Testing Library, files use `.spec.js` extension
- **Test Utils** - [src/testUtils.js](src/testUtils.js) provides mocks for common dependencies (safe area, navigation)
- **E2E Web Tests** - Cypress (config: [cypress.config.js](cypress.config.js))
- **E2E Mobile Tests** - Maestro (in `maestro/` directory)
- **Mock API Mode** - Set `MOCK_API=true` env var to use mock data layer

To run a single test file: `yarn test <path/to/file.spec.js>`

### Screen Organization

Screens are organized by feature in `src/screens/`:
- **TodoList/** - Available, Tomorrow, Future, Completed, Deleted screens (each has list + detail)
- **TodoDetail/** - Todo detail view with form and display modes
- **CategoryList.js** / **CategoryDetail.js** - Category management
- **Login/** - SignIn and SignUp forms
- **About/** - About, Support, Privacy, Thanks screens

### Component Patterns

- **Reusable Components** - Shared UI components in [src/components/](src/components/)
- **Platform-Specific** - Use `Platform.OS` checks when needed
- **Accessibility** - Components include `accessibilityRole` and labels (tested with iOS Voice Control)
- **Material Design** - Uses React Native Paper components (`List`, `Button`, `TextInput`, etc.)
