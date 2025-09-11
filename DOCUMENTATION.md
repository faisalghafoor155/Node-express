# Natours Node.js Project Documentation

## Overview

This project is a Node.js RESTful API for a tours application called **Natours**. It uses Express.js for the server, MongoDB with Mongoose for the database, and follows the MVC (Model-View-Controller) pattern.

---

## Main Features & Functionality

### 1. Tour Management

- **Create Tour**: Add a new tour to the database via POST request.
- **Get All Tours**: Retrieve all tours, with support for advanced filtering, sorting, field limiting, and pagination.
- **Get Single Tour**: Retrieve details of a specific tour by its ID.
- **Update Tour**: Update details of a tour by its ID.
- **Delete Tour**: Remove a tour from the database by its ID.

### 2. User Management

- **Create User**: Add a new user (if implemented in userController).
- **Get All Users**: Retrieve all users (if implemented).
- **User Authentication**: (If implemented) Handles user login and authentication.

### 3. Data Import/Export

- **Import Data**: Use the `import-dev-data.js` script to bulk import tours from a JSON file.
- **Delete Data**: Use the same script to bulk delete all tours from the database.

### 4. Middleware

- **Logging**: Uses `morgan` for request logging in development mode.
- **Static Files**: Serves static files from the `public` directory.
- **Custom Middleware**: Adds request time and logs custom messages for each request.

### 5. Advanced Query Features

- **Filtering**: Supports MongoDB operators (gte, gt, lte, lt) for filtering tours (e.g., `/api/v1/tours?duration[gte]=5`).
- **Sorting**: Sort results by fields (e.g., `/api/v1/tours?sort=price`).
- **Field Limiting**: Select specific fields to return (e.g., `/api/v1/tours?fields=name,price`).
- **Pagination**: Paginate results (e.g., `/api/v1/tours?page=2&limit=10`).

---

## Project Structure

- `app.js`: Main Express app setup and middleware.
- `server.js`: Entry point, connects to MongoDB and starts the server.
- `models/`: Mongoose schemas and models (e.g., `tourModel.js`).
- `controller/`: Route handlers for tours and users.
- `routes/`: Express routers for tours and users.
- `dev-data/`: Sample data and scripts for importing/deleting data.
- `public/`: Static assets (HTML, CSS, images).
- `templates/`: Pug templates for server-side rendering (if used).
- `config.env`: Environment variables (database URIs, passwords, etc.).

---

## How to Run

1. Install dependencies: `npm install`
2. Set up your `.env` file (see `config.env` for example)
3. Start MongoDB (local or Atlas)
4. Run the server: `npm start` or `node server.js`
5. Import data (optional): `node dev-data/data/import-dev-data.js --import`

---

## API Endpoints

- `GET /api/v1/tours` — Get all tours (with filtering, sorting, etc.)
- `GET /api/v1/tours/:id` — Get a single tour
- `POST /api/v1/tours` — Create a new tour
- `PATCH /api/v1/tours/:id` — Update a tour
- `DELETE /api/v1/tours/:id` — Delete a tour
- `GET /api/v1/users` — Get all users (if implemented)

---

## Notes

- Make sure to whitelist your IP in MongoDB Atlas if using a cloud database.
- Use Postman or similar tools to test API endpoints.
- Error handling and validation are implemented in controllers.

---

## Author

- Project by Faisal Ghafoor (or your name)

## Recent work / Updates (2025-09-11)

- Updated models/tourModel.js:
  - Removed duplicate `secretTour` field.
  - Fixed `createdAt` default to use `Date.now` (function) so timestamp is set at creation.
  - Added `slug` field and pre-save middleware to generate URL-friendly slugs.
  - Improved `name` validation to allow spaces and common punctuation.
  - Added an index on `name` for uniqueness at the database level.
  - Added aggregate middleware guard (skips injecting match when pipeline starts with $geoNear).
  - Noted that `priceDiscount` validator only runs on document creation (save/create), not on update queries.

- Logging cleanup: reduced noisy logs while keeping query timing output.

- Action items:
  - Ensure `slugify` and `validator` are installed: `npm install slugify validator`
  - If you need price-discount validation on updates, consider adding pre `findOneAndUpdate` middleware or validate in controller logic.

---

If you want, I can:

- commit this change to the file, or
- create a short changelog file instead.
  Which do you
