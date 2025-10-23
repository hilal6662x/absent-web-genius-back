import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendance = pgTable("attendance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out"),
  status: text("status").notNull(), // 'checked-in' or 'checked-out'
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
}).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const checkAttendanceSchema = z.object({
  action: z.enum(["check-in", "check-out"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = Omit<Attendance, "id">;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type CheckAttendanceAction = z.infer<typeof checkAttendanceSchema>;
