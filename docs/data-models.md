# Data Models Documentation

Complete documentation of JSON:API data structures for each resource used in the Surely app.

**Analysis Date**: 2025-11-02
**JSON:API Version**: 1.1

---

## Todo Resource

### Resource Type

`"todos"`

### Attributes

| Attribute        | Type                | Required | Nullable | Default | Description                               |
| ---------------- | ------------------- | -------- | -------- | ------- | ----------------------------------------- |
| `name`           | string              | Yes      | No       | -       | The todo item name/title                  |
| `notes`          | string              | No       | Yes      | null    | Additional notes or description           |
| `deferred-until` | date (ISO 8601)     | No       | Yes      | null    | Date when todo should appear (YYYY-MM-DD) |
| `completed-at`   | datetime (ISO 8601) | No       | Yes      | null    | Timestamp when todo was completed         |
| `deleted-at`     | datetime (ISO 8601) | No       | Yes      | null    | Timestamp when todo was soft-deleted      |

**Attribute Notes**:

- `name` is the only truly required field
- Datetime fields use ISO 8601 format with timezone
- Date fields use ISO 8601 date format (YYYY-MM-DD)
- The backend determines "status" based on attribute values:
  - `available`: deferred-until is null or past, completed-at is null, deleted-at is null
  - `tomorrow`: deferred-until is tomorrow, completed-at is null, deleted-at is null
  - `future`: deferred-until is future, completed-at is null, deleted-at is null
  - `completed`: completed-at is not null, deleted-at is null
  - `deleted`: deleted-at is not null

### Relationships

| Relationship | Type       | Cardinality              | Required | Description                          |
| ------------ | ---------- | ------------------------ | -------- | ------------------------------------ |
| `category`   | categories | belongs-to (many-to-one) | No       | Associated category for organization |

**Relationship Notes**:

- A todo can have zero or one category
- Category relationship is optional (can be null)
- Relationship is sent as resource identifier: `{"data": {"type": "categories", "id": "uuid"}}`
- Setting to null removes the category association

### Example JSON:API Object (Full)

**Response with included category**:

```json
{
  "data": {
    "type": "todos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "attributes": {
      "name": "Buy groceries",
      "notes": "Milk, eggs, bread",
      "deferred-until": null,
      "completed-at": null,
      "deleted-at": null
    },
    "relationships": {
      "category": {
        "data": {
          "type": "categories",
          "id": "660e8400-e29b-41d4-a716-446655440001"
        }
      }
    }
  },
  "included": [
    {
      "type": "categories",
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "attributes": {
        "name": "Shopping",
        "sort-order": 0
      }
    }
  ]
}
```

**Create request (minimal)**:

```json
{
  "data": {
    "type": "todos",
    "attributes": {
      "name": "Buy groceries"
    }
  }
}
```

**Create request (with deferred date)**:

```json
{
  "data": {
    "type": "todos",
    "attributes": {
      "name": "Call dentist",
      "deferred-until": "2025-11-10"
    }
  }
}
```

**Update request (full edit)**:

```json
{
  "data": {
    "type": "todos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "attributes": {
      "name": "Buy organic groceries",
      "notes": "Check farmers market first",
      "deferred-until": "2025-11-05"
    },
    "relationships": {
      "category": {
        "data": {
          "type": "categories",
          "id": "660e8400-e29b-41d4-a716-446655440001"
        }
      }
    }
  }
}
```

**Update request (complete)**:

```json
{
  "data": {
    "type": "todos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "attributes": {
      "completed-at": "2025-11-02T14:30:00Z"
    }
  }
}
```

**Update request (uncomplete)**:

```json
{
  "data": {
    "type": "todos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "attributes": {
      "completed-at": null
    }
  }
}
```

**Update request (delete)**:

```json
{
  "data": {
    "type": "todos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "attributes": {
      "deleted-at": "2025-11-02T14:35:00Z"
    }
  }
}
```

**Update request (undelete)**:

```json
{
  "data": {
    "type": "todos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "attributes": {
      "deleted-at": null,
      "completed-at": null
    }
  }
}
```

**Update request (remove category)**:

```json
{
  "data": {
    "type": "todos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "relationships": {
      "category": {
        "data": null
      }
    }
  }
}
```

### Backend Filter Support

The backend supports these filters via `filter[...]` query parameters:

| Filter           | Values                                          | Description                            |
| ---------------- | ----------------------------------------------- | -------------------------------------- |
| `filter[status]` | available, tomorrow, future, completed, deleted | Filter by computed status              |
| `filter[search]` | any text                                        | Full-text search across name and notes |

**Filter Examples**:

```
GET /todos?filter[status]=available&include=category
GET /todos?filter[status]=completed&filter[search]=groceries&sort=-completedAt&page[number]=1
```

### Status Logic (Computed)

Status is not stored as an attribute but computed based on other attributes:

```javascript
// Pseudocode for status determination
if (deleted - at !== null) {
  status = 'deleted';
} else if (completed - at !== null) {
  status = 'completed';
} else if (deferred - until === null || deferred - until <= today) {
  status = 'available';
} else if (deferred - until === tomorrow) {
  status = 'tomorrow';
} else if (deferred - until > tomorrow) {
  status = 'future';
}
```

---

## Category Resource

### Resource Type

`"categories"`

### Attributes

| Attribute    | Type    | Required | Nullable | Default | Description             |
| ------------ | ------- | -------- | -------- | ------- | ----------------------- |
| `name`       | string  | Yes      | No       | -       | The category name       |
| `sort-order` | integer | No       | No       | auto    | Display order (0-based) |

**Attribute Notes**:

- `name` is required and must be unique
- `sort-order` determines display order in the UI
- Lower numbers appear first
- Backend likely auto-assigns sort-order on create

### Relationships

| Relationship | Type  | Cardinality            | Description                         |
| ------------ | ----- | ---------------------- | ----------------------------------- |
| `todos`      | todos | has-many (one-to-many) | Todos associated with this category |

**Relationship Notes**:

- Not used in API requests from the client
- Todos are queried separately with filters
- Relationship exists for backend integrity

### Example JSON:API Object

**Single category response**:

```json
{
  "data": {
    "type": "categories",
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "attributes": {
      "name": "Shopping",
      "sort-order": 0
    }
  }
}
```

**Collection response**:

```json
{
  "data": [
    {
      "type": "categories",
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "attributes": {
        "name": "Shopping",
        "sort-order": 0
      }
    },
    {
      "type": "categories",
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "attributes": {
        "name": "Work",
        "sort-order": 1
      }
    },
    {
      "type": "categories",
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "attributes": {
        "name": "Personal",
        "sort-order": 2
      }
    }
  ]
}
```

**Create request**:

```json
{
  "data": {
    "type": "categories",
    "attributes": {
      "name": "Health"
    }
  }
}
```

**Update request (name)**:

```json
{
  "data": {
    "type": "categories",
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "attributes": {
      "name": "Shopping & Errands"
    }
  }
}
```

**Update request (sort-order)**:

```json
{
  "data": {
    "type": "categories",
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "attributes": {
      "sort-order": 3
    }
  }
}
```

### Usage in Todos

When a category is included with a todo via `include=category`, it appears in the `included` array:

```json
{
  "data": {
    "type": "todos",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "attributes": {
      "name": "Buy groceries"
    },
    "relationships": {
      "category": {
        "data": {
          "type": "categories",
          "id": "660e8400-e29b-41d4-a716-446655440001"
        }
      }
    }
  },
  "included": [
    {
      "type": "categories",
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "attributes": {
        "name": "Shopping",
        "sort-order": 0
      }
    }
  ]
}
```

---

## User Resource

### Resource Type

`"users"`

### Attributes

| Attribute  | Type           | Required          | Nullable | Description                                  |
| ---------- | -------------- | ----------------- | -------- | -------------------------------------------- |
| `email`    | string (email) | Yes               | No       | User's email address (also used as username) |
| `password` | string         | Yes (create only) | No       | User's password (write-only, never returned) |

**Attribute Notes**:

- `email` must be a valid email format
- `email` must be unique across all users
- `password` is only used during creation (sign up)
- `password` is never returned in responses
- Other user attributes may exist on backend but aren't used by client

### Relationships

None used by the client.

### Example JSON:API Object

**Create request (sign up)**:

```json
{
  "data": {
    "type": "users",
    "attributes": {
      "email": "user@example.com",
      "password": "securepassword123"
    }
  }
}
```

**Create response**:

```json
{
  "data": {
    "type": "users",
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "attributes": {
      "email": "user@example.com"
    }
  }
}
```

**Note**: Password is not included in response.

### Error Responses

**Validation error example**:

```json
{
  "errors": [
    {
      "status": "422",
      "title": "Unprocessable Entity",
      "detail": "Email has already been taken",
      "source": {
        "pointer": "/data/attributes/email"
      }
    }
  ]
}
```

---

## OAuth Token (Non-JSON:API)

### Endpoint

`POST /oauth/token`

### Request Format

**NOT JSON:API** - Uses standard OAuth 2.0 format:

```json
{
  "grant_type": "password",
  "username": "user@example.com",
  "password": "securepassword123"
}
```

**Content-Type**: `application/x-www-form-urlencoded` or `application/json`

### Response Format

**NOT JSON:API** - Uses standard OAuth 2.0 token response:

```json
{
  "access_token": "a1b2c3d4e5f6g7h8i9j0",
  "token_type": "Bearer",
  "expires_in": 7200,
  "created_at": 1699000000
}
```

### Usage

The `access_token` is stored and used in subsequent requests:

```
Authorization: Bearer a1b2c3d4e5f6g7h8i9j0
```

### Error Response

```json
{
  "error": "invalid_grant",
  "error_description": "The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client."
}
```

---

## Pagination Structure

### Request

Pages are requested using `page[number]` query parameter:

```
GET /todos?filter[status]=completed&page[number]=2
```

### Response Meta

Paginated responses include a `meta` object with page information:

```json
{
  "data": [ ... ],
  "meta": {
    "page-count": 5
  }
}
```

| Meta Field   | Type    | Description                     |
| ------------ | ------- | ------------------------------- |
| `page-count` | integer | Total number of pages available |

**Usage**:

- Client uses `meta['page-count']` to determine maximum page number
- No explicit `page[size]` parameter (backend determines page size)
- Page numbers are 1-based (first page is 1, not 0)

---

## Error Response Structure

All JSON:API errors follow this structure:

```json
{
  "errors": [
    {
      "status": "404",
      "title": "Not Found",
      "detail": "Couldn't find Todo with 'id'=invalid-id"
    }
  ]
}
```

### Error Object Members

| Member             | Type   | Description                                       |
| ------------------ | ------ | ------------------------------------------------- |
| `status`           | string | HTTP status code as string                        |
| `title`            | string | Short, human-readable summary                     |
| `detail`           | string | Human-readable explanation specific to this error |
| `source`           | object | Optional: pointer to source of error              |
| `source.pointer`   | string | JSON Pointer to the problematic field             |
| `source.parameter` | string | Query parameter that caused the error             |

### Common Errors

| Status | Scenario              | Example                       |
| ------ | --------------------- | ----------------------------- |
| 400    | Bad Request           | Invalid JSON or parameters    |
| 401    | Unauthorized          | Missing or invalid auth token |
| 404    | Not Found             | Resource ID doesn't exist     |
| 422    | Unprocessable Entity  | Validation errors             |
| 500    | Internal Server Error | Server-side error             |

---

## Data Type Conventions

### Dates and Times

| Format   | JSON:API Type                   | Example                  | Usage                    |
| -------- | ------------------------------- | ------------------------ | ------------------------ |
| Date     | string (ISO 8601 date)          | `"2025-11-02"`           | deferred-until           |
| Datetime | string (ISO 8601 with timezone) | `"2025-11-02T14:30:00Z"` | completed-at, deleted-at |

### UUIDs

All resource IDs use UUID v4 format:

```
"550e8400-e29b-41d4-a716-446655440000"
```

### Attribute Naming

- Uses kebab-case: `deferred-until`, `completed-at`, `sort-order`
- Consistent with JSON:API recommendations
- JavaScript code uses camelCase in quotes: `'deferred-until'`

---

## Client-Side Transformations

### Grouping

The client groups todos for display:

1. **By Category** (`groupByCategory`):

   - Used in: Available, Tomorrow lists
   - Groups todos by their category relationship
   - Uses `included` category data

2. **By Date** (`groupByDate`):
   - Used in: Future, Completed, Deleted lists
   - Groups by `deferred-until`, `completed-at`, or `deleted-at`
   - Optional reverse chronological order

### Sorting

**Categories**:

- Backend doesn't sort, sends in arbitrary order
- Client sorts by `attributes.sort-order` using lodash `sortBy`

**Todos**:

- Backend sorts via `sort` query parameter
- Client does additional grouping but preserves backend sort order

### Date Calculations

**Deferral**:

- Client calculates dates using `date-fns` library
- `tomorrow()`: adds 1 day to current date
- `deferDate()`: adds N days to current or existing date
- Dates sent to backend in ISO 8601 format (YYYY-MM-DD)

---

## Summary

### Resource Overview

| Resource   | Attributes | Relationships           | Endpoints |
| ---------- | ---------- | ----------------------- | --------- |
| Todos      | 5          | 1 (belongs-to Category) | 4         |
| Categories | 2          | 1 (has-many Todos)      | 5         |
| Users      | 2          | 0                       | 1         |

### Complexity Metrics

| Resource   | Create Fields | Update Fields | Read Fields | Computed Fields |
| ---------- | ------------- | ------------- | ----------- | --------------- |
| Todos      | 1-3           | 1-5           | 5           | 1 (status)      |
| Categories | 1             | 1-2           | 2           | 0               |
| Users      | 2             | 0             | 1           | 0               |

### Data Patterns

- ✅ Soft deletes (todos use `deleted-at` timestamp)
- ✅ Timestamps for auditing (completed-at, deleted-at)
- ✅ Optional relationships (todo.category is nullable)
- ✅ Computed fields (status derived from attributes)
- ✅ Client-side sorting (categories)
- ✅ Server-side filtering and sorting (todos)
