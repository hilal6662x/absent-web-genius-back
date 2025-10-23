import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { type User, type InsertUser, type Attendance, type InsertAttendance } from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Attendance operations
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, checkOut: Date): Promise<Attendance | undefined>;
  getUserAttendance(userId: string): Promise<Attendance[]>;
  getActiveCheckIn(userId: string): Promise<Attendance | undefined>;
}

// Helper to convert Supabase row to User type
function mapSupabaseUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    fullName: row.full_name,
    createdAt: new Date(row.created_at),
  };
}

// Helper to convert Supabase row to Attendance type
function mapSupabaseAttendance(row: any): Attendance {
  return {
    id: row.id,
    userId: row.user_id,
    checkIn: new Date(row.check_in),
    checkOut: row.check_out ? new Date(row.check_out) : null,
    status: row.status,
  };
}

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL and SUPABASE_KEY must be set in environment variables");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return undefined;
    return mapSupabaseUser(data);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) return undefined;
    return mapSupabaseUser(data);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);

    const { data, error } = await this.supabase
      .from("users")
      .insert({
        email: insertUser.email,
        password: hashedPassword,
        full_name: insertUser.fullName,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return mapSupabaseUser(data);
  }

  async createAttendance(attendance: InsertAttendance): Promise<Attendance> {
    const { data, error } = await this.supabase
      .from("attendance")
      .insert({
        user_id: attendance.userId,
        check_in: attendance.checkIn.toISOString(),
        check_out: attendance.checkOut ? attendance.checkOut.toISOString() : null,
        status: attendance.status,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create attendance: ${error.message}`);
    }

    return mapSupabaseAttendance(data);
  }

  async updateAttendance(id: string, checkOut: Date): Promise<Attendance | undefined> {
    const { data, error } = await this.supabase
      .from("attendance")
      .update({
        check_out: checkOut.toISOString(),
        status: "checked-out",
      })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return undefined;
    return mapSupabaseAttendance(data);
  }

  async getUserAttendance(userId: string): Promise<Attendance[]> {
    const { data, error } = await this.supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .order("check_in", { ascending: false });

    if (error || !data) return [];
    return data.map(mapSupabaseAttendance);
  }

  async getActiveCheckIn(userId: string): Promise<Attendance | undefined> {
    const { data, error } = await this.supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "checked-in")
      .is("check_out", null)
      .order("check_in", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return undefined;
    return mapSupabaseAttendance(data);
  }
}

export const storage = new SupabaseStorage();
