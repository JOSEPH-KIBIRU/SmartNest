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
    // console.log('storeUser called with:', args.auth0Id);
    
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth0Id", (q) => q.eq("auth0Id", args.auth0Id))
      .unique();

    if (existing) {
      // console.log('Updating existing user:', existing._id);
      await ctx.db.patch(existing._id, {
        email: args.email, 
        name: args.name, 
        avatar: args.picture,
      });
      return existing._id;
    }
    
    // console.log('Creating new user');
    const newId = await ctx.db.insert("users", {
      auth0Id: args.auth0Id, 
      email: args.email, 
      name: args.name,
      role: "customer", 
      avatar: args.picture,
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

export const makeAdmin = mutation({
  args: { auth0Id: v.string() },
  handler: async (ctx, { auth0Id }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth0Id", (q) => q.eq("auth0Id", auth0Id))
      .unique();
    
    if (user) {
      await ctx.db.patch(user._id, { role: "admin" });
      return { success: true, userId: user._id };
    }
    return { success: false, error: "User not found" };
  },
});