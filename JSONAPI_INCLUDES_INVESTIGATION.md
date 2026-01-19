# JSON:API Includes Investigation

## Question
Does this repository rely on "includes" to query nested data from the JSON:API backend?

## Answer
**YES**, this repository does rely on the JSON:API "includes" feature to query nested related data.

## Open Source Library Used
- **Package**: `@codingitwrong/jsonapi-client`
- **Version**: ^0.0.11
- **Repository**: https://github.com/CodingItWrong/jsonapi-client
- **License**: Apache-2.0

## How Includes Work in @codingitwrong/jsonapi-client

According to the [source code](https://github.com/CodingItWrong/jsonapi-client/blob/main/src/ResourceClient.js), the library provides a lightweight wrapper around axios for JSON:API requests:

1. **Options Parameter**: All read methods (`all()`, `find()`, `where()`, `related()`) accept an optional `options` parameter
2. **Query String Conversion**: The `getOptionsQuery()` function converts the options object into URL query parameters:
   ```javascript
   const getOptionsQuery = (optionsObject = {}) =>
     Object.keys(optionsObject)
       .filter(k => typeof optionsObject[k] !== 'undefined')
       .map(k => `${k}=${encodeURIComponent(optionsObject[k])}`)
       .join('&');
   ```
3. **No Special Handling**: The `include` parameter is not specially handled - it's simply passed as a query parameter like any other option
4. **Example**: `{include: 'category'}` becomes `?include=category` in the HTTP request

## Usage in This Codebase

### Files Using Includes

#### 1. `src/screens/TodoDetail/index.js`
**Purpose**: Display and edit individual todo items with their associated category

**Usage in `loadTodo()` (line 40-44)**:
```javascript
const response = await todoClient.find({
  id,
  options: {include: 'category'},
});
```

**Usage in `handleSave()` (line 59-71)**:
```javascript
todoClient.update({
  id,
  attributes,
  relationships,
  options: {include: 'category'},
})
```

**Accessing included data (line 30)**:
```javascript
setCategory(response.included?.[0]);
```

#### 2. `src/screens/TodoList/Available.js`
**Purpose**: Display list of available todos grouped by category

**Usage in `loadAvailableTodos()` (line 12-17)**:
```javascript
todoClient
  .where({
    filter: {status: 'available'},
    options: {include: 'category'},
  })
  .then(todoResponse => ({todoGroups: groupByCategory(todoResponse)}))
```

#### 3. `src/screens/TodoList/Tomorrow.js`
**Purpose**: Display list of todos scheduled for tomorrow, grouped by category

**Usage in `loadTomorrowTodos()` (line 17-22)**:
```javascript
todoClient
  .where({
    filter: {status: 'tomorrow'},
    options: {include: 'category'},
  })
  .then(todoResponse => ({todoGroups: groupByCategory(todoResponse)}))
```

### Files NOT Using Includes

The following todo list screens do NOT use includes:
- `src/screens/TodoList/Future.js` - Groups by date instead of category
- `src/screens/TodoList/Completed.js` - Groups by completion date
- `src/screens/TodoList/Deleted.js` - Groups by deletion date

## JSON:API Spec Compliance

This implementation follows the [JSON:API specification](https://jsonapi.org/format/#fetching-includes) for compound documents:

1. **Request**: Client sends `?include=category` as a query parameter
2. **Response**: Server returns:
   - Primary data in the `data` field
   - Related resources in the `included` array
3. **Format**: Each included resource follows the JSON:API resource object format with `type`, `id`, and `attributes`

## Example Request/Response

**Request**:
```
GET /todos/123?include=category
```

**Response** (JSON:API format):
```json
{
  "data": {
    "type": "todos",
    "id": "123",
    "attributes": {
      "name": "Buy groceries",
      "status": "available"
    },
    "relationships": {
      "category": {
        "data": {"type": "categories", "id": "456"}
      }
    }
  },
  "included": [
    {
      "type": "categories",
      "id": "456",
      "attributes": {
        "name": "Shopping"
      }
    }
  ]
}
```

## Benefits of Using Includes

1. **Reduced Network Requests**: Fetch related data in a single request instead of multiple round trips
2. **Performance**: Especially important for mobile apps where network latency matters
3. **Consistency**: Data returned in a single transaction, avoiding race conditions
4. **Spec Compliance**: Follows JSON:API best practices for related resources

## Testing Evidence

The test files confirm this usage pattern:
- `src/screens/TodoDetail/index.spec.js` - Mocks requests with `?include=category`
- `src/screens/TodoList/Available.spec.js` - Tests expect `included` array in response
- `src/screens/TodoList/Tomorrow.spec.js` - Verifies category data from `included`

Example from `TodoDetail/index.spec.js` (line 40):
```javascript
.get(`/todos/${todoId}?include=category`)
```

Example from `Tomorrow.spec.js` (line 71):
```javascript
const response = {data: [todo], included: [category]};
```

## Conclusion

This repository actively uses the JSON:API "includes" feature through the `@codingitwrong/jsonapi-client` library to efficiently fetch related category data alongside todos. The library handles this by simply passing the `include` option as a query parameter, and the application code accesses the related data from the `included` array in the response.
