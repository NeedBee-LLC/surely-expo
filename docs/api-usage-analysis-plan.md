# API Usage Analysis Plan

## Overview

This document outlines the plan to comprehensively analyze how the Surely expo app uses the jsonapi-client library to make API requests. The goal is to produce a complete inventory of all API endpoints used, the parameters passed to them, and the data they send and receive.

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
   - For `find()`: how IDs are obtained, what options
   - For `where()`: what filter keys/values, what options
   - For `related()`: what parent objects, what relationships, what options
   - For `create()`: what attributes, what relationships
   - For `update()`: what attributes, what relationships
   - For `delete()`: just the ID
3. **Context of the call**: when/why it's triggered (load, button click, form submit, etc.)
4. **What happens with the response**: how data is used/displayed

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
```markdown
# API Endpoint Inventory

## Todos Resource

### GET /todos
**Usage**: Load all available todos
**Called from**: Available.js, Tomorrow.js, etc.
**Query Parameters**:
- filter[...]: ...
- include: ...
- sort: ...
**Response**: Array of todo objects with attributes...

### GET /todos/:id
...

### POST /todos
**Usage**: Create new todo
**Called from**: DetailForm.js
**Request Body**:
{
  data: {
    type: "todos",
    attributes: {
      title: string,
      notes: string,
      ...
    },
    relationships: {
      category: {
        data: { type: "categories", id: string }
      }
    }
  }
}
**Response**: Created todo object

[Continue for all endpoints...]
```

### Secondary Output: Usage Matrix

**File**: `/expo/docs/usage-matrix.md`

A cross-reference showing which screens use which endpoints:

```markdown
| Screen | Resource | Methods Used | Purpose |
|--------|----------|--------------|---------|
| Available.js | todos | all, create, update | Show and manage available todos |
| ...
```

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

- **Phase 1** (Map usage sites): Already complete via grep
- **Phase 2** (Extract method calls): Reading and analyzing 12 files
- **Phase 3** (Document data structures): Synthesizing from Phase 2
- **Phase 4** (Map to backend): Reading Rails API files
- **Phase 5** (Create inventory): Compiling all findings
- **Phase 6** (Review): Final validation

**Total effort**: Thorough analysis of 12+ frontend files, backend validation, and comprehensive documentation

## Success Criteria

The analysis is complete when:

1. ✅ Every screen file has been read and analyzed
2. ✅ Every client method call has been documented
3. ✅ All parameters and options have been identified
4. ✅ All request/response data structures are documented
5. ✅ Backend API has been cross-referenced for validation
6. ✅ Three deliverable documents are complete and accurate
7. ✅ No grep searches return unanalyzed files
8. ✅ Documentation is clear and comprehensive

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

