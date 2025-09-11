# Main Topics Covered — Natours Project

This file lists the main topics you have practiced / completed while working on the Natours codebase.

## Core Node & Tooling

- Node.js runtime and npm package management
- Environment variables (.env / config.env)
- Project structure conventions (controllers, models, routes, dev-data, public)

## Server & Framework

- Express app setup (app.js)
- Server start & DB connect (server.js)
- Serving static files (public/)

## Database & ORM

- MongoDB basics (local / Atlas)
- Mongoose models and schemas (models/tourModel.js)
  - Schema types and options
  - Default values, select, required, unique
  - Indexes (schema.index)

## Schema Validation & Utilities

- Field validators (built-in and custom)
- Using validator and slugify packages
- Virtual properties (virtuals: durationWeek)
- Caveat: priceDiscount validator runs on create/save but not on findOneAndUpdate

## Mongoose Middleware

- Document middleware (pre/post save)
- Query middleware (pre/post find)
- Aggregate middleware (pre aggregate)
- Measuring query time and excluding secret documents by default

## REST API Concepts

- CRUD endpoints for tours (routes + controllers)
- Advanced query features:
  - Filtering (gte, gt, lte, lt)
  - Sorting
  - Field limiting (select)
  - Pagination

## Dev & Data Utilities

- Import / delete seed data (dev-data/import-dev-data.js)
- Morgan logging for development
- Minimal custom middleware (request time, simple logs)

## Best Practices Demonstrated

- MVC-style organization
- Keep sensitive fields out of API responses (select: false)
- Use DB-level unique index in addition to schema `unique`
- Avoid noisy logs but keep useful timing info

## Next / Optional Topics to Add

- Full user auth (signup/login, JWT)
- Validation on update (priceDiscount during updates)
- Unit / integration tests (Jest, Supertest)
- Request validation (Joi or express-validator)
- CI/CD and deployment steps
- API documentation (Swagger / OpenAPI)

If you want, I can:

- commit this file to the repo, or
- generate a short checklist to track completion per topic.
  Which do you
