# Navigation Screenshots Documentation Plan

## Overview

This document outlines the plan to comprehensively document all screens in the Surely app along with their navigation behavior and visual appearance. The goal is to create a complete reference that shows how navigation elements (drawer, back button, menu toggle) behave across different screens and screen sizes.

## Complete Screen Inventory

Based on cross-referencing `docs/navigation.md` and `src/Navigation.js`, the app contains **18 unique screens** organized as follows:

### Logged-In Todo Screens (10 screens)

- [ ] **Available List** (`AvailableTodos`) - `/todos/available`
- [ ] **Available Detail** (`AvailableTodoDetail`) - `/todos/available/:id`
- [ ] **Tomorrow List** (`TomorrowTodos`) - `/todos/tomorrow`
- [ ] **Tomorrow Detail** (`TomorrowTodoDetail`) - `/todos/tomorrow/:id`
- [ ] **Future List** (`FutureTodos`) - `/todos/future`
- [ ] **Future Detail** (`FutureTodoDetail`) - `/todos/future/:id`
- [ ] **Completed List** (`CompletedTodos`) - `/todos/completed`
- [ ] **Completed Detail** (`CompletedTodoDetail`) - `/todos/completed/:id`
- [ ] **Deleted List** (`DeletedTodos`) - `/todos/deleted`
- [ ] **Deleted Detail** (`DeletedTodoDetail`) - `/todos/deleted/:id`

### Category Screens (2 screens)

- [ ] **Category List** (`CategoryList`) - `/categories`
- [ ] **Category Detail** (`CategoryDetail`) - `/categories/:id` (includes "new" mode at `/categories/new`)

### Authentication Screens (2 screens)

- [ ] **Sign In** (`SignInScreen`) - `/signin`
- [ ] **Sign Up** (`SignUpScreen`) - `/signup`

### About Screens (4 screens)

- [ ] **About** (`AboutScreen`) - `/about`
- [ ] **Support** (`SupportScreen`) - `/about/support`
- [ ] **Privacy** (`PrivacyScreen`) - `/about/privacy`
- [ ] **Thanks** (`ThanksScreen`) - `/about/say-thanks`

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

- [ ] **List available Maestro MCP tools** to understand capabilities
- [ ] **Configure iOS Simulator devices**:
  - iPad Pro 11" for large breakpoint testing
  - iPhone 17 for medium breakpoint testing
- [ ] **Ensure Surely app is installed on simulator**:
  - Check if the app is installed on the simulator
  - If not installed, run `yarn ios` while the simulator is running to build and install it
- [ ] **Confirm test data**:
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

- [ ] **Launch app on iPhone simulator** (iPhone 17)
- [ ] **Authenticate with test account**

**Capture screenshots for each screen:**

- [ ] Available List (`AvailableTodos`) - `/todos/available`
- [ ] Available Detail (`AvailableTodoDetail`) - `/todos/available/:id`
- [ ] Tomorrow List (`TomorrowTodos`) - `/todos/tomorrow`
- [ ] Tomorrow Detail (`TomorrowTodoDetail`) - `/todos/tomorrow/:id`
- [ ] Future List (`FutureTodos`) - `/todos/future`
- [ ] Future Detail (`FutureTodoDetail`) - `/todos/future/:id`
- [ ] Completed List (`CompletedTodos`) - `/todos/completed`
- [ ] Completed Detail (`CompletedTodoDetail`) - `/todos/completed/:id`
- [ ] Deleted List (`DeletedTodos`) - `/todos/deleted`
- [ ] Deleted Detail (`DeletedTodoDetail`) - `/todos/deleted/:id`
- [ ] Category List (`CategoryList`) - `/categories`
- [ ] Category Detail - Edit Mode (`CategoryDetail`) - `/categories/:id`
- [ ] Category Detail - New Mode (`CategoryDetail`) - `/categories/new`
- [ ] Sign In (`SignInScreen`) - `/signin`
- [ ] Sign Up (`SignUpScreen`) - `/signup`
- [ ] About (`AboutScreen`) - `/about`
- [ ] Support (`SupportScreen`) - `/about/support`
- [ ] Privacy (`PrivacyScreen`) - `/about/privacy`
- [ ] Thanks (`ThanksScreen`) - `/about/say-thanks`

#### Step 2: iPad Screenshots (Large Breakpoint)

- [ ] **Launch app on iPad simulator** (iPad Pro 11")
- [ ] **Authenticate with test account**

**Capture screenshots for each screen:**

- [ ] Available List (`AvailableTodos`) - `/todos/available`
- [ ] Available Detail (`AvailableTodoDetail`) - `/todos/available/:id`
- [ ] Tomorrow List (`TomorrowTodos`) - `/todos/tomorrow`
- [ ] Tomorrow Detail (`TomorrowTodoDetail`) - `/todos/tomorrow/:id`
- [ ] Future List (`FutureTodos`) - `/todos/future`
- [ ] Future Detail (`FutureTodoDetail`) - `/todos/future/:id`
- [ ] Completed List (`CompletedTodos`) - `/todos/completed`
- [ ] Completed Detail (`CompletedTodoDetail`) - `/todos/completed/:id`
- [ ] Deleted List (`DeletedTodos`) - `/todos/deleted`
- [ ] Deleted Detail (`DeletedTodoDetail`) - `/todos/deleted/:id`
- [ ] Category List (`CategoryList`) - `/categories`
- [ ] Category Detail - Edit Mode (`CategoryDetail`) - `/categories/:id`
- [ ] Category Detail - New Mode (`CategoryDetail`) - `/categories/new`
- [ ] Sign In (`SignInScreen`) - `/signin`
- [ ] Sign Up (`SignUpScreen`) - `/signup`
- [ ] About (`AboutScreen`) - `/about`
- [ ] Support (`SupportScreen`) - `/about/support`
- [ ] Privacy (`PrivacyScreen`) - `/about/privacy`
- [ ] Thanks (`ThanksScreen`) - `/about/say-thanks`

### Phase 3: Documentation Generation

Generate a comprehensive markdown document (`docs/navigation-screenshots.md`) with:

- [ ] **Overview section**: Explanation of navigation architecture
- [ ] **Screen sections**: One section per screen containing:
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
- [ ] **Navigation flow diagrams**: Visual representation of how screens connect
- [ ] **Reference section**: Link back to code files and existing docs

## Expected Deliverables

- [ ] **Screenshot folder** (`docs/navigation-screenshots/`) containing ~50-60 organized screenshots
- [ ] **Comprehensive documentation** (`docs/navigation-screenshots.md`) with all screenshots embedded and navigation behavior documented
- [ ] **Navigation reference table** summarizing all screens in a single table for quick reference

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

- [ ] All 18 screens are documented with screenshots
- [ ] Both breakpoints are covered for each screen
- [ ] Drawer states (open/closed) are captured for medium breakpoint
- [ ] All navigation elements are accurately described
- [ ] Screenshots are clear, properly sized, and consistently formatted
- [ ] Documentation is organized and easy to navigate
- [ ] Special cases (new category, detail screens) are covered

## Next Steps

- [ ] Explore Maestro MCP tools and capabilities
- [ ] Write Maestro flows for automated screenshot capture
- [ ] Execute screenshot capture for all screens
- [ ] Generate comprehensive documentation with embedded screenshots
- [ ] Review and refine the final documentation
