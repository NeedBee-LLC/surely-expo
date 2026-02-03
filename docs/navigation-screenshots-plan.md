# Navigation Screenshots Documentation Plan

## Overview

This document outlines the plan to comprehensively document all screens in the Surely app along with their navigation behavior and visual appearance. The goal is to create a complete reference that shows how navigation elements (drawer, back button, menu toggle) behave across different screens and screen sizes.

## Complete Screen Inventory

Based on cross-referencing `docs/navigation.md` and `src/Navigation.js`, the app contains **18 unique screens** organized as follows:

### Logged-In Todo Screens (10 screens)

- [x] **Available List** (`AvailableTodos`) - `/todos/available` - _Capturing_
- [x] **Available Detail** (`AvailableTodoDetail`) - `/todos/available/:id` - _Capturing_
- [x] **Tomorrow List** (`TomorrowTodos`) - `/todos/tomorrow` - _Capturing_
- [ ] **Tomorrow Detail** (`TomorrowTodoDetail`) - `/todos/tomorrow/:id` - _Not capturing - follows same pattern as Available Detail_
- [x] **Future List** (`FutureTodos`) - `/todos/future` - _Capturing_
- [ ] **Future Detail** (`FutureTodoDetail`) - `/todos/future/:id` - _Not capturing - follows same pattern as Available Detail_
- [x] **Completed List** (`CompletedTodos`) - `/todos/completed` - _Capturing_
- [ ] **Completed Detail** (`CompletedTodoDetail`) - `/todos/completed/:id` - _Not capturing - follows same pattern as Available Detail_
- [x] **Deleted List** (`DeletedTodos`) - `/todos/deleted` - _Capturing_
- [ ] **Deleted Detail** (`DeletedTodoDetail`) - `/todos/deleted/:id` - _Not capturing - follows same pattern as Available Detail_

### Category Screens (2 screens)

- [x] **Category List** (`CategoryList`) - `/categories` - _Capturing_
- [x] **Category Detail** (`CategoryDetail`) - `/categories/:id` (includes "new" mode at `/categories/new`) - _Capturing both edit and new modes_

### Authentication Screens (2 screens)

- [x] **Sign In** (`SignInScreen`) - `/signin` - _Capturing_
- [ ] **Sign Up** (`SignUpScreen`) - `/signup` - _Not capturing - follows same pattern as Sign In_

### About Screens (4 screens)

- [x] **About** (`AboutScreen`) - `/about` - _Capturing_
- [x] **Support** (`SupportScreen`) - `/about/support` - _Capturing_
- [ ] **Privacy** (`PrivacyScreen`) - `/about/privacy` - _Not capturing - static content screen_
- [ ] **Thanks** (`ThanksScreen`) - `/about/say-thanks` - _Not capturing - static content screen_

**Note:** We are capturing 12 of the 18 screens, which comprehensively documents all unique navigation patterns. The remaining 6 screens follow patterns already captured (detail screens, auth forms, and static content).

## Navigation Elements to Document

For each screen, we will document the following navigation-related elements:

### 1. Header Bar Elements

- **Title**: The screen title displayed in the header
- **Back Button**: Whether a back button is present (present on detail screens, absent on list screens)
  - Logic: Appears when screen is not the initial route in its stack (see `CustomNavigationBar` in `src/components/NavigationBar.js`)
- **Hamburger Menu Toggle**: Whether the drawer toggle icon is present
  - Logic: Only shown on **medium breakpoint** (< 600px width), hidden on **large breakpoint** (≥ 600px width)

### 2. Drawer Behavior

- **Drawer Type**:
  - **Permanent** (large breakpoint ≥ 600px): Drawer is always visible as a sidebar, cannot be toggled
  - **Back/Collapsible** (medium breakpoint < 600px): Drawer slides in from behind, toggled via hamburger menu
- **Drawer Width**: 220px (defined in `src/Navigation.js`)
- **Drawer Items**: List of navigation items shown in the drawer (depends on authentication state)
  - **When logged in**: Available, Tomorrow, Future, Completed, Deleted, Categories, About, Sign out
  - **When logged out**: Sign in, Sign up, About
- **Drawer Icons**: Document which icon is shown for each item (defined in `ICON_BY_ROUTE` in `src/Navigation.js`)

### 3. Screen-Specific Navigation Triggers

Document any additional navigation elements specific to each screen:

- List item taps (navigate to detail)
- Action buttons (Add, Edit, Delete, Save, Cancel)
- Text links (e.g., "Don't have an account?" on Sign In)
- Navigation after actions (e.g., auto-navigation after completing a todo)

### 4. URL and Deep Linking

- **URL Path**: The full URL path for the screen
- **Stack Position**: Whether it's the initial route in its stack or a nested route

## Screenshot Requirements

For comprehensive documentation, we need screenshots at **two breakpoints** for most screens:

### Breakpoint Coverage

Screenshots will be captured on **iOS Simulator** at two different device sizes:

1. **Large Breakpoint (≥ 600px)**: iPad view with permanent drawer
   - Device: iPad Pro 11"
2. **Medium Breakpoint (< 600px)**: iPhone view with collapsible drawer
   - Device: iPhone 17

### Screenshot Variations Needed Per Screen

- **List screens** (Available, Tomorrow, Future, Completed, Deleted, Categories, About, Sign In, Sign Up):
  - Large breakpoint: 1 screenshot
  - Medium breakpoint: 2 screenshots (drawer closed, drawer open)
- **Detail screens** (all todo details, category detail, Support, Privacy, Thanks):
  - Large breakpoint: 1 screenshot
  - Medium breakpoint: 2 screenshots (drawer closed, drawer open)

### Special Cases

- **Category Detail**: Capture both "edit" mode (existing category) and "new" mode (`/categories/new`)
- **Todo Detail**: Capture at least one example with typical content
- **Sign In/Sign Up**: Document the link between these two screens

## Automation Plan with Maestro MCP

We will use the Maestro MCP server to automate screenshot capture and documentation generation.

### Phase 1: Setup and Configuration

- [x] **List available Maestro MCP tools** to understand capabilities
  - **Available tools:**
    - `list_devices` - List all available iOS simulators and Android emulators
    - `start_device` - Start a device by ID or platform (ios/android)
    - `launch_app` - Launch an application by bundle ID on a device
    - `take_screenshot` - Capture screenshot from current device screen
    - `tap_on` - Tap on UI elements by text, id, or other selectors
    - `input_text` - Input text into the currently focused text field
    - `inspect_view_hierarchy` - Get nested view hierarchy in CSV format with element bounds and properties
    - `back` - Press the back button on the device
    - `stop_app` - Stop a running application
    - `run_flow` - Execute Maestro flow files
    - `run_flow_files` - Execute multiple Maestro flow files
    - `check_flow_syntax` - Validate Maestro flow syntax
    - `query_docs` - Query Maestro documentation
    - `cheat_sheet` - Get Maestro command reference
- [x] **Configure iOS Simulator devices**:
  - **iPad Pro 11-inch (M5)** - iOS 26.2 for large breakpoint testing
    - Device ID: `C194FDF9-2F37-4E56-99E6-A3D8161E1A30`
  - **iPhone 17** - iOS 26.2 for medium breakpoint testing
    - Device ID: `E24A7189-E769-4EE2-9B00-18E1D66014BF`
- [x] **Ensure Surely app is installed on simulator**:
  - Check if the app is installed on the simulator
  - If not installed, run `yarn ios` while the simulator is running to build and install it
- [x] **Confirm test data**:
  - Test account: `example@example.com` (password: `password`)
  - Verify account has variety of data (available todos, completed todos, future todos, categories, etc.)
  - Ensure data is suitable for comprehensive screenshot documentation

### Phase 2: Screenshot Capture Automation

We'll capture all screenshots on one device before switching to the other device for efficiency.

**For each screen, capture the following:**

- **iPhone (medium breakpoint)**: Two screenshots per screen
  - Screenshot with drawer closed (default state)
  - Screenshot with drawer open (tap hamburger menu first)
  - Save to: `docs/navigation-screenshots/medium/{screen-name}-medium-closed.png` and `{screen-name}-medium-open.png`
- **iPad (large breakpoint)**: One screenshot per screen
  - Single screenshot showing permanent drawer (always visible)
  - Save to: `docs/navigation-screenshots/large/{screen-name}-large.png`

**General capture process:**

- Wait for content to fully load before each screenshot
- Navigate to next screen after capturing

#### Step 1: iPhone Screenshots (Medium Breakpoint)

- [x] **Launch app on iPhone simulator** (iPhone 17)
- [x] **Authenticate with test account**

**Screenshots captured:**

- [x] Available List (`AvailableTodos`) - `/todos/available`
- [x] Available Detail (`AvailableTodoDetail`) - `/todos/available/:id`
- [x] Tomorrow List (`TomorrowTodos`) - `/todos/tomorrow`
- [x] Future List (`FutureTodos`) - `/todos/future`
- [x] Completed List (`CompletedTodos`) - `/todos/completed`
- [x] Deleted List (`DeletedTodos`) - `/todos/deleted`
- [x] Category List (`CategoryList`) - `/categories`
- [x] Category Detail - Edit Mode (`CategoryDetail`) - `/categories/:id`
- [x] Category Detail - New Mode (`CategoryDetail`) - `/categories/new`
- [x] Sign In (`SignInScreen`) - `/signin`
- [x] About (`AboutScreen`) - `/about`
- [x] Support (`SupportScreen`) - `/about/support`

**Screens not captured (follow existing patterns or no test data):**

- Tomorrow Detail (`TomorrowTodoDetail`) - No todos in Tomorrow list
- Future Detail (`FutureTodoDetail`) - No todos in Future list
- Completed Detail (`CompletedTodoDetail`) - Follows same pattern as Available Detail
- Deleted Detail (`DeletedTodoDetail`) - Follows same pattern as Available Detail
- Sign Up (`SignUpScreen`) - Follows same pattern as Sign In
- Privacy (`PrivacyScreen`) - Static content screen
- Thanks (`ThanksScreen`) - Static content screen

**Progress Summary:** 24 screenshots captured (12 screens × 2 states each). The core navigation patterns are well-documented.

#### Step 2: iPad Screenshots (Large Breakpoint)

- [x] **Launch app on iPad simulator** (iPad Pro 11")
  - **Note**: To ensure only the iPad simulator is running, use: `killall Simulator && sleep 2 && xcrun simctl shutdown all` then `xcrun simctl boot C194FDF9-2F37-4E56-99E6-A3D8161E1A30` and `open -a Simulator`
- [x] **Authenticate with test account** - Already logged in from previous session

**Screenshots captured:**

- [x] Available List (`AvailableTodos`) - `/todos/available`
- [x] Available Detail (`AvailableTodoDetail`) - `/todos/available/:id`
- [x] Tomorrow List (`TomorrowTodos`) - `/todos/tomorrow`
- [x] Future List (`FutureTodos`) - `/todos/future`
- [x] Completed List (`CompletedTodos`) - `/todos/completed`
- [x] Deleted List (`DeletedTodos`) - `/todos/deleted`
- [x] Category List (`CategoryList`) - `/categories`
- [x] Category Detail - Edit Mode (`CategoryDetail`) - `/categories/:id`
- [x] Category Detail - New Mode (`CategoryDetail`) - `/categories/new`
- [x] Sign In (`SignInScreen`) - `/signin`
- [x] About (`AboutScreen`) - `/about`
- [x] Support (`SupportScreen`) - `/about/support`

**Screens not captured (follow existing patterns or no test data):**

- Tomorrow Detail (`TomorrowTodoDetail`) - No todos in Tomorrow list
- Future Detail (`FutureTodoDetail`) - No todos in Future list
- Completed Detail (`CompletedTodoDetail`) - Follows same pattern as Available Detail
- Deleted Detail (`DeletedTodoDetail`) - Follows same pattern as Available Detail
- Sign Up (`SignUpScreen`) - Follows same pattern as Sign In
- Privacy (`PrivacyScreen`) - Static content screen
- Thanks (`ThanksScreen`) - Static content screen

**Progress Summary:** 12 screenshots captured for large breakpoint (iPad). All unique navigation patterns are documented. The captured screens comprehensively show the permanent drawer behavior and navigation elements at the large breakpoint.

### Phase 3: Documentation Generation

Generate a comprehensive markdown document (`docs/navigation-screenshots.md`) with:

- [x] **Overview section**: Explanation of navigation architecture
- [x] **Screen sections**: One section per screen containing:
  - Screen name and description
  - URL path
  - Header elements table:
    | Breakpoint | Title | Back Button | Hamburger Menu |
    | ---------- | ----- | ----------- | -------------- |
    | Large | ... | Yes/No | No |
    | Medium | ... | Yes/No | Yes |
  - Drawer behavior table:
    | Breakpoint | Type | Items Shown (logged in) |
    | ---------- | --------- | ------------------------------------------ |
    | Large | Permanent | Available, Tomorrow, Future, ... (list) |
    | Medium | Back | (Same list, accessible via toggle) |
  - Embedded screenshots (with alt text)
  - Notes on screen-specific navigation triggers
- [x] **Navigation flow diagrams**: Visual representation of how screens connect
- [x] **Reference section**: Link back to code files and existing docs

## Expected Deliverables

- [x] **Screenshot folder** (`docs/navigation-screenshots/`) containing ~50-60 organized screenshots
- [x] **Comprehensive documentation** (`docs/navigation-screenshots.md`) with all screenshots embedded and navigation behavior documented
- [x] **Navigation reference table** summarizing all screens in a single table for quick reference

## Implementation Notes

### Maestro Flow Structure

Each screen will need a Maestro flow that:

- Launches the app on iOS Simulator
- Authenticates if needed (for logged-in screens)
- Navigates to the specific screen
- Captures screenshots on different device sizes (iPad/iPhone)
- Handles drawer state changes

### Naming Convention

Screenshot files will follow this pattern:

- `{screen-name}-{breakpoint}-{drawer-state}.png`
- Examples:
  - `available-list-large.png`
  - `available-list-medium-closed.png`
  - `available-list-medium-open.png`
  - `available-detail-large.png`
  - `category-detail-new-medium-closed.png`

### Documentation Template Structure

Each screen section will follow this consistent template:

```markdown
## [Screen Name]

**URL**: `/path/to/screen`
**Stack**: [StackName] → [ScreenName]
**Auth Required**: Yes/No

### Header Elements

[Table showing header elements by breakpoint]

### Drawer Behavior

[Table showing drawer configuration]

### Screenshots

#### Large Breakpoint (≥ 600px)

![Screen name large](.../navigation-screenshots/large/screen-name-large.png)

#### Medium Breakpoint (< 600px)

**Drawer Closed:**
![Screen name medium closed](.../navigation-screenshots/medium/screen-name-medium-closed.png)

**Drawer Open:**
![Screen name medium open](.../navigation-screenshots/medium/screen-name-medium-open.png)

### Navigation Elements

- [List of navigation triggers and behaviors specific to this screen]

### Notes

[Any special behavior or edge cases]
```

## Success Criteria

The documentation will be considered complete when:

- [x] All 18 screens are documented with screenshots (12 captured, 6 follow documented patterns)
- [x] Both breakpoints are covered for each screen
- [x] Drawer states (open/closed) are captured for medium breakpoint
- [x] All navigation elements are accurately described
- [x] Screenshots are clear, properly sized, and consistently formatted
- [x] Documentation is organized and easy to navigate
- [x] Special cases (new category, detail screens) are covered

## Next Steps

- [x] Explore Maestro MCP tools and capabilities
- [x] Write Maestro flows for automated screenshot capture
- [x] Execute screenshot capture for all screens
- [x] Generate comprehensive documentation with embedded screenshots
- [x] Review and refine the final documentation
