# Surely Backend API Endpoints

This document lists all backend API endpoints called by the Expo React Native application, including HTTP methods, URL parameters, query parameters, and request bodies. This serves as a comprehensive reference for understanding the API contract and for potential backend migrations.

## Base URL
- **Production**: `https://api.surelytodo.com`
- **Local Development (iOS/Web)**: `http://localhost:3000`
- **Local Development (Android)**: `http://10.0.2.2:3000`
- **Physical Device**: `http://{LOCAL_IP}:3000` (configurable via `LOCAL_IP` variable in [src/baseUrl.js](../src/baseUrl.js))

## Authentication
All endpoints (except token creation and user signup) require Bearer token authentication via the `Authorization` header:
```
Authorization: Bearer {access_token}
```

The token is managed via [src/data/token.js](../src/data/token.js) and stored securely using platform-specific storage (Expo SecureStore for native, localStorage for web).

---

## Authentication Endpoints

### 1. Create OAuth Token (Sign In)
- **Endpoint**: `/oauth/token`
- **HTTP Method**: `POST`
- **URL Parameters**: None
- **Query Parameters**: None
- **Authentication**: None (public endpoint)
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "grant_type": "password",
    "username": "{email}",
    "password": "{password}"
  }
  ```
- **Response**: JSON object containing the access token:
  ```json
  {
    "access_token": "{string - OAuth access token}",
    "token_type": "{string - typically 'Bearer'}",
    "created_at": {integer - Unix timestamp}
  }
  ```
- **Implementation**: [src/auth/oauthLogin.js](../src/auth/oauthLogin.js) - `oauthLogin()`
- **Used By**: [src/screens/Login/SignInForm.js](../src/screens/Login/SignInForm.js)
- **Notes**: This is the **only endpoint that does NOT use JSON:API format**

---

## User Endpoints (JSON:API)

All user endpoints follow the JSON:API specification and use `Content-Type: application/vnd.api+json`.

### 2. Create User (Sign Up)
- **Endpoint**: `/users`
- **HTTP Method**: `POST`
- **URL Parameters**: None
- **Query Parameters**: None
- **Authentication**: None (public endpoint - however, the app may send an empty Bearer token during signup)
- **Content-Type**: `application/vnd.api+json`
- **Request Body**: JSON:API format
  ```json
  {
    "data": {
      "type": "users",
      "attributes": {
        "email": "{string - user's email address}",
        "password": "{string - user's password}"
      }
    }
  }
  ```
- **Implementation**: [src/data/users.js](../src/data/users.js) - `useUsers()` hook with `create()`
- **Used By**: [src/screens/Login/SignUpForm.js](../src/screens/Login/SignUpForm.js)

---

## Todo Endpoints (JSON:API)

All todo endpoints follow the JSON:API specification and use `Content-Type: application/vnd.api+json`.

### 3. List Todos with Filters
- **Endpoint**: `/todos`
- **HTTP Method**: `GET`
- **URL Parameters**: None
- **Query Parameters**: Various filter and options combinations (see below)
- **Authentication**: Required (Bearer token)
- **Implementation**: [src/data/todos.js](../src/data/todos.js) - `useTodos()` hook with `where()`

#### Common Filter Patterns:

**Available Todos:**
- **Query**: `GET /todos?filter[status]=available&include=category`
- **Used By**: [src/screens/TodoList/Available.js](../src/screens/TodoList/Available.js)

**Tomorrow Todos:**
- **Query**: `GET /todos?filter[status]=tomorrow&include=category`
- **Used By**: [src/screens/TodoList/Tomorrow.js](../src/screens/TodoList/Tomorrow.js)

**Future Todos:**
- **Query**: `GET /todos?filter[status]=future&include=category`
- **Query with Search**: `GET /todos?filter[status]=future&filter[search]={searchText}&sort=name&include=category`
- **Used By**: [src/screens/TodoList/Future.js](../src/screens/TodoList/Future.js)

**Completed Todos:**
- **Query**: `GET /todos?filter[status]=completed&filter[search]={searchText}&sort=-completedAt&page[number]={pageNumber}&include=category`
- **Used By**: [src/screens/TodoList/Completed.js](../src/screens/TodoList/Completed.js)
- **Notes**: Uses pagination with `page[number]` parameter; response includes `meta['page-count']`

**Deleted Todos:**
- **Query**: `GET /todos?filter[status]=deleted&filter[search]={searchText}&sort=-deletedAt&page[number]={pageNumber}&include=category`
- **Used By**: [src/screens/TodoList/Deleted.js](../src/screens/TodoList/Deleted.js)
- **Notes**: Uses pagination with `page[number]` parameter; response includes `meta['page-count']`

#### Standard Query Parameters:
- `filter[status]` - Possible values: `available`, `tomorrow`, `future`, `completed`, `deleted`
- `filter[search]` - Text search parameter (free-form string)
- `sort` - Sort order (examples: `name`, `-completedAt`, `-deletedAt`; `-` prefix indicates descending)
- `page[number]` - Page number for pagination (used in completed and deleted lists)
- `include` - Relationships to include (commonly: `category`)

### 4. Get Single Todo
- **Endpoint**: `/todos/{id}`
- **HTTP Method**: `GET`
- **URL Parameters**:
  - `id` - The ID of the todo to retrieve
- **Query Parameters**: `include=category` (optional)
- **Authentication**: Required (Bearer token)
- **Implementation**: [src/data/todos.js](../src/data/todos.js) - `useTodos()` hook with `find()`
- **Used By**: [src/screens/TodoDetail/index.js](../src/screens/TodoDetail/index.js)

### 5. Create Todo
- **Endpoint**: `/todos`
- **HTTP Method**: `POST`
- **URL Parameters**: None
- **Query Parameters**: None
- **Authentication**: Required (Bearer token)
- **Content-Type**: `application/vnd.api+json`
- **Request Body**: JSON:API format
  ```json
  {
    "data": {
      "type": "todos",
      "attributes": {
        "name": "{string - todo name}",
        "deferred-until": "{ISO 8601 date string - optional}"
      }
    }
  }
  ```
- **Implementation**: [src/data/todos.js](../src/data/todos.js) - `useTodos()` hook with `create()`
- **Used By**:
  - [src/screens/TodoList/Available.js](../src/screens/TodoList/Available.js) - Creates available todos (no `deferred-until`)
  - [src/screens/TodoList/Tomorrow.js](../src/screens/TodoList/Tomorrow.js) - Creates tomorrow todos (with `deferred-until` set to tomorrow)

### 6. Update Todo
- **Endpoint**: `/todos/{id}`
- **HTTP Method**: `PATCH`
- **URL Parameters**:
  - `id` - The ID of the todo to update
- **Query Parameters**: None
- **Authentication**: Required (Bearer token)
- **Content-Type**: `application/vnd.api+json`
- **Request Body**: JSON:API format with updated attributes and/or relationships

#### Common Update Patterns:

**Edit Todo (Form Updates):**
```json
{
  "data": {
    "type": "todos",
    "id": "{string}",
    "attributes": {
      "name": "{string - updated name}",
      "notes": "{string - updated notes}",
      "deferred-until": "{ISO 8601 date string or null}"
    },
    "relationships": {
      "category": {
        "data": {
          "type": "categories",
          "id": "{string - category ID or null}"
        }
      }
    }
  }
}
```
- **Used By**: [src/screens/TodoDetail/DetailForm.js](../src/screens/TodoDetail/DetailForm.js)

**Mark Complete:**
```json
{
  "data": {
    "type": "todos",
    "id": "{string}",
    "attributes": {
      "completed-at": "{ISO 8601 date-time string}"
    }
  }
}
```
- **Used By**: [src/screens/TodoDetail/Default.js](../src/screens/TodoDetail/Default.js)

**Mark Incomplete:**
```json
{
  "data": {
    "type": "todos",
    "id": "{string}",
    "attributes": {
      "completed-at": null
    }
  }
}
```
- **Used By**: [src/screens/TodoDetail/Default.js](../src/screens/TodoDetail/Default.js)

**Mark Deleted (Soft Delete):**
```json
{
  "data": {
    "type": "todos",
    "id": "{string}",
    "attributes": {
      "deleted-at": "{ISO 8601 date-time string}"
    }
  }
}
```
- **Used By**: [src/screens/TodoDetail/Default.js](../src/screens/TodoDetail/Default.js)

**Undelete:**
```json
{
  "data": {
    "type": "todos",
    "id": "{string}",
    "attributes": {
      "deleted-at": null,
      "completed-at": null
    }
  }
}
```
- **Used By**: [src/screens/TodoDetail/Default.js](../src/screens/TodoDetail/Default.js)

**Defer Todo:**
```json
{
  "data": {
    "type": "todos",
    "id": "{string}",
    "attributes": {
      "deferred-until": "{ISO 8601 date string}"
    }
  }
}
```
- **Used By**: [src/screens/TodoDetail/Defer.js](../src/screens/TodoDetail/Defer.js)

- **Implementation**: [src/data/todos.js](../src/data/todos.js) - `useTodos()` hook with `update()`

---

## Category Endpoints (JSON:API)

All category endpoints follow the JSON:API specification and use `Content-Type: application/vnd.api+json`.

### 7. List All Categories
- **Endpoint**: `/categories`
- **HTTP Method**: `GET`
- **URL Parameters**: None
- **Query Parameters**: None
- **Authentication**: Required (Bearer token)
- **Response**: JSON:API document with array of category resources
- **Implementation**: [src/data/categories.js](../src/data/categories.js) - `useCategories()` hook with `all()`
- **Used By**:
  - [src/screens/CategoryList.js](../src/screens/CategoryList.js)
  - [src/screens/TodoDetail/DetailForm.js](../src/screens/TodoDetail/DetailForm.js) (via React Query)
- **Notes**: Client-side sorting by `attributes.sort-order` is applied after fetching

### 8. Get Single Category
- **Endpoint**: `/categories/{id}`
- **HTTP Method**: `GET`
- **URL Parameters**:
  - `id` - The ID of the category to retrieve
- **Query Parameters**: None
- **Authentication**: Required (Bearer token)
- **Implementation**: [src/data/categories.js](../src/data/categories.js) - `useCategories()` hook with `find()`
- **Used By**: [src/screens/CategoryDetail.js](../src/screens/CategoryDetail.js)

### 9. Create Category
- **Endpoint**: `/categories`
- **HTTP Method**: `POST`
- **URL Parameters**: None
- **Query Parameters**: None
- **Authentication**: Required (Bearer token)
- **Content-Type**: `application/vnd.api+json`
- **Request Body**: JSON:API format
  ```json
  {
    "data": {
      "type": "categories",
      "attributes": {
        "name": "{string - category name}"
      }
    }
  }
  ```
- **Implementation**: [src/data/categories.js](../src/data/categories.js) - `useCategories()` hook with `create()`
- **Used By**: [src/screens/CategoryDetail.js](../src/screens/CategoryDetail.js)

### 10. Update Category
- **Endpoint**: `/categories/{id}`
- **HTTP Method**: `PATCH`
- **URL Parameters**:
  - `id` - The ID of the category to update
- **Query Parameters**: None
- **Authentication**: Required (Bearer token)
- **Content-Type**: `application/vnd.api+json`
- **Request Body**: JSON:API format
  ```json
  {
    "data": {
      "type": "categories",
      "id": "{string}",
      "attributes": {
        "name": "{string - updated name}",
        "sort-order": "{number - display order}"
      }
    }
  }
  ```
- **Implementation**: [src/data/categories.js](../src/data/categories.js) - `useCategories()` hook with `update()`
- **Used By**:
  - [src/screens/CategoryDetail.js](../src/screens/CategoryDetail.js) (name updates)
  - [src/screens/CategoryList.js](../src/screens/CategoryList.js) (sort-order updates)

### 11. Delete Category
- **Endpoint**: `/categories/{id}`
- **HTTP Method**: `DELETE`
- **URL Parameters**:
  - `id` - The ID of the category to delete
- **Query Parameters**: None
- **Authentication**: Required (Bearer token)
- **Implementation**: [src/data/categories.js](../src/data/categories.js) - `useCategories()` hook with `delete()`
- **Used By**: [src/screens/CategoryDetail.js](../src/screens/CategoryDetail.js)

---

## JSON:API Library

This application uses the `@codingitwrong/jsonapi-client` library (version ^0.0.11) to interact with JSON:API endpoints. The library provides a `ResourceClient` class that handles:

- Automatic JSON:API formatting of requests
- Bearer token authentication via Axios HTTP client
- Standard CRUD operations (all, find, where, create, update, delete)
- Query parameter building for filters, sorting, pagination, and includes

### Resource Client Setup

All resource clients are created using a common pattern:

1. **HTTP Client Factory** - [src/data/authenticatedHttpClient.js](../src/data/authenticatedHttpClient.js) creates Axios instances with Bearer token authentication
2. **Resource Hook** - Each resource (todos, categories, users) has a React hook that:
   - Accesses the auth token from context
   - Creates an authenticated HTTP client
   - Instantiates a `ResourceClient` for that resource type
   - Returns the client for use in components

Example:
```javascript
import {ResourceClient} from '@codingitwrong/jsonapi-client';

const httpClient = authenticatedHttpClient({token});
const todoClient = new ResourceClient({name: 'todos', httpClient});
```

### JSON:API Response Format

All JSON:API endpoints return responses in this structure:

```json
{
  "data": [...],          // Array of resources or single resource
  "included": [...],      // Related resources (when using 'include' parameter)
  "meta": {               // Metadata (e.g., pagination info)
    "page-count": 5
  }
}
```

Resource objects follow this format:

```json
{
  "type": "todos",
  "id": "123",
  "attributes": {
    "name": "Buy groceries",
    "notes": "Milk, eggs, bread",
    "completed-at": null,
    "deleted-at": null,
    "deferred-until": "2024-01-15"
  },
  "relationships": {
    "category": {
      "data": {
        "type": "categories",
        "id": "456"
      }
    }
  }
}
```

---

## Mock API Mode

For development without a backend, the app supports mock mode via the `MOCK_API=true` environment variable:

- **Mock Implementation**: [src/data/authenticatedHttpClient.mock.js](../src/data/authenticatedHttpClient.mock.js)
- **Start Command**: `yarn start:mock`
- **Capabilities**: Returns mock todo data based on status and date filters
- **Usage**: Useful for UI development, testing, and demonstrations

---

## Summary

### Total Endpoints: 11

#### By Resource:
- **Authentication**: 1 endpoint (non-JSON:API)
- **Users**: 1 endpoint (Create)
- **Todos**: 4 endpoint patterns (List with filters, Get, Create, Update)
- **Categories**: 5 endpoints (List, Get, Create, Update, Delete)

#### By HTTP Method:
- **GET**: 4 endpoint patterns (Todos with various filters, Single Todo, Categories, Single Category)
- **POST**: 3 endpoints (OAuth Token, Create User, Create Todo, Create Category)
- **PATCH**: 2 endpoints (Update Todo, Update Category)
- **DELETE**: 1 endpoint (Delete Category)

### API Format:
- **JSON:API Format**: 10 endpoints (all user, todo, and category endpoints)
- **Standard JSON**: 1 endpoint (OAuth token creation)

### Notes:
1. **JSON:API Standard**: All resource endpoints (users, todos, categories) strictly follow the JSON:API specification with `application/vnd.api+json` content type
2. **Soft Deletes**: Todos use soft deletion via the `deleted-at` attribute rather than hard DELETE
3. **Pagination**: Only completed and deleted todo lists use pagination via `page[number]` parameter
4. **Relationships**: The `include` parameter is commonly used to fetch related category data with todos
5. **Status-Based Filtering**: Todos are primarily filtered by status (available, tomorrow, future, completed, deleted) with additional search and sort capabilities
6. **Client-Side Operations**: Some operations (like category sorting) happen client-side after fetching all data
7. **No Hard Delete for Todos**: There is no DELETE endpoint for todos - only soft delete via PATCH with `deleted-at`
