# React Navigation 8 Alpha Spike Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to work through this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Find out whether `UNSTABLE_CornerInset` from React Navigation 8 alpha actually clears the iPadOS windowed-mode traffic light buttons in Surely. That is the entire question.

**This is a throwaway experiment. It will NOT be merged.** React Navigation 8 is alpha software. The branch exists to produce an answer and some screenshots, nothing more.

**Do NOT touch tests.** Not the Jest suite, not Cypress, not test config. If `npx jest src` goes red after the corner insets land, that is expected and irrelevant — leave it. Repairing the test suite for a branch that will not merge is wasted work.

**Architecture:** Bump the three React Navigation packages to pinned alpha versions plus `react-native-gesture-handler@3` (required by drawer v8), rebuild native since `@react-navigation/native@8` now ships an iOS podspec, add `UNSTABLE_CornerInset` in two places, then look at it on an iPad.

**Tech Stack:** Expo SDK 57, React Native 0.86, React 19.2.3, React Navigation 8 alpha, react-native-gesture-handler 3, react-native-paper 5.

**Spec:** `docs/superpowers/specs/2026-07-30-react-navigation-8-alpha-design.md`

**Branch:** `react-navigation-8-alpha`

---

## Scope

**In scope:** get the alpha installed, get it building, add the insets, look at the result on an iPadOS 26 simulator, write down what happened.

**Out of scope:** merging, pushing, opening a PR, bumping `ios.buildNumber`, the Jest suite, the Cypress suite, test configuration, deep-link regression sweeps, the static navigation API, any other v8 feature, TypeScript.

**Known and accepted going in:**
- `expo-doctor` will complain that gesture-handler 3 is not what SDK 57 pins. Expected; drawer v8 requires it.
- `npx jest src` will likely break once Task 4 lands, because `CornerInset.ios.js` imports a codegen'd Fabric component and jest-expo runs specs as iOS. Expected; ignore it.
- `src/utils/grouping.spec.js` already fails 2 tests on `main` in a `America/Los_Angeles` timezone. Pre-existing, unrelated, ignore it.

`ios/` is gitignored and fully managed by `expo prebuild`. Nothing under it is committed.

---

## Task 1: Upgrade the dependencies

**Files:** `package.json`, `yarn.lock`

- [ ] **Step 1: Check for newer alphas**

```bash
npm view @react-navigation/native@next version
npm view @react-navigation/drawer@next version
npm view @react-navigation/native-stack@next version
```

As of 2026-07-30: `8.0.0-alpha.40`, `8.0.0-alpha.47`, `8.0.0-alpha.48`. Newer is fine if peer ranges still line up (Step 2).

- [ ] **Step 2: Verify peer ranges line up**

```bash
npm view @react-navigation/drawer@next peerDependencies --json
npm view @react-navigation/native-stack@next peerDependencies --json
```

Both must accept the `@react-navigation/native` version you picked.

**Gate:** mismatched alphas resolve two copies of `@react-navigation/core`, which silently breaks context — including the context `CornerInset` reads. Do not proceed past a mismatch.

- [ ] **Step 3: Edit `package.json`**

Exact pins, no carets — alpha builds break against each other:

```json
    "@react-navigation/drawer": "8.0.0-alpha.47",
    "@react-navigation/native": "8.0.0-alpha.40",
    "@react-navigation/native-stack": "8.0.0-alpha.48",
    "react-native-gesture-handler": "3.1.0",
```

- [ ] **Step 4: Install**

```bash
yarn install
```

Peer warnings about gesture-handler are expected. A hard resolution error is not.

- [ ] **Step 5: Verify one copy of the core and the presence of native code**

```bash
cat node_modules/@react-navigation/core/package.json | grep '"version"'
ls node_modules/@react-navigation/native/ReactNavigation.podspec node_modules/@react-navigation/native/ios/
```

Expected: core is `8.0.0-alpha.*`, the podspec exists, and `ios/` contains
`ReactNavigationCornerInsetView.swift`. A nested
`drawer/node_modules/@react-navigation/core` means mismatched versions — go back to Step 2.

- [ ] **Step 6: Commit**

```bash
git add package.json yarn.lock
git commit -m "Upgrade React Navigation to 8.0.0 alpha and gesture-handler to 3"
```

---

## Task 2: Rebuild native and get the app running

**Files:** none committed (`ios/` is gitignored).

- [ ] **Step 1: Regenerate the iOS project**

```bash
yarn prebuild
```

Runs `expo prebuild -p ios`, which regenerates `ios/` and installs pods. If pods did not
install, run `cd ios && pod install && cd ..`.

- [ ] **Step 2: Verify the ReactNavigation pod resolved**

```bash
grep -n "ReactNavigation" ios/Podfile.lock
```

**This is the critical gate.** At least one `ReactNavigation` entry must appear — it is the
signal that v8's new native side wired up. Empty means the podspec was not picked up and
`UNSTABLE_CornerInset` cannot work regardless of what the JS does. Stop and investigate.

- [ ] **Step 3: Verify iPad windowing is still permitted**

```bash
grep -A3 "UIRequiresFullScreen" ios/Surely/Info.plist
grep -A6 "UISupportedInterfaceOrientations~ipad" ios/Surely/Info.plist
```

Expected: `UIRequiresFullScreen` is `<false/>` and the iPad array has all four
orientations. Both were true before the upgrade. If prebuild changed either, Task 4 is
impossible — stop.

- [ ] **Step 4: Build and run**

```bash
yarn ios
```

A native failure here most likely points at gesture-handler 3 or the new pod.

- [ ] **Step 5: Smoke-test the drawer gesture**

Swipe from the left edge to open the drawer, swipe to close, tap the hamburger button.

**Gate:** the gesture must work. This is the practical check that gesture-handler 3
integrated. Only if it fails, do Task 3.

- [ ] **Step 6: Click around briefly**

Available → a todo detail → back. Open the drawer, switch to Categories and About.
Confirm nothing crashes and the drawer lists the expected items. This is a sanity check,
not an audit — do not go route by route.

---

## Task 3: Add GestureHandlerRootView — only if Task 2 Step 5 failed

Surely imports gesture-handler nowhere today. **If the drawer gesture worked, skip this
task entirely.**

**Files:** `App.js`

- [ ] **Step 1: Add the import**

In `App.js`, with the other package imports:

```js
import {GestureHandlerRootView} from 'react-native-gesture-handler';
```

- [ ] **Step 2: Wrap the tree**

Replace:

```jsx
    <QueryClientProvider client={queryClient}>
```

with:

```jsx
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
```

and close after `</QueryClientProvider>`:

```jsx
      </QueryClientProvider>
    </GestureHandlerRootView>
```

Re-indent the wrapped block one level.

- [ ] **Step 3: Verify**

Reload and re-run Task 2 Step 5. The gesture must now work.

- [ ] **Step 4: Commit**

```bash
git add App.js
git commit -m "Add GestureHandlerRootView required by gesture-handler 3"
```

---

## Task 4: Add the corner insets

The export is `UNSTABLE_CornerInset`, uppercase — the docs page URL anchor lowercases it,
the actual export does not. Props: `direction` is `'horizontal' | 'vertical'`, `edge` is
`'left' | 'right' | 'top' | 'bottom'`. It reserves the width (horizontal) or height
(vertical) of the traffic light area, and renders `null` off-iOS.

**Files:** `src/components/NavigationBar.js`, `src/components/NavigationDrawer.js`

- [ ] **Step 1: Header import**

In `src/components/NavigationBar.js`, add as the first import — packages sort before
relative, and `@` before `r`:

```js
import {UNSTABLE_CornerInset} from '@react-navigation/native';
```

Giving:

```js
import {UNSTABLE_CornerInset} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {Appbar} from 'react-native-paper';
import {large, useBreakpoint} from '../breakpoints';
import {SURELY_GREEN} from '../useTheme';
```

- [ ] **Step 2: Render the header inset**

Replace:

```jsx
    <Appbar.Header style={headerStyle}>
      {back ? (
```

with:

```jsx
    <Appbar.Header style={headerStyle}>
      {showDrawerToggle && (
        <UNSTABLE_CornerInset direction="horizontal" edge="left" />
      )}
      {back ? (
```

First child, so it pushes the back and menu buttons clear. The `showDrawerToggle` gate
(already defined in this file as `breakpoint !== large`) is deliberate: on large screens
the permanent drawer sits left of the header, so the header does not touch the window edge
and must not be inset.

- [ ] **Step 3: Drawer import**

In `src/components/NavigationDrawer.js`, extend the existing first import — uppercase
sorts first inside the braces:

```js
import {UNSTABLE_CornerInset, useLinkTo} from '@react-navigation/native';
```

- [ ] **Step 4: Render the drawer inset**

At `src/components/NavigationDrawer.js:40`, replace:

```jsx
    <DrawerContentScrollView style={scrollViewStyle} {...navProps}>
      {state.routes.map((route, index) => (
```

with:

```jsx
    <DrawerContentScrollView style={scrollViewStyle} {...navProps}>
      <UNSTABLE_CornerInset direction="vertical" edge="top" />
      {state.routes.map((route, index) => (
```

Unconditional, unlike the header: the drawer occupies the window's top-left whenever
visible, in both `permanent` and `back` modes.

- [ ] **Step 5: Lint and format**

```bash
yarn lint && yarn format:check
```

Both should pass. If `format:check` fails, run `yarn format`. **Do not run Jest.**

- [ ] **Step 6: Commit**

```bash
git add src/components/NavigationBar.js src/components/NavigationDrawer.js
git commit -m "Add corner insets for iPadOS windowed mode traffic lights"
```

---

## Task 5: Look at it on an iPad — this is the whole point

**Files:** none modified.

- [ ] **Step 1: Pick an iPad simulator**

```bash
xcrun simctl list devices available | grep -i ipad
```

Needs an iPadOS 26 device. Confirmed available on this machine (iOS 26.4 runtime,
iPad Pro 13-inch M4 among others).

- [ ] **Step 2: Build and run on it**

```bash
yarn ios --device "iPad Pro 13-inch (M4)"
```

- [ ] **Step 3: Enter windowed mode**

If the app opens full screen, enable windowing in the simulator via Settings →
Multitasking → Windowed, then reopen Surely. Drag the resize handle at the window's
bottom-right. The traffic lights appear at the window's top-left.

**This step needs a human.** Dragging a simulator window is not scriptable here.

- [ ] **Step 4: Narrow layout**

Drag narrower than 600pt — the drawer collapses and the hamburger appears
(`src/breakpoints.js`).

Expected: traffic lights sit in reserved space at the header's left; the back and menu
buttons are fully visible and tappable.

- [ ] **Step 5: Wide layout**

Drag wider than 600pt — the permanent 220px drawer appears.

Expected: traffic lights sit in reserved space above the first drawer item, which stays
fully visible and tappable.

- [ ] **Step 6: Cross the breakpoint a few times**

Drag slowly across 600pt in both directions. `CornerInset` freezes its measurement and
re-measures on `Dimensions` change and transition end, so this is exactly where a stale
inset would show. Watch for it sticking at the wrong size.

- [ ] **Step 7: Screenshot both states**

Save under `docs/navigation-screenshots/` or attach to the Task 6 findings. These are the
deliverable.

- [ ] **Step 8: Commit screenshots**

```bash
git add docs/navigation-screenshots/
git commit -m "Add iPadOS windowed mode corner inset screenshots"
```

---

## Task 6: Write down what happened, then stop

**Files:** Create `docs/superpowers/plans/2026-07-30-react-navigation-8-alpha-findings.md`

- [ ] **Step 1: Write the findings**

Cover:

- **Did it work?** Per layout (narrow / wide) and per control. Be specific.
- **Screenshots** from Task 5.
- **Versions used** — the four pins from Task 1 Step 3.
- **The expo-doctor warning**, verbatim.
- **Native build friction** — anything that went wrong in Task 2 and how it was resolved.
- **Anything surprising** noticed while clicking around in Task 2 Step 6.
- **Verdict** — is this worth revisiting when 8.0 goes stable, or is the hand-rolled
  fallback in the spec the better path?
- **Expo Router tension** — `docs/navigation-migration.md` describes an unstarted
  migration to Expo Router, which wraps React Navigation and would deliver v8 in time.
  Note whether that changes the verdict.

- [ ] **Step 2: Confirm nothing shipped**

```bash
grep -n "buildNumber" app.json
git log --oneline main..HEAD
```

Expected: `buildNumber` still `"93"`, and `main` untouched.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-07-30-react-navigation-8-alpha-findings.md
git commit -m "Add React Navigation 8 alpha spike findings"
```

- [ ] **Step 4: Stop**

Do not merge. Do not push. Do not open a PR. Do not bump `ios.buildNumber`. Report the
verdict and wait.

If the branch has served its purpose and you want it gone:

```bash
git checkout main
git branch -D react-navigation-8-alpha
yarn install
yarn prebuild --clean
```
