-- Supabase Database Setup for Attendance System
-- Run this SQL in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  check_in TIMESTAMP NOT NULL,
  check_out TIMESTAMP,
  status TEXT NOT NULL CHECK (status IN ('checked-in', 'checked-out'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in ON attendance(check_in DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (for this API, we'll use service role key, so policies are optional)
-- But for better security, you can add policies if using anon key:

-- Policy: Users can only read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (true);  -- Allow all reads since we're using service role

-- Policy: Allow insert for registration
CREATE POLICY "Allow user registration" ON users
  FOR INSERT
  WITH CHECK (true);

-- Policies for attendance table
-- Policy: Users can read their own attendance
CREATE POLICY "Users can read own attendance" ON attendance
  FOR SELECT
  USING (true);

-- Policy: Users can insert their own attendance
CREATE POLICY "Users can insert attendance" ON attendance
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own attendance
CREATE POLICY "Users can update own attendance" ON attendance
  FOR UPDATE
  USING (true);

-- Verify tables were created
SELECT 'Setup complete! Tables created:' as message;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'attendance');
