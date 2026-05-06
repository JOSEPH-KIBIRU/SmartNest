import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("orders").order("desc").collect(),
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    items: v.array(v.object({
      productId: v.id("products"), name: v.string(), price: v.number(),
      quantity: v.number(), image: v.string(), attributes: v.optional(v.record(v.string(), v.any())),
    })),
    total: v.number(),
    shippingAddress: v.object({
      name: v.string(), phone: v.string(), address: v.string(),
      city: v.string(), region: v.string(), notes: v.optional(v.string()),
    }),
    paymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      const prod = await ctx.db.get(item.productId);
      if (!prod) throw new Error("Bidhaa haipatikani");
      if (prod.inventory < item.quantity) throw new Error(`Stock hazitoshi kwa ${prod.name}`);
      await ctx.db.patch(item.productId, { inventory: prod.inventory - item.quantity });
    }
    return await ctx.db.insert("orders", {
      ...args, status: "pending", createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"), v.literal("paid"), v.literal("processing"),
      v.literal("shipped"), v.literal("delivered"), v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});