import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    limit: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.categoryId) {
      const categoryId = args.categoryId;
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
        .order("desc")
        .take(args.limit ?? 100);
    }

    if (args.isActive !== undefined) {
      const isActive = args.isActive;
      return await ctx.db
        .query("products")
        .withIndex("by_active", (q) => q.eq("isActive", isActive))
        .order("desc")
        .take(args.limit ?? 100);
    }

    return await ctx.db
      .query("products")
      .order("desc")
      .take(args.limit ?? 100);
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => await ctx.db.get(id),
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    return await ctx.db
      .query("products")
      .withSearchIndex("search_name", (q) => q.search("name", query))
      .take(20);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    categoryId: v.id("categories"),
    images: v.array(v.string()),
    inventory: v.number(),
    attributes: v.optional(v.record(v.string(), v.any())),
    lowStockThreshold: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      isActive: args.isActive ?? true,
      rating: 0,
      reviewCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    categoryId: v.optional(v.id("categories")),
    images: v.optional(v.array(v.string())),
    inventory: v.optional(v.number()),
    attributes: v.optional(v.record(v.string(), v.any())),
    lowStockThreshold: v.optional(v.number()),
    compareAtPrice: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

export const updateInventory = mutation({
  args: {
    id: v.id("products"),
    inventory: v.number(),
  },
  handler: async (ctx, { id, inventory }) => {
    await ctx.db.patch(id, { inventory });
    return id;
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const getCat = async (slug: string) => {
      return await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
    };

    const kitchen = await getCat("kitchen");
    const bathroom = await getCat("bathroom");
    const mens = await getCat("mens-clothing");
    const womens = await getCat("womens-clothing");
    const kids = await getCat("kids-clothing");
    const electronics = await getCat("electronics");

    if (!kitchen || !bathroom || !mens || !womens || !kids || !electronics) {
      throw new Error("Categories must be seeded before products");
    }

    const products = [
      {
        name: "Non-Stick Cookware Set",
        description: "Complete 5-piece set with wooden handles",
        price: 45000,
        categoryId: kitchen._id,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        attributes: { material: "Aluminum", pieces: 5, coating: "Teflon" },
        inventory: 12,
        lowStockThreshold: 3,
        rating: 4.5,
        reviewCount: 23,
        isActive: true,
        tags: ["cookware"],
        createdAt: Date.now(),
      },
      {
        name: "Stainless Steel Knife Set",
        description: "Professional 8-piece knife block",
        price: 28000,
        categoryId: kitchen._id,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        attributes: { material: "Stainless Steel", pieces: 8, handle: "Wood" },
        inventory: 8,
        lowStockThreshold: 2,
        rating: 4.8,
        reviewCount: 45,
        isActive: true,
        tags: ["knives"],
        createdAt: Date.now(),
      },
      {
        name: "Luxury Towel Set",
        description: "Egyptian cotton 6-piece towel set",
        price: 35000,
        categoryId: bathroom._id,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        attributes: { material: "Egyptian Cotton", pieces: 6, weight: "600 GSM" },
        inventory: 20,
        lowStockThreshold: 5,
        rating: 4.6,
        reviewCount: 18,
        isActive: true,
        tags: ["towels"],
        createdAt: Date.now(),
      },
      {
        name: "Men's Classic Oxford Shirt",
        description: "Slim fit 100% cotton shirt",
        price: 25000,
        categoryId: mens._id,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        attributes: { sizes: ["S","M","L","XL"], material: "100% Cotton", fit: "Slim" },
        inventory: 30,
        lowStockThreshold: 5,
        rating: 4.3,
        reviewCount: 67,
        isActive: true,
        tags: ["shirt"],
        createdAt: Date.now(),
      },
      {
        name: "Women's Ankara Dress",
        description: "African print midi dress",
        price: 38000,
        categoryId: womens._id,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        attributes: { sizes: ["S","M","L","XL","XXL"], material: "Cotton Wax Print", length: "Midi" },
        inventory: 15,
        lowStockThreshold: 3,
        rating: 4.9,
        reviewCount: 112,
        isActive: true,
        tags: ["dress","ankara"],
        createdAt: Date.now(),
      },
      {
        name: "Kids' School Uniform Set",
        description: "Shirt, shorts & socks set",
        price: 18000,
        categoryId: kids._id,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        attributes: { sizes: ["2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"], material: "Poly-Cotton", pieces: 3 },
        inventory: 50,
        lowStockThreshold: 10,
        rating: 4.4,
        reviewCount: 34,
        isActive: true,
        tags: ["school"],
        createdAt: Date.now(),
      },
      {
        name: "Smart Blender 500W",
        description: "High-speed blender with 1.5L jar",
        price: 75000,
        categoryId: electronics._id,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        attributes: { power: "500W", capacity: "1.5L", voltage: "220-240V", material: "Plastic & Steel" },
        inventory: 7,
        lowStockThreshold: 2,
        rating: 4.2,
        reviewCount: 29,
        isActive: true,
        tags: ["blender"],
        createdAt: Date.now(),
      },
      {
        name: "Wireless Earbuds Pro",
        description: "Bluetooth 5.3 noise cancelling",
        price: 65000,
        categoryId: electronics._id,
        images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
        attributes: { connectivity: "Bluetooth 5.3", batteryLife: "30h", voltage: "5V", waterResistance: "IPX4" },
        inventory: 25,
        lowStockThreshold: 5,
        rating: 4.7,
        reviewCount: 156,
        isActive: true,
        tags: ["audio"],
        createdAt: Date.now(),
      },
    ];

    for (const p of products) {
      await ctx.db.insert("products", p);
    }
    return products.length;
  },
});