import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").collect();
    if (existing.length > 0) return existing;

    const cats = [
      { name: "Kitchen", nameSwahili: "Jikoni", slug: "kitchen", icon: "utensils", description: "Vifaa bora vya jikoni", sortOrder: 1 },
      { name: "Bathroom", nameSwahili: "Bafuni", slug: "bathroom", icon: "bath", description: "Vifaa vya bafuni", sortOrder: 2 },
      { name: "Men's Clothing", nameSwahili: "Mavazi ya Wanaume", slug: "mens-clothing", icon: "shirt", description: "Mavazi ya kiume", sortOrder: 3 },
      { name: "Women's Clothing", nameSwahili: "Mavazi ya Wanawake", slug: "womens-clothing", icon: "heart", description: "Mavazi ya kike", sortOrder: 4 },
      { name: "Kids' Clothing", nameSwahili: "Mavazi ya Watoto", slug: "kids-clothing", icon: "baby", description: "Mavazi ya watoto", sortOrder: 5 },
      { name: "Electronics", nameSwahili: "Elektroniki", slug: "electronics", icon: "tv", description: "Vifaa vya kidigitali", sortOrder: 6 },
    ];
    const ids = [];
    for (const c of cats) ids.push(await ctx.db.insert("categories", c));
    return ids;
  },
});