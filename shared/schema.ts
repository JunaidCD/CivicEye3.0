import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  points: integer("points").default(0),
  rank: integer("rank").default(0),
  badge: text("badge").default("Newcomer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  propertyType: text("property_type").notNull(),
  status: text("status").notNull().default("Reported"),
  vacancyScore: integer("vacancy_score").default(0),
  reportCount: integer("report_count").default(0),
  lastUtilityReading: timestamp("last_utility_reading"),
  estimatedTaxLoss: decimal("estimated_tax_loss", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  userId: integer("user_id").references(() => users.id),
  reason: text("reason").notNull(),
  duration: text("duration").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  points: integer("points").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

export const taxNotices = pgTable("tax_notices", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id),
  penaltyType: text("penalty_type").notNull(),
  penaltyAmount: decimal("penalty_amount", { precision: 10, scale: 2 }),
  dueDate: timestamp("due_date"),
  transactionHash: text("transaction_hash"),
  status: text("status").default("Pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertPropertySchema = createInsertSchema(properties).pick({
  address: true,
  latitude: true,
  longitude: true,
  propertyType: true,
  estimatedTaxLoss: true,
});

export const insertReportSchema = createInsertSchema(reports).pick({
  propertyId: true,
  reason: true,
  duration: true,
  description: true,
  imageUrl: true,
  contactName: true,
  contactEmail: true,
});

export const insertTaxNoticeSchema = createInsertSchema(taxNotices).pick({
  propertyId: true,
  penaltyType: true,
  penaltyAmount: true,
  dueDate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertTaxNotice = z.infer<typeof insertTaxNoticeSchema>;
export type TaxNotice = typeof taxNotices.$inferSelect;
