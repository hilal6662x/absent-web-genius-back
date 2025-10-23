import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken, type AuthRequest } from "./middleware/auth";
import { 
  insertUserSchema, 
  loginSchema, 
  checkAttendanceSchema,
  type LoginCredentials 
} from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/register - Register a new user
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // Create user
      const user = await storage.createUser(validatedData);

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "7d",
      });

      // Return user info (without password) and token
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  // POST /api/login - Login user
  app.post("/api/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        validatedData.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: "Server configuration error" });
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "7d",
      });

      // Return user info (without password) and token
      const { password, ...userWithoutPassword } = user;
      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  // POST /api/attendance/check - Check in or check out
  app.post("/api/attendance/check", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const validatedData = checkAttendanceSchema.parse(req.body);
      const userId = req.userId!;

      if (validatedData.action === "check-in") {
        // Check if user is already checked in
        const activeCheckIn = await storage.getActiveCheckIn(userId);
        if (activeCheckIn) {
          return res.status(400).json({ 
            error: "You are already checked in",
            attendance: activeCheckIn
          });
        }

        // Create new check-in record
        const attendance = await storage.createAttendance({
          userId,
          checkIn: new Date(),
          checkOut: null,
          status: "checked-in",
        });

        res.status(201).json(attendance);
      } else {
        // Check out
        const activeCheckIn = await storage.getActiveCheckIn(userId);
        if (!activeCheckIn) {
          return res.status(400).json({ error: "You are not currently checked in" });
        }

        // Update attendance record with check-out time
        const updatedAttendance = await storage.updateAttendance(
          activeCheckIn.id,
          new Date()
        );

        res.json(updatedAttendance);
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Validation failed", details: error.errors });
      }
      console.error("Attendance check error:", error);
      res.status(500).json({ error: "Failed to process attendance" });
    }
  });

  // GET /api/attendance/me - Get current user's attendance history
  app.get("/api/attendance/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.userId!;
      const attendanceRecords = await storage.getUserAttendance(userId);

      res.json(attendanceRecords);
    } catch (error) {
      console.error("Get attendance error:", error);
      res.status(500).json({ error: "Failed to retrieve attendance records" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
