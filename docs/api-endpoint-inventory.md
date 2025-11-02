# API Endpoint Inventory

**Analysis Date**: 2025-11-02
**Source**: Expo app codebase analysis
**JSON:API Version**: 1.1

## JSON:API Conventions Used

The Surely app follows JSON:API v1.1 standards with the following features:

- **Query Parameters**: `filter[...]`, `sort`, `include`, `page[number]`
- **Relationship Loading**: Uses `include` parameter to load related resources (e.g., categories)
- **Pagination**: Page number-based (`page[number]`)
- **Filtering**: Custom status filters and search functionality
- **Sorting**: Standard JSON:API sort syntax with ascending/descending (`-` prefix)
- **Content-Type**: `application/vnd.api+json` (set by jsonapi-client)

---

## Todos Resource

### GET /todos (via .where())

**HTTP Method**: GET
**Endpoint**: `/todos?filter[status]=...&filter[search]=...&sort=...&include=...&page[number]=...`

**Usage Locations**:

- `TodoList/Available.js` (line 12-17)
- `TodoList/Tomorrow.js` (line 17-22)
- `TodoList/Future.js` (line 13-23)
- `TodoList/Completed.js` (line 13-27)
- `TodoList/Deleted.js` (line 13-25)

**Query Parameters**:

| Parameter        | Type    | Required    | Values                                                    | Usage                                                        |
| ---------------- | ------- | ----------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| `filter[status]` | string  | Yes         | `available`, `tomorrow`, `future`, `completed`, `deleted` | Filters todos by status                                      |
| `filter[search]` | string  | No          | any text                                                  | Full-text search (used in Future, Completed, Deleted)        |
| `include`        | string  | Conditional | `category`                                                | Includes related category data (used in Available, Tomorrow) |
| `sort`           | string  | Conditional | `name`, `-completedAt`, `-deletedAt`                      | Sorts results                                                |
| `page[number]`   | integer | Conditional | 1+                                                        | Page number for pagination (used in Completed, Deleted)      |

**Triggered By**:

- Screen load/focus
- Pull-to-refresh
- Search text changes
- Page navigation

**Response Format** (JSON:API):

```json
{
  "data": [
    {
      "type": "todos",
      "id": "uuid",
      "attributes": {
        "name": "string",
        "notes": "string",
        "deferred-until": "date",
        "completed-at": "datetime | null",
        "deleted-at": "datetime | null"
      },
      "relationships": {
        "category": {
          "data": {
            "type": "categories",
            "id": "uuid"
          }
        }
      }
    }
  ],
  "included": [
    {
      "type": "categories",
      "id": "uuid",
      "attributes": {
        "name": "string",
        "sort-order": "integer"
      }
    }
  ],
  "meta": {
    "page-count": "integer"
  }
}
```

**Response Handling**:

- `todoResponse.data` - Array of todo objects
- `todoResponse.included` - Array of related category objects (when `include=category`)
- `todoResponse.meta['page-count']` - Total page count for pagination

---

### GET /todos/:id (via .find())

**HTTP Method**: GET
**Endpoint**: `/todos/:id?include=category`

**Usage Locations**:

- `TodoDetail/index.js` (line 40-43)

**Query Parameters**:

| Parameter | Type   | Required | Values     | Usage                          |
| --------- | ------ | -------- | ---------- | ------------------------------ |
| `include` | string | Yes      | `category` | Includes related category data |

**Triggered By**:

- Navigating to todo detail screen
- Retry button after error

**Request Example**:

```
GET /todos/abc-123-def?include=category
```

**Response Format** (JSON:API):

```json
{
  "data": {
    "type": "todos",
    "id": "uuid",
    "attributes": {
      "name": "string",
      "notes": "string",
      "deferred-until": "date | null",
      "completed-at": "datetime | null",
      "deleted-at": "datetime | null"
    },
    "relationships": {
      "category": {
        "data": {
          "type": "categories",
          "id": "uuid"
        } | null
      }
    }
  },
  "included": [
    {
      "type": "categories",
      "id": "uuid",
      "attributes": {
        "name": "string",
        "sort-order": "integer"
      }
    }
  ]
}
```

**Response Handling**:

- `response.data` - The todo object
- `response.included[0]` - The related category object (if exists)

---

### POST /todos (via .create())

**HTTP Method**: POST
**Endpoint**: `/todos`
**Content-Type**: `application/vnd.api+json`

**Usage Locations**:

- `TodoList/Available.js` (line 21)
- `TodoList/Tomorrow.js` (line 26-28)

**Triggered By**:

- Creating a new todo from the "Available" list
- Creating a new todo from the "Tomorrow" list

**Request Body** (JSON:API format):

**Available Todo**:

```json
{
  "data": {
    "type": "todos",
    "attributes": {
      "name": "string"
    }
  }
}
```

**Tomorrow Todo**:

```json
{
  "data": {
    "type": "todos",
    "attributes": {
      "name": "string",
      "deferred-until": "date (tomorrow)"
    }
  }
}
```

**Attributes Sent**:

| Attribute        | Type   | Required    | Used In  | Description                 |
| ---------------- | ------ | ----------- | -------- | --------------------------- |
| `name`           | string | Yes         | All      | The todo name/title         |
| `deferred-until` | date   | Conditional | Tomorrow | ISO date for deferred todos |

**Response**: Created todo object in JSON:API format (same structure as GET response)

---

### PATCH /todos/:id (via .update())

**HTTP Method**: PATCH
**Endpoint**: `/todos/:id?include=category`
**Content-Type**: `application/vnd.api+json`

**Usage Locations**:

- `TodoDetail/index.js` (line 59-65) - Full edit from form
- `TodoDetail/DetailDisplay/Actions/Default.js` (line 19) - Status updates
- `TodoDetail/DetailDisplay/Actions/Defer.js` (line 22) - Defer updates

**Triggered By**:

- Saving todo edits (name, notes, category, deferred-until)
- Completing a todo
- Uncompleting a todo
- Deleting a todo (soft delete)
- Undeleting a todo
- Deferring a todo

**Query Parameters** (when used from DetailForm):

| Parameter | Type   | Required    | Values     | Usage                                          |
| --------- | ------ | ----------- | ---------- | ---------------------------------------------- |
| `include` | string | Conditional | `category` | Includes category in response (from form save) |

**Request Body Examples**:

**Full Update (from form)**:

```json
{
  "data": {
    "type": "todos",
    "id": "uuid",
    "attributes": {
      "name": "string",
      "notes": "string",
      "deferred-until": "date | null"
    },
    "relationships": {
      "category": {
        "data": {
          "type": "categories",
          "id": "uuid"
        } | null
      }
    }
  }
}
```

**Complete Todo**:

```json
{
  "data": {
    "type": "todos",
    "id": "uuid",
    "attributes": {
      "completed-at": "datetime (now)"
    }
  }
}
```

**Uncomplete Todo**:

```json
{
  "data": {
    "type": "todos",
    "id": "uuid",
    "attributes": {
      "completed-at": null
    }
  }
}
```

**Delete Todo (soft delete)**:

```json
{
  "data": {
    "type": "todos",
    "id": "uuid",
    "attributes": {
      "deleted-at": "datetime (now)"
    }
  }
}
```

**Undelete Todo**:

```json
{
  "data": {
    "type": "todos",
    "id": "uuid",
    "attributes": {
      "deleted-at": null,
      "completed-at": null
    }
  }
}
```

**Defer Todo**:

```json
{
  "data": {
    "type": "todos",
    "id": "uuid",
    "attributes": {
      "deferred-until": "date"
    }
  }
}
```

**Attributes Updated**:

| Attribute        | Type          | Usage                       | Description           |
| ---------------- | ------------- | --------------------------- | --------------------- |
| `name`           | string        | Form edit                   | Todo name/title       |
| `notes`          | string        | Form edit                   | Todo notes            |
| `deferred-until` | date/null     | Form edit, Defer actions    | When to defer until   |
| `completed-at`   | datetime/null | Complete/Uncomplete buttons | Completion timestamp  |
| `deleted-at`     | datetime/null | Delete/Undelete buttons     | Soft delete timestamp |

**Relationships Updated**:

| Relationship | Type       | Usage     | Description                       |
| ------------ | ---------- | --------- | --------------------------------- |
| `category`   | Belongs-to | Form edit | Associated category (can be null) |

**Response**: Updated todo object in JSON:API format (with included category when `include=category`)

---

## Categories Resource

### GET /categories (via .all())

**HTTP Method**: GET
**Endpoint**: `/categories`

**Usage Locations**:

- `TodoDetail/DetailForm.js` (line 26) - Load all categories for dropdown
- `CategoryList.js` (line 37) - Load all categories for list view

**Query Parameters**: None (no filtering, sorting, or pagination used)

**Triggered By**:

- Opening todo detail edit form
- Navigating to categories screen
- Pull-to-refresh on categories screen
- Reload button (web only)

**Response Format** (JSON:API):

```json
{
  "data": [
    {
      "type": "categories",
      "id": "uuid",
      "attributes": {
        "name": "string",
        "sort-order": "integer"
      }
    }
  ]
}
```

**Response Handling**:

- `response.data` - Array of category objects
- Client-side sorting by `attributes.sort-order` (using lodash `sortBy`)

---

### GET /categories/:id (via .find())

**HTTP Method**: GET
**Endpoint**: `/categories/:id`

**Usage Locations**:

- `CategoryDetail.js` (line 35-43)

**Query Parameters**: None

**Triggered By**:

- Navigating to category detail screen (for existing category, not 'new')

**Request Example**:

```
GET /categories/abc-123-def
```

**Response Format** (JSON:API):

```json
{
  "data": {
    "type": "categories",
    "id": "uuid",
    "attributes": {
      "name": "string",
      "sort-order": "integer"
    }
  }
}
```

**Response Handling**:

- `response.data` - The category object
- Attributes extracted to populate form fields

---

### POST /categories (via .create())

**HTTP Method**: POST
**Endpoint**: `/categories`
**Content-Type**: `application/vnd.api+json`

**Usage Locations**:

- `CategoryDetail.js` (line 56)

**Triggered By**:

- Saving a new category (when id === 'new')

**Request Body** (JSON:API format):

```json
{
  "data": {
    "type": "categories",
    "attributes": {
      "name": "string"
    }
  }
}
```

**Attributes Sent**:

| Attribute | Type   | Required | Description       |
| --------- | ------ | -------- | ----------------- |
| `name`    | string | Yes      | The category name |

**Response**: Created category object in JSON:API format

---

### PATCH /categories/:id (via .update())

**HTTP Method**: PATCH
**Endpoint**: `/categories/:id`
**Content-Type**: `application/vnd.api+json`

**Usage Locations**:

- `CategoryDetail.js` (line 58) - Update category name
- `CategoryList.js` (line 99-102) - Update sort order

**Triggered By**:

- Saving category edits (name)
- Moving category up/down in the list (sort order)

**Request Body Examples**:

**Update Name**:

```json
{
  "data": {
    "type": "categories",
    "id": "uuid",
    "attributes": {
      "name": "string"
    }
  }
}
```

**Update Sort Order**:

```json
{
  "data": {
    "type": "categories",
    "id": "uuid",
    "attributes": {
      "sort-order": "integer"
    }
  }
}
```

**Attributes Updated**:

| Attribute    | Type    | Usage                      | Description   |
| ------------ | ------- | -------------------------- | ------------- |
| `name`       | string  | Detail screen              | Category name |
| `sort-order` | integer | List screen (move up/down) | Display order |

**Response**: Updated category object in JSON:API format

---

### DELETE /categories/:id (via .delete())

**HTTP Method**: DELETE
**Endpoint**: `/categories/:id`

**Usage Locations**:

- `CategoryDetail.js` (line 72)

**Triggered By**:

- Delete button on category detail screen

**Request**: No body (just the ID in URL)

**Response**: Typically 204 No Content or 200 OK with deleted resource

---

## Users Resource

### POST /users (via .create())

**HTTP Method**: POST
**Endpoint**: `/users`
**Content-Type**: `application/vnd.api+json`

**Usage Locations**:

- `Login/SignUpForm.js` (line 54)

**Triggered By**:

- User sign-up form submission

**Request Body** (JSON:API format):

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "email": "string",
      "password": "string"
    }
  }
}
```

**Attributes Sent**:

| Attribute  | Type   | Required | Description                                      |
| ---------- | ------ | -------- | ------------------------------------------------ |
| `email`    | string | Yes      | User email address                               |
| `password` | string | Yes      | User password (plain text, encrypted in transit) |

**Response**: Created user object in JSON:API format

**Error Handling**:

- Extracts error detail from `errorResponse.data.errors[0].detail`
- Falls back to `errorResponse.message` or generic error

---

## OAuth Authentication (Non-JSON:API)

### POST /oauth/token

**HTTP Method**: POST
**Endpoint**: `/oauth/token`
**Content-Type**: `application/x-www-form-urlencoded` (standard OAuth)

**Usage Locations**:

- `auth/oauthLogin.js` (line 6-12)
- `Login/SignInForm.js` (line 18-23)

**Triggered By**:

- User sign-in form submission

**Request Body** (OAuth format, NOT JSON:API):

```json
{
  "grant_type": "password",
  "username": "string (email)",
  "password": "string"
}
```

**Response** (OAuth format, NOT JSON:API):

```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": integer,
  "created_at": integer
}
```

**Response Handling**:

- Extracts `response.data.access_token`
- Stores token in secure storage for authenticated requests

**Error Handling**:

- Extracts error from `error.response.data.error_description`
- Falls back to generic error message

**Note**: This endpoint uses OAuth 2.0 Resource Owner Password Credentials flow and does NOT follow JSON:API conventions. It's handled by Doorkeeper gem on the backend.

---

## Summary Statistics

### Endpoints by Resource

| Resource   | GET   | POST  | PATCH | DELETE | Total  |
| ---------- | ----- | ----- | ----- | ------ | ------ |
| Todos      | 2     | 1     | 1     | 0      | 4      |
| Categories | 2     | 1     | 1     | 1      | 5      |
| Users      | 0     | 1     | 0     | 0      | 1      |
| OAuth      | 1     | 0     | 0     | 0      | 1      |
| **Total**  | **5** | **3** | **2** | **1**  | **11** |

### Query Parameters Usage

| Parameter        | Usage Count | Resources | Purpose                                                            |
| ---------------- | ----------- | --------- | ------------------------------------------------------------------ |
| `filter[status]` | 5           | Todos     | Status filtering (available, tomorrow, future, completed, deleted) |
| `filter[search]` | 3           | Todos     | Full-text search                                                   |
| `include`        | 3           | Todos     | Include related category                                           |
| `sort`           | 3           | Todos     | Sorting results                                                    |
| `page[number]`   | 2           | Todos     | Pagination                                                         |

### Attributes Used

**Todos** (6 attributes):

- `name` (string) - Required
- `notes` (string) - Optional
- `deferred-until` (date) - Optional
- `completed-at` (datetime) - Optional
- `deleted-at` (datetime) - Optional

**Categories** (2 attributes):

- `name` (string) - Required
- `sort-order` (integer) - Optional

**Users** (2 attributes):

- `email` (string) - Required
- `password` (string) - Required (create only)

### Relationships Used

**Todos**:

- `category` (belongs-to Categories) - Optional

**Categories**:

- None

**Users**:

- None

---

## Implementation Notes

### JSON:API Compliance

✅ **Fully Compliant**:

- Document structure (data, included, meta)
- Resource object format (type, id, attributes, relationships)
- Content-Type header (`application/vnd.api+json`)
- Standard query parameters (filter, sort, include, page)
- PATCH for updates (not PUT)

📝 **Implementation-Specific**:

- Filter syntax: `filter[status]`, `filter[search]`
- Pagination: `page[number]` (number-based, not offset/limit)
- Sort fields: Specific to resource attributes

### HTTP Client Configuration

All JSON:API requests use:

- **Base URL**: Configured via `/expo/src/baseUrl.js`
  - Dev (iOS): `http://localhost:3000`
  - Dev (Android): `http://10.0.2.2:3000`
  - Prod: `https://api.surelytodo.com`
- **Authentication**: Bearer token in `Authorization` header
- **Library**: `@codingitwrong/jsonapi-client` wrapping axios

OAuth requests use:

- Same base URL
- No authentication header
- Direct axios (not jsonapi-client)

### Error Handling Patterns

All requests implement error handling:

1. Try/catch blocks around API calls
2. Loading states during requests
3. Error message display to user
4. Logging via `logError()` utility
5. Retry mechanisms where appropriate

### Data Transformation

**Client-side processing**:

- Grouping todos by category (`groupByCategory`)
- Grouping todos by date (`groupByDate`)
- Sorting categories by `sort-order`
- Date calculations for deferral
