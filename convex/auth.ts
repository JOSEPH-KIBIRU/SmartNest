import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const storeUser = mutation({
  args: {
    auth0Id: v.string(), 
    email: v.string(), 
    name: v.string(),
    picture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth0Id", (q) => q.eq("auth0Id", args.auth0Id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email, 
        name: args.name, 
        avatar: args.picture,
        updatedAt: Date.now(),
      });
      return existing._id;
    }
    
    const newId = await ctx.db.insert("users", {
      auth0Id: args.auth0Id, 
      email: args.email, 
      name: args.name,
      role: "customer", 
      avatar: args.picture,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return newId;
  },
});

export const getUser = query({
  args: { auth0Id: v.string() },
  handler: async (ctx, { auth0Id }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_auth0Id", (q) => q.eq("auth0Id", auth0Id))
      .unique();
  },
});

// NEW: Update user shipping details
export const updateUserShipping = mutation({
  args: {
    auth0Id: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    region: v.optional(v.string()),
    postalCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth0Id", (q) => q.eq("auth0Id", args.auth0Id))
      .unique();
    
    if (!user) throw new Error("User not found");
    
    await ctx.db.patch(user._id, {
      phone: args.phone,
      address: args.address,
      city: args.city,
      region: args.region,
      postalCode: args.postalCode,
      updatedAt: Date.now(),
    });
    
    return { success: true };
  },
});

export const makeAdmin = mutation({
  args: { auth0Id: v.string() },
  handler: async (ctx, { auth0Id }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth0Id", (q) => q.eq("auth0Id", auth0Id))
      .unique();
    
    if (user) {
      await ctx.db.patch(user._id, { 
        role: "admin",
        updatedAt: Date.now(),
      });
      return { success: true, userId: user._id };
    }
    return { success: false, error: "User not found" };
  },
});