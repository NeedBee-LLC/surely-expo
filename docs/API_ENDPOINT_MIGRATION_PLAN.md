# Backend API Migration Plan (JSON:API Endpoints Only)

Use this document to track the migration of JSON:API backend routes to a new implementation (away from the current JSON:API library). For detailed information about all endpoints (including the non-JSON:API OAuth endpoint), see [API_ENDPOINTS.md](./API_ENDPOINTS.md).

**Note**: This plan only includes endpoints that use JSON:API format (`application/vnd.api+json`). The OAuth token creation endpoint uses standard JSON format and is excluded from this migration plan.

---

## Migration Process

**CRITICAL**: For each endpoint migration, follow this two-phase approach:

### Phase 1: Expand Test Coverage (Tests Must Pass)
1. Review the existing resource and controller implementation
2. Add comprehensive tests following the Test Coverage Requirements below
3. **Verify all tests pass with the current JSON:API library implementation**
4. This ensures you have complete test coverage before changing the implementation

### Phase 2: Reimplement Without JSON:API Library
1. Update routes from the JSON:API library routing to standard framework routes
2. Reimplement controller to handle JSON:API format directly (without library helpers)
3. **Run tests to verify all existing tests still pass**
4. If needed, maintain minimal JSON:API helpers for relationship handling and nested routes

**Why This Order Matters**: Writing comprehensive tests first ensures that when you reimplement the controller, you can verify that all functionality is preserved. If you change the implementation before having good tests, you risk silently breaking features.

---

## Test Coverage Requirements

For each endpoint, ensure comprehensive test coverage including:

### 1. Basic CRUD Operations
- [ ] Test successful operations for each HTTP method (GET, POST, PATCH)
- [ ] Verify correct HTTP status codes (200, 201, 204, 400, 401, 404)
- [ ] Test both collection and individual resource retrieval where applicable

### 2. Authentication & Authorization
- [ ] Test logged out (401 unauthorized) scenarios for all endpoints
- [ ] Test logged in user can access their own resources
- [ ] Test user cannot access resources belonging to other users (404)
- [ ] Verify empty response body for 401 errors

### 3. JSON:API Format Compliance
- [ ] Assert `Content-Type: application/vnd.api+json` header on all responses
- [ ] Send `Content-Type: application/vnd.api+json` header in request headers
- [ ] Validate response structure has required top-level keys (`data` or `errors`)
- [ ] Validate resource objects have `type`, `id`, and `attributes` keys
- [ ] Validate error objects have `code` and `title` keys
- [ ] Ensure `data` is Array for collections, Hash for single resources
- [ ] Ensure `errors` key is present (not `data`) for error responses

### 4. Complete Attribute Coverage
- [ ] Test reading all resource attributes in GET responses
- [ ] Test creating resources with all writable attributes in POST
- [ ] Test updating all writable attributes in PATCH
- [ ] Verify correct attribute name transformations (snake_case to kebab-case)
- [ ] Verify computed/virtual attributes return correctly
- [ ] Test date/datetime attributes format correctly (ISO 8601)

### 5. Relationship Handling
- [ ] Test creating resources with relationships (category relationship for todos)
- [ ] Test updating relationships
- [ ] Test `include` query parameter returns related resources in `included` array
- [ ] Validate included resources have correct structure (type, id, attributes)
- [ ] Test setting relationship to null (removing relationship)

### 6. Query Parameters & Filtering
- [ ] Test `filter[status]` parameter (available, tomorrow, future, completed, deleted)
- [ ] Test `filter[search]` parameter for text search
- [ ] Test `sort` parameter (ascending and descending with `-` prefix)
- [ ] Test `page[number]` parameter for pagination (completed and deleted lists)
- [ ] Test `include` parameter for relationship inclusion
- [ ] Verify multiple query parameters work together

### 7. Pagination
- [ ] Test paginated responses return correct page of results
- [ ] Test `meta['page-count']` is included in response for paginated endpoints
- [ ] Test requesting different pages returns different results
- [ ] Test requesting page beyond `page-count` returns empty array

### 8. Error Handling & Validation
- [ ] Test invalid JSON syntax returns 400
- [ ] Test missing `data` key returns 400 with JSON:API error structure
- [ ] Test missing `type` in data returns 400 with JSON:API error structure
- [ ] Test wrong `type` in data returns 400 with JSON:API error structure
- [ ] Test ID mismatch (URL vs payload) in PATCH returns 400
- [ ] Verify all validation errors return proper JSON:API error structure
- [ ] Test that operations don't modify data when errors occur

### 9. Business Logic & Side Effects
- [ ] Test soft delete (setting `deleted-at` timestamp) vs hard delete
- [ ] Test completing/uncompleting todos (setting/clearing `completed-at`)
- [ ] Test deferring todos (setting `deferred-until`)
- [ ] Test undeleting clears both `deleted-at` and `completed-at`
- [ ] Test status filtering logic based on attribute states

### 10. Security
- [ ] Verify resources are always associated with the authenticated user on create
- [ ] Test users cannot modify other users' resources
- [ ] Verify user signup allows unauthenticated requests

---

## Users

- [ ] `POST /users` - Create user (sign up)

**Notes:**
- This is a public endpoint (no authentication required)
- The client may send an empty Bearer token when unauthenticated
- **Attributes**: `email` (string), `password` (string)

**Test Coverage**: ⏳ Not started

---

## Todos

### List Todos (with various filters)

- [ ] `GET /todos?filter[status]=available&include=category` - Available todos
- [ ] `GET /todos?filter[status]=tomorrow&include=category` - Tomorrow todos
- [ ] `GET /todos?filter[status]=future&filter[search]={text}&sort=name&include=category` - Future todos with search
- [ ] `GET /todos?filter[status]=completed&filter[search]={text}&sort=-completedAt&page[number]={n}&include=category` - Completed todos with pagination
- [ ] `GET /todos?filter[status]=deleted&filter[search]={text}&sort=-deletedAt&page[number]={n}&include=category` - Deleted todos with pagination

**Notes:**
- **Status values**: `available`, `tomorrow`, `future`, `completed`, `deleted`
- **Attributes**: `name` (string), `notes` (string), `completed-at` (datetime or null), `deleted-at` (datetime or null), `deferred-until` (date string or null)
- **Relationships**: `category` (belongs to category, optional/nullable)
- **Include parameter**: When `include=category` is present:
  - Response must include `included` array at top level (sibling to `data`)
  - Each included category resource has: `type: "categories"`, `id`, `attributes: {name, sort-order}`
  - Todo's `relationships.category.data` contains `{type: "categories", id: "123"}` or `null`
  - Multiple todos can reference the same category (should only appear once in `included`)
- **Pagination**:
  - Used only for `completed` and `deleted` status
  - Response includes `meta['page-count']` with total page count
  - Uses `page[number]` parameter (starts at 1)
- **Search**: Uses `filter[search]` parameter for text search
- **Sort**: Supports `name`, `-completedAt` (descending completed), `-deletedAt` (descending deleted)

**Test Coverage**: ⏳ Not started

### Get Single Todo

- [ ] `GET /todos/{id}?include=category` - Get todo by ID

**Notes:**
- Supports `include=category` parameter (see include notes above)
- Returns 404 if todo doesn't belong to authenticated user

**Test Coverage**: ⏳ Not started

### Create Todo

- [ ] `POST /todos` - Create todo

**Notes:**
- **Required attributes**: `name` (string)
- **Optional attributes**: `deferred-until` (ISO 8601 date string)
- **Optional relationships**: `category` (reference to categories resource)
- **Default values**: `completed-at: null`, `deleted-at: null`
- Used to create both available todos (no `deferred-until`) and tomorrow/future todos (with `deferred-until`)

**Test Coverage**: ⏳ Not started

### Update Todo

- [ ] `PATCH /todos/{id}` - Update todo

**Notes:**
- **Updatable attributes**: `name`, `notes`, `deferred-until`, `completed-at`, `deleted-at`
- **Updatable relationships**: `category` (can be set to null to remove category)
- **Common update patterns**:
  - **Edit form**: Updates `name`, `notes`, `deferred-until`, and `category` relationship
  - **Mark complete**: Sets `completed-at` to current datetime (ISO 8601 string)
  - **Mark incomplete**: Sets `completed-at` to null
  - **Soft delete**: Sets `deleted-at` to current datetime (ISO 8601 string)
  - **Undelete**: Sets both `deleted-at` and `completed-at` to null
  - **Defer**: Sets `deferred-until` to a future date (ISO 8601 date string)
- **No hard delete**: There is no DELETE endpoint; todos are soft-deleted only

**Test Coverage**: ⏳ Not started

---

## Categories

- [ ] `GET /categories` - List all categories
- [ ] `GET /categories/{id}` - Get category by ID
- [ ] `POST /categories` - Create category
- [ ] `PATCH /categories/{id}` - Update category
- [ ] `DELETE /categories/{id}` - Delete category (hard delete)

**Notes:**
- **Attributes**: `name` (string), `sort-order` (number for display ordering)
- **No relationships**: Categories don't have relationships to other resources in responses
- **Client-side sorting**: The client fetches all categories and sorts by `sort-order` attribute
- **Hard delete**: Unlike todos, categories support DELETE (hard delete)
- **No query parameters**: Categories endpoint doesn't use filters, includes, or pagination

**Test Coverage**: ⏳ Not started

---

## Migration Progress Summary

### Total JSON:API Endpoints: 11 endpoint patterns

#### By Resource:
- **Users**: 1 endpoint (Create)
- **Todos**: 7 endpoint patterns (5 filtered list variants, 1 get, 1 create, 1 update)
- **Categories**: 5 endpoints (List, Get, Create, Update, Delete)

#### By HTTP Method:
- **GET**: 7 patterns (5 todo list variants, 1 single todo, 1 categories list, 1 single category)
- **POST**: 2 endpoints (Create User, Create Todo, Create Category)
- **PATCH**: 2 endpoints (Update Todo, Update Category)
- **DELETE**: 1 endpoint (Delete Category)

#### By Completion Status:
- **Completed**: 0
- **In Progress**: 0
- **Not Started**: 11

---

## Excluded Non-JSON:API Endpoints

The following endpoint uses standard JSON format and is excluded from this plan:
- `POST /oauth/token` - OAuth token creation (uses `application/json`)

---

## Special Considerations for This Migration

### 1. Include Parameter Implementation

Unlike simpler JSON:API implementations, this API uses the `include` parameter for todos:

**Query**: `GET /todos?filter[status]=available&include=category`

**Response Structure**:
```json
{
  "data": [
    {
      "type": "todos",
      "id": "1",
      "attributes": {
        "name": "Buy groceries",
        "notes": "",
        "completed-at": null,
        "deleted-at": null,
        "deferred-until": null
      },
      "relationships": {
        "category": {
          "data": {
            "type": "categories",
            "id": "5"
          }
        }
      }
    },
    {
      "type": "todos",
      "id": "2",
      "attributes": {
        "name": "Call dentist",
        "notes": "Schedule cleaning",
        "completed-at": null,
        "deleted-at": null,
        "deferred-until": null
      },
      "relationships": {
        "category": {
          "data": null
        }
      }
    }
  ],
  "included": [
    {
      "type": "categories",
      "id": "5",
      "attributes": {
        "name": "Personal",
        "sort-order": 1
      }
    }
  ]
}
```

**Implementation Notes**:
- When `include=category` is present, fetch related categories and add to `included` array
- `included` is a top-level array (sibling to `data`)
- Each unique category should appear only once in `included`, even if referenced by multiple todos
- Todos without a category have `relationships.category.data: null`
- The `included` array should be omitted or empty when no relationships exist or `include` parameter is absent

**Test Requirements**:
- [ ] Test response with `include=category` includes `included` array
- [ ] Test included categories have correct structure (type, id, attributes)
- [ ] Test multiple todos referencing same category (category appears once)
- [ ] Test todo without category has `relationships.category.data: null`
- [ ] Test response without `include` parameter (no `included` array)

### 2. Soft Delete Pattern

Todos use soft deletion rather than hard deletion:
- **No DELETE endpoint** for todos
- Use `PATCH /todos/{id}` with `{"attributes": {"deleted-at": "{ISO 8601 datetime}"}}` to soft delete
- Soft-deleted todos appear in `filter[status]=deleted` list
- Undelete by setting both `deleted-at` and `completed-at` to null

### 3. Status Filtering Logic

The `filter[status]` parameter doesn't correspond to a database column. The backend must determine status based on attributes:
- **available**: `completed-at` is null, `deleted-at` is null, `deferred-until` is null or past
- **tomorrow**: `deferred-until` is tomorrow's date
- **future**: `deferred-until` is after tomorrow
- **completed**: `completed-at` is not null
- **deleted**: `deleted-at` is not null

### 4. Pagination Metadata

Completed and deleted lists use pagination:
- Response includes `meta` top-level key (sibling to `data`)
- `meta['page-count']` contains total number of pages
- Example: `{"data": [...], "meta": {"page-count": 5}}`

### 5. Date/DateTime Formats

- **Date fields** (`deferred-until`): ISO 8601 date format (e.g., `"2024-01-15"`)
- **DateTime fields** (`completed-at`, `deleted-at`): ISO 8601 datetime format (e.g., `"2024-01-15T14:30:00Z"`)

### 6. Attribute Name Transformation

All attributes use **kebab-case** in JSON:API format:
- Database: `completed_at` → JSON:API: `completed-at`
- Database: `deleted_at` → JSON:API: `deleted-at`
- Database: `deferred_until` → JSON:API: `deferred-until`
- Database: `sort_order` → JSON:API: `sort-order`

---

## Testing Strategy

### Recommended Test Organization

1. **Separate spec files** per resource (`users_spec`, `todos_spec`, `categories_spec`)
2. **Group tests** by endpoint/operation (List, Get, Create, Update, Delete)
3. **Nested contexts** for different scenarios (authenticated, unauthenticated, validation errors)

### Example Test Structure for Todos

```ruby
describe 'Todos API', type: :request do
  describe 'GET /todos' do
    context 'with filter[status]=available' do
      context 'when logged in' do
        it 'returns available todos'
        it 'excludes completed todos'
        it 'excludes deleted todos'
        it 'excludes future-deferred todos'
      end

      context 'with include=category' do
        it 'includes related categories in included array'
        it 'handles todos without categories'
        it 'includes each category only once'
      end
    end

    context 'with filter[status]=completed' do
      it 'returns completed todos sorted by completion date descending'
      it 'supports pagination with page[number]'
      it 'includes page-count in meta'
    end

    # ... other status filters
  end

  describe 'PATCH /todos/:id' do
    it 'updates name attribute'
    it 'updates category relationship'
    it 'marks todo complete'
    it 'marks todo incomplete'
    it 'soft deletes todo'
    it 'undeletes todo'
  end
end
```

---

## Notes for Backend Implementation

1. **JSON:API Format**: All resource endpoints strictly follow JSON:API spec with `application/vnd.api+json` content type
2. **Authentication**: All endpoints require Bearer token except user signup
3. **User Scoping**: All resources must be scoped to authenticated user
4. **No Query Parameters for Categories**: The categories endpoint doesn't support filters, sorting, or pagination
5. **Client-Side Operations**: Some operations happen client-side (e.g., category sorting by `sort-order`)
6. **Search Implementation**: `filter[search]` should search todo names (and possibly notes)
7. **Sort Parameter**: The `-` prefix indicates descending order (`sort=-completedAt`)
