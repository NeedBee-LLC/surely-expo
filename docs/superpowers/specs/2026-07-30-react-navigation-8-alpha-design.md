# React Navigation 8.0.0 Alpha Upgrade — Design

**Date:** 2026-07-30
**Status:** Approved for implementation
**Goal:** Gain access to `UNSTABLE_CornerInset` so Surely's navigation chrome avoids the
iPadOS windowed-mode traffic light buttons.
**Outcome:** A throwaway spike. **This branch will NOT be merged**, and **no test work will
be done on it.** React Navigation 8 is alpha software; the branch exists to answer one
question — does the corner inset actually work in Surely — and to produce screenshots.

## Motivation

In iPadOS 26 windowed mode, the window's traffic light buttons (close, minimize, maximize)
are drawn over the top-left of the app's content. Surely puts navigation chrome exactly
there in both of its layouts, so the buttons overlap tappable UI.

React Navigation 8 adds `UNSTABLE_CornerInset`, a spacer component that measures the
traffic light area natively and reserves space for it. It is not available in v7 and
cannot be backported, because it is backed by a new native iOS view shipped inside
`@react-navigation/native`.

## Current State

Surely is on React Navigation 7 (`native` 7.2.2, `drawer` 7.9.9, `native-stack` 7.14.12)
under Expo SDK 57 / React Native 0.86.

Navigation structure (see `docs/navigation-screenshots.md` for the authoritative
behavioral spec):

- `NavigationContainer` with a `linking` config, in `src/Navigation.js`
- Root drawer navigator, `drawerType` switching on breakpoint:
  `permanent` at ≥600px, `back` below
- Per-section native stack navigators, each with a custom `header`
- `src/components/NavigationBar.js` — custom header built on Paper's `Appbar.Header`
- `src/components/NavigationDrawer.js` — custom drawer content built on
  `DrawerContentScrollView`

## Compatibility Assessment

### Already satisfied

Every v8 peer requirement except one is already met by Expo SDK 57:

| Requirement | Needed | Have |
| --- | --- | --- |
| react-native | ≥ 0.83 | 0.86.0 |
| react | ≥ 19.2.0 | 19.2.3 |
| react-native-screens | ≥ 4.25.0 | ~4.26.0 |
| react-native-safe-area-context | ≥ 5.5.0 | ~5.7.0 |
| react-native-reanimated | ≥ 4.0.0 | 4.5.0 |
| react-native-worklets | ≥ 0.4.0 | 0.10.0 |
| react-native-web | ≥ 0.21.0 | ^0.21.2 |
| typescript | ≥ 6.0.0 | ~6.0.3 |

### Not satisfied

**`react-native-gesture-handler` ≥ 3.0.0** — required by `@react-navigation/drawer@8`.
Surely has 2.32.0, which is what Expo SDK 57 pins. GH 3.1.0 exists and supports
RN ≥ 0.82, but it sits outside Expo SDK 57's supported version set, so `expo-doctor`
will warn. The warning is expected and is not by itself a reason to abort.

### New in v8: native code in `@react-navigation/native`

v7's `@react-navigation/native` was JavaScript only. v8 ships `ReactNavigation.podspec`
and a Fabric view (`ReactNavigationCornerInsetView`) implementing the corner inset.
Consequences:

- A prebuild and pod install are required; a JS-only reload is not enough.
- It will not run in Expo Go. Surely already uses `expo-dev-client`, so this is fine.
- `CornerInset` renders `null` on non-iOS platforms, so web and Android are unaffected.

### Breaking changes that do not apply

Surely is JavaScript, not TypeScript, so v8's largest category of breaking changes — the
TypeScript type-system rework (`RootParamList` → module augmentation,
`NavigatorScreenParams`, hook generics, `createNavigatorFactory`) — is irrelevant.

Surely also uses none of the removed or renamed runtime APIs: no `overlayColor`, no
`detachInactiveScreens` / `detachPreviousScreen` / `freezeOnBlur`, no navigator `id`,
no `headerBackImage`, no `navigateDeprecated`, no `getId`, no bottom tabs, no
material top tabs.

Verified present in the alpha's type definitions and still used by Surely:
`drawerType: 'front'|'back'|'slide'|'permanent'`, `drawerStyle`, `drawerContent`,
`DrawerContentScrollView`, `useLinkTo`, `linking` config without `prefixes`, and the
custom `header` screen option receiving `{navigation, options, back}`.

## Approach

Upgrade all three React Navigation packages to pinned alpha versions, plus
gesture-handler 3. Two alternatives were considered and rejected:

**Upgrade `@react-navigation/native` alone, keep drawer and native-stack on v7.**
Not viable. Drawer 8's peer dependency is `@react-navigation/native@^8.0.0-alpha.40`, and
`CornerInset` reads `NavigationContainerRefContext` from `@react-navigation/core@8`. A v7
drawer resolves a different core, so the context would be empty and the component inert.

**Hand-roll the inset without upgrading.** No public API exposes the traffic light rect,
so this means hardcoding an approximate spacer inferred from window state. Zero dependency
risk but it is a guess Apple can invalidate. Reserve as a fallback only if the alpha
proves unusable.

## Plan

### Phase 0 — Branch and baseline

Branch from `main`. Before changing anything, record the results of
`yarn test --watchAll=false`, `yarn lint`, and `yarn build:web`, so that later failures
are attributable to the upgrade rather than to pre-existing state.

Leave the untracked `pnpm-lock.yaml`, `pnpm-workspace.yaml`, and `.tmuxinator.yml` alone.
`yarn.lock` remains the source of truth per CLAUDE.md.

### Phase 1 — Dependencies

Pin exact versions with no caret ranges; alpha builds break against each other.

- `@react-navigation/native` → `8.0.0-alpha.40`
- `@react-navigation/drawer` → `8.0.0-alpha.47`
- `@react-navigation/native-stack` → `8.0.0-alpha.48`
- `react-native-gesture-handler` → `3.1.0`

Re-check for newer alphas at execution time, and confirm drawer's and native-stack's
peer range on `@react-navigation/native` is still satisfied by whatever `native` version
is chosen. Record the `expo-doctor` gesture-handler warning rather than suppressing it.

### Phase 2 — Native rebuild

Run `yarn prebuild` followed by a pod install, then `yarn ios`.

Verify a `ReactNavigation` pod appears in `Podfile.lock` — that is the signal the new
native side wired up correctly. Diff the regenerated `ios/*/Info.plist` to confirm iPad
orientation support survives prebuild (see Phase 6).

**Gate:** app boots on the iPhone simulator and the drawer opens and closes by gesture.
The gesture is the practical smoke test for gesture-handler 3.

### Phase 3 — Gesture Handler 3

Surely imports gesture-handler nowhere in `src/` or `App.js` — no `GestureHandlerRootView`,
no `gestureHandlerRootHOC`. Check GH3's migration guide for whether a root view is now
mandatory at app root, and add one to `App.js` only if it is.

### Phase 4 — Sanity check only

Static analysis already cleared every navigation option Surely uses against the alpha's
type definitions. Given this is a throwaway spike, the original full audit is reduced to
clicking around for a minute: open a list, a detail screen, and a couple of drawer
sections, and confirm nothing crashes and the drawer lists the expected items.

Three v8 behavior changes are known and worth *noticing* if they bite, but are not swept
for systematically:

1. **`state.routes` in `CustomNavigationDrawer`.** v8 puts preloaded routes in `routes`
   after `state.index`, and the drawer maps `state.routes` straight to `Drawer.Item`s. If
   phantom or misordered items appear, that is why; `state.routes.slice(0, state.index + 1)`
   is the fix.
2. **Linking.** Deep linking is on by default and `prefixes` is now optional.
3. **Web `inert`.** Unfocused screens use `inert` instead of `aria-hidden`, which blocks
   interaction more aggressively.

### Phase 5 — Add the corner insets

Import is `UNSTABLE_CornerInset` (uppercase) from `@react-navigation/native`. The
documentation page's URL anchor lowercases it; the actual export does not.

**`src/components/NavigationBar.js`** — add
`<UNSTABLE_CornerInset direction="horizontal" edge="left" />` as the first child of
`Appbar.Header`, before the back action. Gate it on the existing `showDrawerToggle`
condition (`breakpoint !== large`). On large screens the permanent drawer sits to the left
of the header, so the header must not be inset there.

**`src/components/NavigationDrawer.js`** — add
`<UNSTABLE_CornerInset direction="vertical" edge="top" />` as the first child inside
`DrawerContentScrollView`, unconditionally. The drawer occupies the top-left whenever it
is visible, in both `permanent` and `back` modes.

### Phase 6 — iPad verification (decision gate)

This is the deliverable. Everything before it is setup; everything after it is cleanup.

On an iPadOS 26 simulator with the dev client installed, enter windowed mode and:

- Drag the window narrow (<600px) — drawer collapses, header inset should be active and
  the traffic lights should clear the back and menu buttons.
- Drag the window wide (≥600px) — permanent drawer, drawer inset should be active and the
  traffic lights should clear the first drawer item.

Capture screenshots of both states. Check them against the expected behavior in
`docs/navigation-screenshots.md`.

`UIRequiresFullScreen` is already `false` and prebuild grants iPad all four orientations,
so windowed mode is reachable with no `app.json` changes. The `"orientation": "portrait"`
setting in `app.json` constrains iPhone only.

**If the insets do not work here, stop.** Nothing downstream matters and the branch gets
parked.

### Phase 7 — No test work

**Deliberately not done.** Repairing test suites for a branch that will not merge is
wasted effort on alpha software.

Expect `npx jest src` to go red once Phase 5 lands: `CornerInset.ios.js` imports a
codegen'd Fabric component and jest-expo runs specs with `Platform.OS === 'ios'`, which
will likely break `NavigationBar.spec.js` and `NavigationDrawer.spec.js` at import time.
That is a JS test-environment artifact, not a native regression, and it is left alone.

Separately, `src/utils/grouping.spec.js` already fails 2 tests on `main` when the machine
is in a US Pacific timezone — the `groupByDate` fixtures are timezone-sensitive. It passes
under `TZ=UTC` and `TZ=America/New_York`. Pre-existing and unrelated; noted here only so
it is not mistaken for upgrade fallout.

If this work is ever revived for real, test repair becomes a required phase.

### Phase 8 — Decide

Write up findings: what worked, what broke, how much churn the alpha imposes. Leave the
branch unmerged. Do not touch `ios.buildNumber`.

Rollback is branch delete, `yarn install`, `yarn prebuild --clean`.

## Out of Scope

Merging to `main` — this branch is throwaway. Pushing, or opening a PR. Shipping to the
App Store. Bumping `ios.buildNumber`. **All test work**: the Jest suite, the Cypress suite,
and test configuration. Deep-link regression sweeps. Migrating to the static navigation
API. Adopting any other v8 feature (loaders, `retain()`, `pushParams`, liquid glass
headers, Material themes). Converting the project to TypeScript.

## Risks

- **Alpha churn.** Versions are skewed across packages (native alpha.40, drawer alpha.47,
  native-stack alpha.48) and move frequently. Pinning exact versions contains this.
- **Gesture-handler off Expo's support matrix.** GH 3.1.0 is not what SDK 57 pins.
  Native build or gesture regressions are possible; the Phase 2 gate catches them early.
- **Native code in `@react-navigation/native`.** Any assumption elsewhere that React
  Navigation is JS-only (EAS build config, caching) may need revisiting.
- **Test environment breakage** from the Fabric component, as described in Phase 7.

## Open Questions

`docs/navigation-migration.md` describes an unstarted migration from React Navigation to
Expo Router. If that migration is still intended, this upgrade is partly throwaway work —
Expo Router wraps React Navigation and would deliver v8 in due course. This does not block
the experiment, but it should inform the Phase 8 merge decision.
