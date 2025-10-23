# Deployment Guide - Attendance System API

## ✅ Completed Backend API

Your attendance system backend is fully implemented and ready to use!

### What's Been Built

1. **User Authentication System**
   - Registration endpoint with email validation
   - Login endpoint with JWT token generation
   - Secure password hashing with bcrypt
   - 7-day token expiration

2. **Attendance Management**
   - Check-in endpoint (creates new attendance record)
   - Check-out endpoint (updates existing record)
   - Attendance history retrieval
   - Active session detection (prevents duplicate check-ins)

3. **Security Features**
   - JWT authentication middleware
   - Password hashing (10 rounds bcrypt)
   - Input validation with Zod schemas
   - CORS configuration for frontend
   - Environment variable management

4. **Database Integration**
   - Supabase PostgreSQL integration
   - Type-safe storage layer
   - Proper snake_case to camelCase mapping
   - Efficient queries with indexes

## 🚀 Quick Start

### 1. Set Up Supabase Database

Run the SQL script in your Supabase SQL Editor:

```bash
# The SQL is in SUPABASE_SETUP.sql
```

This creates:
- `users` table (id, email, password, full_name, created_at)
- `attendance` table (id, user_id, check_in, check_out, status)
- Indexes for performance
- Row-level security policies

### 2. Configure Environment Variables

The following secrets are already configured in Replit:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_KEY`
- ✅ `JWT_SECRET`

### 3. Server is Running

The API is currently running on **port 5000** (Replit's default).

**Note about Port 4000**: On Replit, the frontend and backend share the same server on port 5000 (the only exposed port). The backend handles `/api/*` routes while Vite serves the frontend on all other routes. This is the recommended Replit architecture.

## 📡 API Endpoints

All endpoints return JSON responses.

### Public Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Success Response (201)**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2025-10-23T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200)**: Same as registration

### Protected Endpoints

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

#### Check In
```http
POST /api/attendance/check
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "check-in"
}
```

**Success Response (201)**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "checkIn": "2025-10-23T09:00:00.000Z",
  "checkOut": null,
  "status": "checked-in"
}
```

#### Check Out
```http
POST /api/attendance/check
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "check-out"
}
```

**Success Response (200)**:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "checkIn": "2025-10-23T09:00:00.000Z",
  "checkOut": "2025-10-23T17:00:00.000Z",
  "status": "checked-out"
}
```

#### Get Attendance History
```http
GET /api/attendance/me
Authorization: Bearer <token>
```

**Success Response (200)**:
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "checkIn": "2025-10-23T09:00:00.000Z",
    "checkOut": "2025-10-23T17:00:00.000Z",
    "status": "checked-out"
  }
]
```

## 🧪 Testing the API

### Option 1: Using curl

```bash
# Register
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'

# Login (save the token)
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Check in (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/attendance/check \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action":"check-in"}'

# Get attendance history
curl -X GET http://localhost:5000/api/attendance/me \
  -H "Authorization: Bearer TOKEN"
```

### Option 2: Using test-api.http

Open `test-api.http` in VS Code with REST Client extension for interactive testing.

### Option 3: From React Frontend

```javascript
// Register/Login
const response = await fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    fullName: 'John Doe'
  })
});
const { user, token } = await response.json();

// Store token in localStorage
localStorage.setItem('token', token);

// Check in
const checkInResponse = await fetch('/api/attendance/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ action: 'check-in' })
});
```

## 📁 Project Structure

```
├── server/
│   ├── index.ts              # Main server with CORS, port config
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # Supabase integration
│   └── middleware/
│       └── auth.ts           # JWT authentication
├── shared/
│   └── schema.ts             # Shared TypeScript types & Zod schemas
├── SUPABASE_SETUP.sql        # Database setup script
├── .env.example              # Environment template
├── test-api.http             # API testing file
└── README.md                 # Full documentation
```

## 🔒 Security Checklist

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ Input validation with Zod
- ✅ SQL injection protection (Supabase client)
- ✅ CORS configured
- ✅ Secrets in environment variables
- ✅ Password never returned in responses

## 🎯 Next Steps for Frontend Integration

1. **Install axios or use fetch** in your React app
2. **Store JWT token** in localStorage after login/register
3. **Add Authorization header** to all protected requests
4. **Handle 401/403 errors** by redirecting to login
5. **Use the shared types** from `@shared/schema` for type safety

Example React hook:
```typescript
import { useQuery } from '@tanstack/react-query';

function useAttendanceHistory() {
  return useQuery({
    queryKey: ['/api/attendance/me'],
    // queryClient is pre-configured to add auth headers
  });
}
```

## 🚀 Ready for Production

To deploy this API to production:

1. Set environment variables in your hosting platform
2. Update CORS `FRONTEND_URL` to your production domain
3. Ensure Supabase is in production mode
4. Consider rate limiting and monitoring
5. Set up SSL/TLS (HTTPS)

---

**🎉 Your attendance system backend is complete and ready to connect with your React frontend!**
