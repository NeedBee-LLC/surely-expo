# API Usage Matrix

Cross-reference showing which screens use which API endpoints and methods.

**Analysis Date**: 2025-11-02

---

## Todo Screens

| Screen File                                   | Resource   | Methods Used          | Endpoints                        | Purpose                                                    |
| --------------------------------------------- | ---------- | --------------------- | -------------------------------- | ---------------------------------------------------------- |
| `TodoList/Available.js`                       | todos      | `where()`, `create()` | GET /todos, POST /todos          | Load and create available todos with category includes     |
| `TodoList/Tomorrow.js`                        | todos      | `where()`, `create()` | GET /todos, POST /todos          | Load and create tomorrow's todos with deferred-until dates |
| `TodoList/Future.js`                          | todos      | `where()`             | GET /todos                       | Load future todos with search and sorting by name          |
| `TodoList/Completed.js`                       | todos      | `where()`             | GET /todos                       | Load completed todos with search, sorting, and pagination  |
| `TodoList/Deleted.js`                         | todos      | `where()`             | GET /todos                       | Load deleted todos with search, sorting, and pagination    |
| `TodoDetail/index.js`                         | todos      | `find()`, `update()`  | GET /todos/:id, PATCH /todos/:id | Load single todo with category, save edits                 |
| `TodoDetail/DetailForm.js`                    | categories | `all()`               | GET /categories                  | Load all categories for dropdown selection                 |
| `TodoDetail/DetailDisplay/Actions/Default.js` | todos      | `update()`            | PATCH /todos/:id                 | Complete, uncomplete, delete, undelete todos               |
| `TodoDetail/DetailDisplay/Actions/Defer.js`   | todos      | `update()`            | PATCH /todos/:id                 | Defer todos to future dates                                |

---

## Category Screens

| Screen File         | Resource   | Methods Used                                 | Endpoints                                                                            | Purpose                                   |
| ------------------- | ---------- | -------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- |
| `CategoryList.js`   | categories | `all()`, `update()`                          | GET /categories, PATCH /categories/:id                                               | List categories and update sort order     |
| `CategoryDetail.js` | categories | `find()`, `create()`, `update()`, `delete()` | GET /categories/:id, POST /categories, PATCH /categories/:id, DELETE /categories/:id | View, create, edit, and delete categories |

---

## User/Auth Screens

| Screen File           | Resource | Methods Used | Endpoints         | Purpose                                |
| --------------------- | -------- | ------------ | ----------------- | -------------------------------------- |
| `Login/SignUpForm.js` | users    | `create()`   | POST /users       | Create new user account                |
| `Login/SignInForm.js` | oauth    | Direct POST  | POST /oauth/token | Authenticate user and get access token |

---

## API Method Usage by Screen

### Todos Resource

#### `.where()` - Fetch filtered todos

- ✅ Available.js (filter: status=available, include: category)
- ✅ Tomorrow.js (filter: status=tomorrow, include: category)
- ✅ Future.js (filter: status=future + search, sort: name)
- ✅ Completed.js (filter: status=completed + search, sort: -completedAt, page)
- ✅ Deleted.js (filter: status=deleted + search, sort: -deletedAt, page)

#### `.find()` - Fetch single todo

- ✅ TodoDetail/index.js (include: category)

#### `.create()` - Create new todo

- ✅ Available.js (attributes: name)
- ✅ Tomorrow.js (attributes: name, deferred-until)

#### `.update()` - Update existing todo

- ✅ TodoDetail/index.js (full edit: name, notes, deferred-until, category)
- ✅ DetailDisplay/Actions/Default.js (status changes: completed-at, deleted-at)
- ✅ DetailDisplay/Actions/Defer.js (defer: deferred-until)

---

### Categories Resource

#### `.all()` - Fetch all categories

- ✅ DetailForm.js (for dropdown in todo editor)
- ✅ CategoryList.js (for category list screen)

#### `.find()` - Fetch single category

- ✅ CategoryDetail.js (when editing existing category)

#### `.create()` - Create new category

- ✅ CategoryDetail.js (when id === 'new')

#### `.update()` - Update existing category

- ✅ CategoryDetail.js (update name)
- ✅ CategoryList.js (update sort-order for drag/drop)

#### `.delete()` - Delete category

- ✅ CategoryDetail.js (delete button)

---

### Users Resource

#### `.create()` - Create new user

- ✅ SignUpForm.js (sign up with email/password)

---

## Feature-Based API Usage

### Todo List Views (Read-Only Display)

| Feature         | Files        | API Calls       | Parameters                                                                        |
| --------------- | ------------ | --------------- | --------------------------------------------------------------------------------- |
| Available Todos | Available.js | `todos.where()` | filter[status]=available, include=category                                        |
| Tomorrow Todos  | Tomorrow.js  | `todos.where()` | filter[status]=tomorrow, include=category                                         |
| Future Todos    | Future.js    | `todos.where()` | filter[status]=future, filter[search]=..., sort=name                              |
| Completed Todos | Completed.js | `todos.where()` | filter[status]=completed, filter[search]=..., sort=-completedAt, page[number]=... |
| Deleted Todos   | Deleted.js   | `todos.where()` | filter[status]=deleted, filter[search]=..., sort=-deletedAt, page[number]=...     |

### Todo Creation

| Feature               | Files        | API Calls        | Attributes           |
| --------------------- | ------------ | ---------------- | -------------------- |
| Quick Add (Available) | Available.js | `todos.create()` | name                 |
| Quick Add (Tomorrow)  | Tomorrow.js  | `todos.create()` | name, deferred-until |

### Todo Detail & Editing

| Feature             | Files                   | API Calls        | Data                                               |
| ------------------- | ----------------------- | ---------------- | -------------------------------------------------- |
| Load Todo           | index.js                | `todos.find()`   | include=category                                   |
| Edit Todo           | index.js, DetailForm.js | `todos.update()` | name, notes, deferred-until, category relationship |
| Complete/Uncomplete | Actions/Default.js      | `todos.update()` | completed-at (datetime or null)                    |
| Delete/Undelete     | Actions/Default.js      | `todos.update()` | deleted-at (datetime or null), completed-at=null   |
| Defer Todo          | Actions/Defer.js        | `todos.update()` | deferred-until (date)                              |

### Category Management

| Feature            | Files             | API Calls             | Data       |
| ------------------ | ----------------- | --------------------- | ---------- |
| List Categories    | CategoryList.js   | `categories.all()`    | -          |
| Load Category      | CategoryDetail.js | `categories.find()`   | -          |
| Create Category    | CategoryDetail.js | `categories.create()` | name       |
| Edit Category Name | CategoryDetail.js | `categories.update()` | name       |
| Reorder Categories | CategoryList.js   | `categories.update()` | sort-order |
| Delete Category    | CategoryDetail.js | `categories.delete()` | -          |
| Category Dropdown  | DetailForm.js     | `categories.all()`    | -          |

### User Management

| Feature | Files         | API Calls           | Data                           |
| ------- | ------------- | ------------------- | ------------------------------ |
| Sign Up | SignUpForm.js | `users.create()`    | email, password                |
| Sign In | SignInForm.js | `POST /oauth/token` | username, password, grant_type |

---

## Query Parameter Usage Patterns

### Filtering

| Filter           | Usage Count | Screens                    | Values                                          |
| ---------------- | ----------- | -------------------------- | ----------------------------------------------- |
| `filter[status]` | 5           | All todo list screens      | available, tomorrow, future, completed, deleted |
| `filter[search]` | 3           | Future, Completed, Deleted | User search text                                |

### Including Related Resources

| Include            | Usage Count | Screens                         | Purpose                  |
| ------------------ | ----------- | ------------------------------- | ------------------------ |
| `include=category` | 3           | Available, Tomorrow, TodoDetail | Load category with todos |

### Sorting

| Sort                | Usage Count | Screens   | Description            |
| ------------------- | ----------- | --------- | ---------------------- |
| `sort=name`         | 1           | Future    | Alphabetical by name   |
| `sort=-completedAt` | 1           | Completed | Newest completed first |
| `sort=-deletedAt`   | 1           | Deleted   | Newest deleted first   |

### Pagination

| Param          | Usage Count | Screens            | Style                   |
| -------------- | ----------- | ------------------ | ----------------------- |
| `page[number]` | 2           | Completed, Deleted | Number-based pagination |

**Note**: Pagination uses `meta['page-count']` from response for total pages.

---

## Data Flow Patterns

### List → Detail Flow

1. **List Screen** calls `.where()` to get filtered todos
2. User taps todo → navigates with todo ID
3. **Detail Screen** calls `.find()` with ID to get full data + includes
4. User makes changes → calls `.update()`
5. Success → navigates back to list
6. List reloads automatically via focus effect

### Create Flow

1. User types in quick-add field
2. **List Screen** calls `.create()` with just the name
3. New todo appears in filtered list (status implicit from screen)
4. User can tap to edit details

### Category Selection Flow

1. **DetailForm** loads via `.all()` when form mounts
2. Categories sorted client-side by `sort-order`
3. User selects from dropdown
4. Selected category sent as relationship in `.update()`

### Search Flow

1. User types in search field
2. **List Screen** calls `.where()` with `filter[search]`
3. Backend filters results
4. Results grouped/sorted client-side

---

## Network Request Frequency

### On App Launch

- None immediately (token loaded from storage)

### On Screen Focus

| Screen         | Requests | Frequency                                   |
| -------------- | -------- | ------------------------------------------- |
| Available      | 1        | Every focus (useFocusEffect)                |
| Tomorrow       | 1        | Every focus                                 |
| Future         | 1        | Every focus + search changes                |
| Completed      | 1        | Every focus + page changes + search changes |
| Deleted        | 1        | Every focus + page changes + search changes |
| TodoDetail     | 1        | On mount                                    |
| CategoryList   | 1        | Every focus                                 |
| CategoryDetail | 1        | On mount (if existing)                      |

### On User Actions

| Action                | Requests | Type                       |
| --------------------- | -------- | -------------------------- |
| Quick add todo        | 1        | POST                       |
| Edit todo             | 1        | PATCH                      |
| Complete/delete/defer | 1        | PATCH                      |
| Save category         | 1        | POST or PATCH              |
| Reorder category      | N        | PATCH (one per moved item) |
| Delete category       | 1        | DELETE                     |
| Sign up               | 1        | POST                       |
| Sign in               | 1        | POST (OAuth)               |

### Pull-to-Refresh

All list screens support pull-to-refresh, triggering the same `.where()` or `.all()` call.

---

## Caching Strategy

**No explicit caching layer** - The app uses React's built-in state management:

- **List screens**: Refetch on every focus (ensures fresh data)
- **Detail screen**: Loads once on mount, updates on save
- **Categories**: React Query caching in DetailForm (queryKey: 'categories')
- **No offline support**: All data fetched from API

**React Query Usage**:

- Only used in `DetailForm.js` for categories dropdown
- Other screens use useEffect/useFocusEffect with local state

---

## Error Handling Coverage

All API calls include:

- ✅ Try/catch blocks
- ✅ Error state management
- ✅ User-facing error messages
- ✅ Error logging via `logError()`
- ✅ Loading states
- ✅ Retry mechanisms (TodoDetail only)

---

## Performance Considerations

### Optimization Opportunities

1. **Multiple category updates** (CategoryList.js lines 97-104)

   - Currently: Sequential PATCH requests when reordering
   - Opportunity: Batch update API or single request with array

2. **Category loading** (loaded in 2 places)

   - DetailForm loads on every todo edit
   - CategoryList loads on every screen focus
   - Opportunity: Shared cache or context

3. **List refetching**

   - Lists refetch on every focus
   - Opportunity: Smart invalidation only when data changes

4. **No request deduplication**
   - Multiple simultaneous navigations could trigger duplicate requests
   - Opportunity: Request caching layer

### Current Strengths

1. ✅ Efficient filtering on backend (not loading all then filtering)
2. ✅ Pagination for large lists (Completed, Deleted)
3. ✅ Includes used appropriately (only when needed)
4. ✅ Minimal attributes in list views (no over-fetching)
