# Web Attendance System API

A backend API for managing user attendance with check-in/check-out functionality, built with Node.js, Express, and Supabase.

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Attendance Management**: Check-in and check-out tracking
- **Attendance History**: View complete attendance records
- **Secure**: Password hashing with bcrypt, JWT authentication
- **CORS Enabled**: Ready for React + Vite frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Add the following secrets to your Replit project (or create a `.env` file locally):

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase anonymous/public API key
- `JWT_SECRET`: A secure random string for JWT signing

### 3. Set Up Supabase Database

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create attendance table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  check_in TIMESTAMP NOT NULL,
  check_out TIMESTAMP,
  status TEXT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_attendance_user_id ON attendance(user_id);
CREATE INDEX idx_attendance_status ON attendance(status);
```

### 4. Start the Server

```bash
npm run dev
```

The server will run on **port 4000** by default.

## API Endpoints

### Authentication

#### Register User
```
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2025-10-23T12:00:00Z"
  },
  "token": "jwt_token_here"
}
```

#### Login
```
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2025-10-23T12:00:00Z"
  },
  "token": "jwt_token_here"
}
```

### Attendance (Protected Routes)

All attendance endpoints require an `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

#### Check In/Out
```
POST /api/attendance/check
Content-Type: application/json
Authorization: Bearer <token>

{
  "action": "check-in"  // or "check-out"
}

Response (Check-in):
{
  "id": "uuid",
  "userId": "uuid",
  "checkIn": "2025-10-23T09:00:00Z",
  "checkOut": null,
  "status": "checked-in"
}

Response (Check-out):
{
  "id": "uuid",
  "userId": "uuid",
  "checkIn": "2025-10-23T09:00:00Z",
  "checkOut": "2025-10-23T17:00:00Z",
  "status": "checked-out"
}
```

#### Get Attendance History
```
GET /api/attendance/me
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "userId": "uuid",
    "checkIn": "2025-10-23T09:00:00Z",
    "checkOut": "2025-10-23T17:00:00Z",
    "status": "checked-out"
  },
  ...
]
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad request (validation error)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (token expired)
- `500`: Server error

## CORS Configuration

CORS is enabled for:
- Development: `http://localhost:5000`, `http://localhost:4000`
- Production: Set `FRONTEND_URL` environment variable

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT authentication with 7-day expiration
- ✅ Input validation with Zod
- ✅ SQL injection protection via Supabase client
- ✅ Secure environment variable management

## Project Structure

```
├── server/
│   ├── index.ts          # Server entry point with CORS
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Supabase storage layer
│   └── middleware/
│       └── auth.ts       # JWT authentication middleware
├── shared/
│   └── schema.ts         # Shared types and validation schemas
└── .env.example          # Environment variable template
```

## Development

The API uses TypeScript and includes:
- Type-safe database operations
- Zod validation schemas
- Shared types between frontend/backend
- Request/response logging

## License

MIT
