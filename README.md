# swift-backend

---

# User API with MongoDB, JSONPlaceholder, and Bonus Features

## Overview

This project is a RESTful API built with **Express**, **MongoDB**, and **TypeScript**, which pulls user, post, and comment data from the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/), stores it in MongoDB, and provides several endpoints for managing and retrieving user data.

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB
- **HTTP Client:** Axios
- **Caching:** node-cache

---

## 🚀 Features

- Load and persist users, posts, and comments from JSONPlaceholder.
- CRUD operations for users.
- Retrieve full user data including posts and comments.
- **Bonus Features**:

  - ✅ Pagination on `/users`
  - ✅ Sorting users by any field
  - ✅ Caching of `/users/:userId` responses to reduce database load

---

## 📁 Folder Structure (Simplified)

```
src/
│
├── controllers/
│   └── userController.ts      # All route logic
│
├── routes/
│   └── userRoutes.ts          # All route definitions
│
├── models/
│   └── User.ts                # User type/interface
│
├── db.ts                      # MongoDB connection
└── index.ts                   # Express app entry point
```

---

## 🧪 API Endpoints

### 1. `GET /load`

- **Description:** Loads data from JSONPlaceholder and stores it in MongoDB.
- **Response:** `200 OK` on success

---

### 2. `GET /users`

- **Description:** Returns paginated and sorted list of users.
- **Query Parameters:**

  - `page` (default: 1)
  - `limit` (default: 10)
  - `sortBy` (default: `name`)
  - `order` (`asc` or `desc`)

- **Response:**

  ```json
  {
    "totalUsers": 10,
    "currentPage": 1,
    "totalPages": 1,
    "users": [ ... ]
  }
  ```

---

### 3. `GET /users/:userId`

- **Description:** Returns a specific user with all their posts and comments.
- **Response:**

  ```json
  {
    "fromCache": false,
    "data": {
      "id": 1,
      "name": "Leanne Graham",
      ...
      "posts": [
        {
          "id": 1,
          "title": "...",
          "body": "...",
          "comments": [ ... ]
        }
      ]
    }
  }
  ```

---

### 4. `PUT /users`

- **Description:** Add a new user manually.
- **Body:**

  ```json
  {
    "id": 11,
    "name": "John Doe",
    "username": "johnd",
    "email": "john@example.com",
    ...
    "posts": [ { "id": 101, "title": "...", "comments": [] } ]
  }
  ```

- **Responses:**

  - `201 Created` if added
  - `400 Bad Request` if user already exists

---

### 5. `DELETE /users`

- **Description:** Deletes all users.
- **Response:**

  ```json
  { "message": "All users deleted successfully." }
  ```

---

### 6. `DELETE /users/:userId`

- **Description:** Deletes a user by ID.
- **Response:**

  ```json
  { "message": "User deleted successfully." }
  ```

---

## ⚡ Bonus Features

| Feature    | Endpoint         | Description                   |
| ---------- | ---------------- | ----------------------------- |
| Pagination | `GET /users`     | Add `?page=2&limit=5`         |
| Sorting    | `GET /users`     | Add `?sortBy=name&order=desc` |
| Caching    | `GET /users/:id` | Cached for 60 seconds         |

---

## 🧰 Setup Instructions

1. **Clone repo**

   ```bash
   git clone <your-repo-url>
   cd your-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start MongoDB locally** (or use a cloud Mongo URI)

4. **Create `.env`**

   ```
   MONGO_URI=mongodb://localhost:27017/user-api
   ```

5. **Run the app**

   ```bash
   npm run dev
   ```

---

## 📎 Dependencies

```bash
express
axios
mongodb
dotenv
node-cache
```

---

## ✅ Future Improvements

- Add Swagger documentation
- Add authentication (JWT)
- Add tests with Jest or Mocha

---

Would you like this as a downloadable README file? I can generate one for you.
