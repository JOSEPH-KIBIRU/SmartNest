import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all favorites for a user
export const getFavorites = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    // Get product details for each favorite
    const favoritesWithProducts = await Promise.all(
      favorites.map(async (favorite) => {
        const product = await ctx.db.get(favorite.productId);
        return {
          ...favorite,
          product,
        };
      })
    );
    
    return favoritesWithProducts.filter(f => f.product !== null);
  },
});

// Check if a product is favorited
export const isFavorited = query({
  args: { userId: v.string(), productId: v.id("products") },
  handler: async (ctx, { userId, productId }) => {
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", userId).eq("productId", productId)
      )
      .unique();
    
    return !!favorite;
  },
});

// Add product to favorites
export const addFavorite = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, { userId, productId }) => {
    // Check if already exists
    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", userId).eq("productId", productId)
      )
      .unique();
    
    if (existing) {
      return { success: false, message: "Already in favorites" };
    }
    
    await ctx.db.insert("favorites", {
      userId,
      productId,
      addedAt: Date.now(),
    });
    
    return { success: true, message: "Added to favorites" };
  },
});

// Remove product from favorites
export const removeFavorite = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, { userId, productId }) => {
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", userId).eq("productId", productId)
      )
      .unique();
    
    if (!favorite) {
      return { success: false, message: "Not in favorites" };
    }
    
    await ctx.db.delete(favorite._id);
    return { success: true, message: "Removed from favorites" };
  },
});

// Get favorite count for a user
export const getFavoriteCount = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    return favorites.length;
  },
});

// NEW: Sync local favorites from localStorage to server when user logs in
export const syncFavorites = mutation({
  args: {
    userId: v.string(),
    productIds: v.array(v.id("products")),
  },
  handler: async (ctx, { userId, productIds }) => {
    const results = { added: 0, skipped: 0 };
    
    for (const productId of productIds) {
      // Check if already exists
      const existing = await ctx.db
        .query("favorites")
        .withIndex("by_user_product", (q) => 
          q.eq("userId", userId).eq("productId", productId)
        )
        .unique();
      
      if (!existing) {
        await ctx.db.insert("favorites", {
          userId,
          productId,
          addedAt: Date.now(),
        });
        results.added++;
      } else {
        results.skipped++;
      }
    }
    
    return results;
  },
});