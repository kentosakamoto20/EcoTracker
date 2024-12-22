import { pgTable, text, serial, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const owners = pgTable("owners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => owners.id),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  birthDate: timestamp("birth_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const diseases = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  description: text("description"),
});

export const examinations = pgTable("examinations", {
  id: serial("id").primaryKey(),
  petId: integer("pet_id").references(() => pets.id),
  diseaseId: integer("disease_id").references(() => diseases.id),
  examinationDate: timestamp("examination_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const examinationMedications = pgTable("examination_medications", {
  id: serial("id").primaryKey(),
  examinationId: integer("examination_id").references(() => examinations.id),
  medicationId: integer("medication_id").references(() => medications.id),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => owners.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paid: boolean("paid").default(false),
  dueDate: timestamp("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const ownersRelations = relations(owners, ({ many }) => ({
  pets: many(pets),
  invoices: many(invoices),
}));

export const petsRelations = relations(pets, ({ one, many }) => ({
  owner: one(owners, {
    fields: [pets.ownerId],
    references: [owners.id],
  }),
  examinations: many(examinations),
}));

export const examinationsRelations = relations(examinations, ({ one, many }) => ({
  pet: one(pets, {
    fields: [examinations.petId],
    references: [pets.id],
  }),
  disease: one(diseases, {
    fields: [examinations.diseaseId],
    references: [diseases.id],
  }),
  medications: many(examinationMedications),
}));

// Schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertOwnerSchema = createInsertSchema(owners);
export const selectOwnerSchema = createSelectSchema(owners);

export const insertPetSchema = createInsertSchema(pets);
export const selectPetSchema = createSelectSchema(pets);

export const insertDiseaseSchema = createInsertSchema(diseases);
export const selectDiseaseSchema = createSelectSchema(diseases);

export const insertMedicationSchema = createInsertSchema(medications);
export const selectMedicationSchema = createSelectSchema(medications);

export const insertExaminationSchema = createInsertSchema(examinations);
export const selectExaminationSchema = createSelectSchema(examinations);

export const insertInvoiceSchema = createInsertSchema(invoices);
export const selectInvoiceSchema = createSelectSchema(invoices);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = User; // Add this alias for compatibility

export type Owner = typeof owners.$inferSelect;
export type InsertOwner = typeof owners.$inferInsert;

export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;

export type Disease = typeof diseases.$inferSelect;
export type InsertDisease = typeof diseases.$inferInsert;

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = typeof medications.$inferInsert;

export type Examination = typeof examinations.$inferSelect;
export type InsertExamination = typeof examinations.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;
