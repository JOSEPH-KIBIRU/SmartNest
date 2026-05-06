import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    nameSwahili: v.string(),
    slug: v.string(),
    icon: v.optional(v.string()),
    description: v.optional(v.string()),
    sortOrder: v.number(),
  }).index("by_slug", ["slug"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    categoryId: v.id("categories"),
    images: v.array(v.string()),
    attributes: v.optional(v.record(v.string(), v.any())),
    inventory: v.number(),
    lowStockThreshold: v.optional(v.number()),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    isActive: v.boolean(),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_active", ["isActive"])
    .searchIndex("search_name", { searchField: "name" }),

  orders: defineTable({
    userId: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      image: v.string(),
      attributes: v.optional(v.record(v.string(), v.any())),
    })),
    total: v.number(),
    status: v.union(
      v.literal("pending"), v.literal("paid"), v.literal("processing"),
      v.literal("shipped"), v.literal("delivered"), v.literal("cancelled")
    ),
    shippingAddress: v.object({
      name: v.string(), phone: v.string(), address: v.string(),
      city: v.string(), region: v.string(), notes: v.optional(v.string()),
    }),
    paymentIntentId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("customer"), v.literal("admin")),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    avatar: v.optional(v.string()),
    auth0Id: v.string(),
  })
    .index("by_auth0Id", ["auth0Id"])
    .index("by_email", ["email"]),
});