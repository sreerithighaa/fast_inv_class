# AI Coding Agent Instructions

## Project Overview
Fast Inventory Class is a Node.js inventory management application built with **Fastify** (web framework), **EJS** (templating), **PostgreSQL** (database), and **Bootstrap** (UI). It manages users with role-based access and uses client-side AJAX for form interactions.

## Architecture

### Server Structure
- **[server.js](../server.js)** - Main Fastify server. Registers static files via `@fastify/static`, EJS view engine via `@fastify/view`, and defines routes
- **[db/pool.js](../db/pool.js)** - PostgreSQL connection pool using `pg` library (hardcoded credentials: postgres/nickwilde on localhost:5432)
- **[db/db.sql](../db/db.sql)** - Schema with `users` and `roles` tables

### Data Flow
1. Client submits form from EJS template
2. Route handler (`server.js`) queries database via pool connection
3. Response passed to EJS view with data context
4. Views use Bootstrap classes (from CDN in header)
5. Client-side JS in `public/` handles AJAX interactions

### Templating Pattern
- **View root**: [views/](../views/)
- **Layout partials**: [views/partials/](../views/partials/) (header.ejs includes nav.ejs)
- **Include syntax**: `<%- include('./partials/header') %>` (use `<%-` for unescaped includes)
- **Data binding**: `<%= roles.forEach(...) %>` for iteration, `<%= variable %>` for output
- **Current user context**: All route handlers pass `currentUser: "daniel"` (hardcoded, needs parameterization)

## Critical Patterns & Conventions

### Route Handler Pattern
```javascript
fastify.get('/users', async(request, reply) => {
  const data = await pool.query('SELECT * FROM roles')
  try {
    return reply.view('users.ejs', { currentUser: "daniel", roles: data.rows })
  } catch(err) {
    console.error(err)
    return reply.status(500).send('Server Error')
  }
})
```
- Always use `async/await` for database queries
- Wrap in try/catch with status 500 on error
- Pass data objects to views using `reply.view()` second parameter

### Database Pattern
- Column names match form input `name` attributes (e.g., `user_name`, `passwords`, `role_id`)
- Use `pool.query()` returning `{ rows: [...] }` 
- Password field is named `passwords` (not `password`) - maintain this convention

### Static Files & Client-Side
- Public CSS/JS served from `public/` with `/public/` prefix
- [public/userajax.js](../public/userajax.js) is where AJAX handlers belong (currently empty)
- Bootstrap imported via CDN; no custom build step

## Development Workflow

### Setup
```bash
npm install
# Configure db/pool.js credentials if not using defaults
```

### Run Server
```bash
npm start          # Production: node server.js
npm run dev        # Development: nodemon with hot reload
```

### Database
- PostgreSQL must be running on localhost:5432 with database "postgres"
- Use [db/db.sql](../db/db.sql) to initialize schema

## Key Dependencies & Versions
- **fastify** ^5.6.2 - Web framework
- **@fastify/view** ^11.1.1 - View engine integration
- **@fastify/static** ^9.0.0 - Static file serving
- **@fastify/formbody** ^8.0.2 - Form parsing (registered but not shown in server.js)
- **ejs** ^4.0.1 - Template engine
- **pg** ^8.17.2 - PostgreSQL client
- **bcryptjs** ^3.0.3 - Password hashing (imported but not actively used yet)
- **nodemon** ^3.1.11 (dev) - Auto-reload on file changes

## Integration Points
- Forms in EJS post to routes defined in [server.js](../server.js) with method="POST"
- Database queries use async `pool.query()`; results available as `{ rows: [...] }`
- Partial templates must be included with `<%- include() %>` syntax
- Frontend AJAX calls expected in [public/userajax.js](../public/userajax.js) but currently empty

## Common Mistakes to Avoid
- Don't hardcode `currentUser: "daniel"` - this should come from session/auth
- Don't forget `async` keyword on route handlers that query DB
- Use `<%-` (unescaped) for includes, `<%=` (escaped) for user content
- Column naming must match: form `name` → SQL column
- Password hashing via bcryptjs is installed but not yet integrated into user creation
