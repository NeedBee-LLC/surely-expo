# API Usage Analysis Plan

## Overview

This document outlines the plan to comprehensively analyze how the Surely expo app uses the jsonapi-client library to make API requests. The goal is to produce a complete inventory of all API endpoints used, the parameters passed to them, and the data they send and receive.

## Understanding the Foundation: JSON:API Specification

Before analyzing the codebase, it's essential to understand the JSON:API specification that the entire architecture is built upon.

**Reference**: [JSON:API Specification v1.1](https://jsonapi.org/format/)

### Key JSON:API Concepts to Understand

#### 1. Document Structure

Every JSON:API document has a top-level structure with these potential members:

- `data`: The primary data (resource object, array of resource objects, or null)
- `errors`: An array of error objects (cannot coexist with `data`)
- `meta`: Non-standard meta-information about the document
- `links`: Links related to the primary data
- `included`: Related resource objects (for included relationships)
- `jsonapi`: Information about the JSON:API implementation

#### 2. Resource Objects

A resource object **MUST** contain at least:

- `type` (string): The resource type
- `id` (string): Unique identifier

And **MAY** contain:

- `attributes`: Object of the resource's attributes
- `relationships`: Object describing relationships to other resources
- `links`: Links related to the resource
- `meta`: Non-standard meta-information

Example:

```json
{
  "type": "todos",
  "id": "1",
  "attributes": {
    "title": "Buy milk",
    "notes": "2% milk"
  },
  "relationships": {
    "category": {
      "data": {"type": "categories", "id": "5"}
    }
  }
}
```

#### 3. Standard Query Parameters

JSON:API defines standard query parameter families:

- **`filter`**: Filter resources (implementation-specific syntax)

  - Example: `filter[completed]=false`, `filter[category]=work`

- **`sort`**: Sort resources by attributes/relationships

  - Example: `sort=title`, `sort=-createdAt` (minus for descending)
  - Multiple: `sort=priority,-createdAt`

- **`page`**: Pagination (implementation-specific syntax)

  - Example: `page[number]=1&page[size]=10`
  - Or: `page[offset]=0&page[limit]=20`

- **`include`**: Include related resources in the `included` section

  - Example: `include=category`, `include=category,author`
  - Nested: `include=category.parent`

- **`fields`**: Sparse fieldsets - select specific fields
  - Example: `fields[todos]=title,completed`

#### 4. HTTP Methods and Semantics

- **GET**: Fetch resources (collection or individual)
- **POST**: Create new resources
- **PATCH**: Update existing resources (not PUT!)
- **DELETE**: Delete resources

#### 5. Content Type

All JSON:API requests and responses **MUST** use the media type:

```
Content-Type: application/vnd.api+json
```

#### 6. Request/Response Patterns

**Creating a Resource (POST)**:

```json
POST /todos
Content-Type: application/vnd.api+json

{
  "data": {
    "type": "todos",
    "attributes": {
      "title": "Buy milk"
    },
    "relationships": {
      "category": {
        "data": { "type": "categories", "id": "5" }
      }
    }
  }
}
```

**Updating a Resource (PATCH)**:

```json
PATCH /todos/1
Content-Type: application/vnd.api+json

{
  "data": {
    "type": "todos",
    "id": "1",
    "attributes": {
      "title": "Buy organic milk"
    }
  }
}
```

**Fetching with Includes**:

```
GET /todos/1?include=category
```

Response includes the related category in `included`:

```json
{
  "data": {
    "type": "todos",
    "id": "1",
    "attributes": {"title": "Buy milk"},
    "relationships": {
      "category": {
        "data": {"type": "categories", "id": "5"}
      }
    }
  },
  "included": [
    {
      "type": "categories",
      "id": "5",
      "attributes": {"name": "Shopping"}
    }
  ]
}
```

#### 7. Error Responses

Errors are returned in an `errors` array:

```json
{
  "errors": [
    {
      "status": "422",
      "title": "Invalid Attribute",
      "detail": "Title must not be blank",
      "source": {
        "pointer": "/data/attributes/title"
      }
    }
  ]
}
```

### How This Applies to Our Analysis

Understanding these JSON:API concepts is crucial because:

1. **Query Parameters**: When we see `options` passed to client methods, they map to JSON:API query parameters
2. **Request Bodies**: `attributes` and `relationships` in create/update calls follow JSON:API structure
3. **Response Handling**: The jsonapi-client returns full JSON:API documents with `data`, `included`, etc.
4. **Filtering & Sorting**: Understanding standard parameter syntax helps identify backend implementation
5. **Relationship Loading**: The `include` parameter and `included` responses are key to understanding data fetching

## Understanding the Architecture

### jsonapi-client Library Structure

The jsonapi-client library provides a `ResourceClient` class that abstracts JSON:API operations:

**Location**: `/jsonapi-client/src/ResourceClient.js`

**Key Methods**:

- `all({options})` - GET all records for a resource
- `find({id, options})` - GET a single record by ID
- `where({filter, options})` - GET filtered records
- `related({parent, relationship, options})` - GET related records via relationships
- `create({attributes, relationships, options})` - POST new record
- `update({id, attributes, relationships, options})` - PATCH existing record
- `delete({id})` - DELETE record

**HTTP Endpoint Pattern**:

- `all()`: `GET /{resource}?{options}`
- `find()`: `GET /{resource}/{id}?{options}`
- `where()`: `GET /{resource}?filter[key]=value&{options}`
- `related()`: `GET /{parent.type}/{parent.id}/{relationship}?{options}`
- `create()`: `POST /{resource}?{options}`
- `update()`: `PATCH /{resource}/{id}?{options}`
- `delete()`: `DELETE /{resource}/{id}`

### Expo App Architecture

**Data Layer**: `/expo/src/data/`

The expo app creates three React hooks that instantiate ResourceClient instances:

1. **useTodos()** (`/expo/src/data/todos.js`)

   - Resource name: `todos`
   - Uses authenticated HTTP client

2. **useCategories()** (`/expo/src/data/categories.js`)

   - Resource name: `categories`
   - Uses authenticated HTTP client

3. **useUsers()** (`/expo/src/data/users.js`)
   - Resource name: `users`
   - Uses authenticated HTTP client

**HTTP Clients**:

1. **authenticatedHttpClient** (`/expo/src/data/authenticatedHttpClient.js`)

   - Axios instance with Bearer token authentication
   - Base URL: configured via `baseUrl.js`
   - Used for all resource operations

2. **loginHttpClient** (`/expo/src/data/loginHttpClient.js`)
   - Axios instance without authentication
   - Base URL: configured via `baseUrl.js`
   - Used for OAuth login

**Authentication**:

- OAuth token stored via `token.js` using `TokenProvider` context
- Login handled via `oauthLogin.js` which posts to `/oauth/token`

**Base URL Configuration** (`/expo/src/baseUrl.js`):

- Development (iOS): `http://localhost:3000`
- Development (Android): `http://10.0.2.2:3000`
- Production: `https://api.surelytodo.com`

## Analysis Strategy

### Phase 0: JSON:API Specification Review

**Objective**: Establish foundational understanding of JSON:API conventions.

**Actions**:

1. Review the JSON:API specification at https://jsonapi.org/format/
2. Document standard query parameters and their syntax
3. Understand resource object structure (type, id, attributes, relationships)
4. Note request/response document structure
5. Understand the role of Content-Type header (`application/vnd.api+json`)
6. Identify which conventions are standardized vs implementation-specific

**Key Takeaways to Apply**:

- How `filter`, `sort`, `include`, `page`, and `fields` parameters work
- The structure of POST/PATCH request bodies
- The structure of GET responses (data, included, meta, links)
- How relationships are represented and loaded
- HTTP status codes and error response format

### Phase 1: Map All Usage Sites

Identify every location in the codebase where the client hooks are called:

**Files to Analyze**:

Based on grep results, these files use the resource clients:

1. **Todo-Related Screens**:

   - `/expo/src/screens/TodoList/Available.js`
   - `/expo/src/screens/TodoList/Tomorrow.js`
   - `/expo/src/screens/TodoList/Future.js`
   - `/expo/src/screens/TodoList/Completed.js`
   - `/expo/src/screens/TodoList/Deleted.js`
   - `/expo/src/screens/TodoDetail/index.js`
   - `/expo/src/screens/TodoDetail/DetailForm.js`
   - `/expo/src/screens/TodoDetail/DetailDisplay/Actions/Default.js`
   - `/expo/src/screens/TodoDetail/DetailDisplay/Actions/Defer.js`

2. **Category-Related Screens**:

   - `/expo/src/screens/CategoryList.js`
   - `/expo/src/screens/CategoryDetail.js`

3. **User-Related Screens**:

   - `/expo/src/screens/Login/SignUpForm.js`

4. **Authentication**:
   - `/expo/src/screens/Login/SignInForm.js` (uses oauthLogin)

### Phase 2: Extract Method Calls

For each file identified in Phase 1, extract:

1. **Which method is called** (all, find, where, related, create, update, delete)
2. **What parameters are passed**:
   - For `all()`: what options (include, sort, page, etc.)
   - For `find()`: how IDs are obtained, what options (include, fields)
   - For `where()`: what filter keys/values, what options
   - For `related()`: what parent objects, what relationships, what options
   - For `create()`: what attributes, what relationships
   - For `update()`: what attributes, what relationships
   - For `delete()`: just the ID
3. **Context of the call**: when/why it's triggered (load, button click, form submit, etc.)
4. **What happens with the response**: how data is used/displayed

**JSON:API Integration Points to Note**:

- Which standard query parameters are used (`filter`, `sort`, `include`, `page`, `fields`)
- How filter syntax is implemented (e.g., `filter[status]=active`)
- Whether sorting uses standard syntax (e.g., `sort=-createdAt`)
- Whether includes are used to load related resources
- Whether pagination is implemented and what style (offset/limit or number/size)
- How `response.data` and `response.included` are accessed in the code

### Phase 3: Document Data Structures

For each resource type (todos, categories, users), document:

1. **Attributes sent in create/update operations**:

   - Field names
   - Data types
   - Required vs optional
   - Validation rules (if visible in code)

2. **Relationships sent in create/update operations**:

   - Relationship names
   - Related resource types
   - Whether single or multiple

3. **Response structures used**:
   - What fields from responses are accessed
   - What included resources are expected

### Phase 4: Map to Backend API

Cross-reference with the Rails API to understand:

1. **Backend routes** (`/api/config/routes.rb`)
2. **Controller actions** (`/api/app/controllers/`)
3. **Resource serialization** (`/api/app/resources/`)
4. **Model structure** (`/api/app/models/`)

This will help validate that the analysis is complete and accurate.

### Phase 5: Create Comprehensive Inventory

Produce a final document that lists:

1. **Every unique API endpoint called**
2. **HTTP method** (GET, POST, PATCH, DELETE)
3. **Full URL pattern** (including query params)
4. **Request body structure** (for POST/PATCH)
5. **Expected response structure**
6. **Where in the app** it's used
7. **User action** that triggers it

## Analysis Tools and Techniques

### 1. Static Code Analysis

**Tools**:

- `grep`: Search for method calls (`.all(`, `.find(`, `.where(`, etc.)
- `read_file`: Read each identified file
- AST parsing (manual): Trace variable flow and parameter construction

**Search Patterns**:

```bash
# Find all method calls
grep -r "\.all\(" expo/src/screens/
grep -r "\.find\(" expo/src/screens/
grep -r "\.where\(" expo/src/screens/
grep -r "\.related\(" expo/src/screens/
grep -r "\.create\(" expo/src/screens/
grep -r "\.update\(" expo/src/screens/
grep -r "\.delete\(" expo/src/screens/
```

### 2. Dynamic Analysis (Optional)

If static analysis is insufficient:

- Run the app in development
- Use network inspection to see actual requests
- Compare with static analysis results

### 3. Test Analysis

Examine test files to understand expected usage:

- `/expo/e2e/` - End-to-end tests
- `/expo/cypress/` - Integration tests
- Any unit tests for screens/components

## Deliverables

### Primary Output: API Endpoint Inventory

**File**: `/expo/docs/api-endpoint-inventory.md`

**Structure**:

````markdown
# API Endpoint Inventory

## JSON:API Conventions Used

Brief summary of which standard JSON:API features are utilized:

- Query parameters: filter, sort, include, page
- Relationship loading via `include` parameter
- Pagination style (offset/limit or number/size)
- Content-Type headers

## Todos Resource

### GET /todos

**Usage**: Load all available todos
**Called from**: Available.js, Tomorrow.js, etc.
**Query Parameters** (JSON:API standard):

- `filter[...]`: ... (implementation-specific filters)
- `include`: ... (related resources to include)
- `sort`: ... (sorting criteria)
- `page[...]`: ... (pagination parameters)

**Response** (JSON:API format):

```json
{
  "data": [
    {
      "type": "todos",
      "id": "1",
      "attributes": { ... },
      "relationships": { ... }
    }
  ],
  "included": [ ... ],
  "meta": { ... }
}
```
````

### GET /todos/:id

**Usage**: Load a single todo
**Called from**: TodoDetail/index.js
**Query Parameters**:

- `include`: Related resources (e.g., "category")

**Response**: Single resource object in JSON:API format

### POST /todos

**Usage**: Create new todo
**Called from**: DetailForm.js
**Content-Type**: `application/vnd.api+json`
**Request Body** (JSON:API format):

```json
{
  "data": {
    "type": "todos",
    "attributes": {
      "title": string,
      "notes": string,
      ...
    },
    "relationships": {
      "category": {
        "data": { "type": "categories", "id": string }
      }
    }
  }
}
```

**Response**: Created todo object in JSON:API format

[Continue for all endpoints...]

````

### Secondary Output: Usage Matrix

**File**: `/expo/docs/usage-matrix.md`

A cross-reference showing which screens use which endpoints:

```markdown
| Screen       | Resource | Methods Used        | Purpose                         |
| ------------ | -------- | ------------------- | ------------------------------- |
| Available.js | todos    | all, create, update | Show and manage available todos |

| ...
````

### Tertiary Output: Data Model Documentation

**File**: `/expo/docs/data-models.md`

Complete documentation of the data structures for each resource:

```markdown
## Todo Resource

### Attributes

- `title` (string, required): The todo title
- `notes` (string, optional): Additional notes
- `completedAt` (datetime, optional): When completed
- `deletedAt` (datetime, optional): When soft-deleted
- `deferredUntil` (date, optional): Deferred until date
- ...

### Relationships

- `category`: belongs to Category
- ...

### Example JSON:API Object

...
```

## Execution Steps

### Step 0: Review JSON:API Specification

Review the JSON:API specification at https://jsonapi.org/format/ to understand:

- Standard document structure (`data`, `included`, `meta`, `links`, `errors`)
- Resource object format (`type`, `id`, `attributes`, `relationships`)
- Standard query parameters (`filter`, `sort`, `include`, `page`, `fields`)
- Request/response patterns for CRUD operations
- Content-Type requirements (`application/vnd.api+json`)
- Error response format

This provides the foundation for understanding how the jsonapi-client library and expo app work.

### Step 1: Read all screen files

Read all 12 screen files identified in Phase 1

### Step 2: Extract method calls

For each file, document:

- Method name
- Line numbers
- Parameters (literal values or variable references)
- Context (event handler, useEffect, etc.)

### Step 3: Trace parameter construction

For dynamic parameters, trace back to understand:

- Where values come from (state, props, form inputs)
- What transformations are applied

### Step 4: Read backend API files

Read Rails controllers, routes, and resources to validate understanding

### Step 5: Compile inventory

Create the three deliverable documents

### Step 6: Review and validate

Check for:

- Missing endpoints
- Incorrect parameter documentation
- Incomplete data model documentation

## Timeline Estimates

This is a complex analysis requiring careful code reading:

- **Phase 0** (JSON:API spec review): Understanding the foundation
- **Phase 1** (Map usage sites): Already complete via grep
- **Phase 2** (Extract method calls): Reading and analyzing 12 files
- **Phase 3** (Document data structures): Synthesizing from Phase 2
- **Phase 4** (Map to backend): Reading Rails API files
- **Phase 5** (Create inventory): Compiling all findings
- **Phase 6** (Review): Final validation

**Total effort**: JSON:API spec review, thorough analysis of 12+ frontend files, backend validation, and comprehensive documentation

## Success Criteria

The analysis is complete when:

1. ✅ JSON:API specification has been reviewed and key concepts documented
2. ✅ Every screen file has been read and analyzed
3. ✅ Every client method call has been documented
4. ✅ All parameters and options have been identified
5. ✅ All request/response data structures are documented per JSON:API conventions
6. ✅ Query parameters are properly categorized as standard vs implementation-specific
7. ✅ Backend API has been cross-referenced for validation
8. ✅ Three deliverable documents are complete and accurate
9. ✅ No grep searches return unanalyzed files
10. ✅ Documentation is clear and comprehensive

## Notes and Assumptions

- The analysis focuses on jsonapi-client usage; direct axios calls are out of scope except for OAuth
- OAuth login endpoint (`/oauth/token`) should be documented separately as it doesn't use jsonapi-client
- Some dynamic parameters may require educated guessing if tracing is too complex
- Test files can provide additional insights but are secondary to production code
- The backend API is the source of truth for validation

## Next Steps

After creating this plan:

1. Execute the analysis following the steps outlined above
2. Create the three deliverable documents in `/expo/docs/`
3. Review with stakeholders
4. Maintain documentation as the codebase evolves

---

**Plan Created**: 2025-11-02
**Repository**: Surely Todo App
**Target**: Expo app + jsonapi-client library
