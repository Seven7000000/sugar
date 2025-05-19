import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, doublePrecision, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table - adapted for both direct auth and Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Can be generated UUID or Replit Auth ID
  username: varchar("username").notNull(), 
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // Hashed password for direct authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  authProvider: varchar("auth_provider").default("email").notNull(), // 'email', 'google', 'replit'
  isPremium: boolean("is_premium").default(false).notNull(),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("inactive"),
  subscriptionPlan: varchar("subscription_plan"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id").notNull(),
  stripePriceId: varchar("stripe_price_id").notNull(),
  status: varchar("status").notNull(), // 'active', 'canceled', 'past_due', etc.
  planName: varchar("plan_name").notNull(), // 'monthly', 'annual'
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment History table
export const paymentHistory = pgTable("payment_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  stripeInvoiceId: varchar("stripe_invoice_id").notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: varchar("currency").notNull(),
  status: varchar("status").notNull(), // 'paid', 'unpaid', 'refunded', etc.
  invoiceUrl: varchar("invoice_url"), // URL to the hosted invoice PDF
  description: text("description"),
  paymentDate: timestamp("payment_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User's dietary preferences
export const dietaryPreferences = pgTable("dietary_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  preference: text("preference").notNull(),
});

// Recipes table
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  prepTime: integer("prep_time").notNull(), // in minutes
  cookTime: integer("cook_time").notNull(), // in minutes
  totalTime: integer("total_time").notNull(), // in minutes
  servings: integer("servings").notNull(),
  difficulty: text("difficulty").notNull(), // 'Easy', 'Medium', 'Advanced'
  cuisine: text("cuisine").notNull(),
  mealType: text("meal_type").notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  chef: text("chef").notNull(),
  chefNotes: text("chef_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Ingredients table
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit").notNull(),
});

// Instructions table
export const instructions = pgTable("instructions", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  order: integer("order").notNull(),
  text: text("text").notNull(),
});

// Tags table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Recipe Tags join table
export const recipeTags = pgTable("recipe_tags", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  tagId: integer("tag_id").references(() => tags.id, { onDelete: "cascade" }).notNull(),
});

// Nutritional Info table
export const nutritionalInfo = pgTable("nutritional_info", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).unique().notNull(),
  calories: integer("calories").notNull(),
  protein: doublePrecision("protein").notNull(), // in grams
  carbs: doublePrecision("carbs").notNull(), // in grams
  fat: doublePrecision("fat").notNull(), // in grams
  fiber: doublePrecision("fiber").notNull(), // in grams
  sugar: doublePrecision("sugar").notNull(), // in grams
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  slug: text("slug").notNull().unique(),
});

// Recipe Categories join table
export const recipeCategories = pgTable("recipe_categories", {
  id: serial("id").primaryKey(),
  recipeId: integer("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
});

// Saved Recipes table
export const savedRecipes = pgTable("saved_recipes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  recipeId: integer("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Meal Plans table
export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Meal Plan Items table
export const mealPlanItems = pgTable("meal_plan_items", {
  id: serial("id").primaryKey(),
  mealPlanId: integer("meal_plan_id").references(() => mealPlans.id, { onDelete: "cascade" }).notNull(),
  recipeId: integer("recipe_id").references(() => recipes.id, { onDelete: "cascade" }).notNull(),
  date: timestamp("date").notNull(),
  mealType: text("meal_type").notNull(), // 'breakfast', 'lunch', 'dinner', 'snack'
  notes: text("notes"),
  servings: integer("servings").default(1).notNull(),
});

// Shopping Lists table
export const shoppingLists = pgTable("shopping_lists", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Shopping List Items table
export const shoppingListItems = pgTable("shopping_list_items", {
  id: serial("id").primaryKey(),
  shoppingListId: integer("shopping_list_id").references(() => shoppingLists.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  quantity: text("quantity").notNull(),
  unit: text("unit"),
  category: text("category").default("Other"),
  checked: boolean("checked").default(false).notNull(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  dietaryPreferences: many(dietaryPreferences),
  savedRecipes: many(savedRecipes),
  mealPlans: many(mealPlans),
  shoppingLists: many(shoppingLists),
  subscriptions: many(subscriptions),
  payments: many(paymentHistory),
}));

export const recipesRelations = relations(recipes, ({ many, one }) => ({
  ingredients: many(ingredients),
  instructions: many(instructions),
  tags: many(recipeTags),
  categories: many(recipeCategories),
  nutritionalInfo: one(nutritionalInfo),
  savedBy: many(savedRecipes),
  mealPlanItems: many(mealPlanItems),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  recipes: many(recipeTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  recipes: many(recipeCategories),
}));

export const mealPlansRelations = relations(mealPlans, ({ many }) => ({
  items: many(mealPlanItems),
}));

export const shoppingListsRelations = relations(shoppingLists, ({ many }) => ({
  items: many(shoppingListItems),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const paymentHistoryRelations = relations(paymentHistory, ({ one }) => ({
  user: one(users, {
    fields: [paymentHistory.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  isPremium: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  subscriptionStatus: true,
  subscriptionPlan: true,
  subscriptionEndDate: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertRecipeSchema = createInsertSchema(recipes).pick({
  title: true,
  description: true,
  imageUrl: true,
  prepTime: true,
  cookTime: true,
  totalTime: true,
  servings: true,
  difficulty: true,
  cuisine: true,
  mealType: true,
  isPremium: true,
  chef: true,
  chefNotes: true,
});

export const insertIngredientSchema = createInsertSchema(ingredients).pick({
  recipeId: true,
  name: true,
  quantity: true,
  unit: true,
});

export const insertInstructionSchema = createInsertSchema(instructions).pick({
  recipeId: true,
  order: true,
  text: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  imageUrl: true,
  slug: true,
});

export const insertNutritionalInfoSchema = createInsertSchema(nutritionalInfo).pick({
  recipeId: true,
  calories: true,
  protein: true,
  carbs: true,
  fat: true,
  fiber: true,
  sugar: true,
});

// Subscription schema
export const insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  stripeSubscriptionId: true,
  stripePriceId: true,
  status: true,
  planName: true,
  currentPeriodStart: true,
  currentPeriodEnd: true,
  cancelAtPeriodEnd: true,
});

// Payment history schema
export const insertPaymentHistorySchema = createInsertSchema(paymentHistory).pick({
  userId: true,
  stripeInvoiceId: true,
  amount: true,
  currency: true,
  status: true,
  invoiceUrl: true,
  description: true,
  paymentDate: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

export type InsertInstruction = z.infer<typeof insertInstructionSchema>;
export type Instruction = typeof instructions.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertNutritionalInfo = z.infer<typeof insertNutritionalInfoSchema>;
export type NutritionalInfo = typeof nutritionalInfo.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertPaymentHistory = z.infer<typeof insertPaymentHistorySchema>;
export type PaymentHistory = typeof paymentHistory.$inferSelect;
