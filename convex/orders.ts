import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    
    // Get product details for each order item
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        // Fetch full product details for each item
        const itemsWithDetails = await Promise.all(
          order.items.map(async (item) => {
            const product = await ctx.db.get(item.productId);
            // Get category name if product exists
            let categoryName = null;
            if (product?.categoryId) {
              const category = await ctx.db.get(product.categoryId);
              categoryName = category?.name || category?.nameSwahili;
            }
            
            return {
              ...item,
              productDetails: product,
              categoryName: categoryName,
              // Ensure image exists
              image: item.image || product?.images?.[0] || '/placeholder.jpg'
            };
          })
        );
        
        // Return order with product details and handle missing fields
        // FIXED: Removed .email from shippingAddress
        return {
          ...order,
          items: itemsWithDetails,
          // Provide defaults for missing fields
          customerEmail: order.customerEmail || `${order.shippingAddress?.phone}@customer.com`,
          subtotal: order.subtotal || order.total,
          shipping: order.shipping || 0,
          tax: order.tax || 0,
        };
      })
    );
    
    return ordersWithDetails;
  },
});

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    
    // Get product details for each order item
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const itemsWithDetails = await Promise.all(
          order.items.map(async (item) => {
            const product = await ctx.db.get(item.productId);
            return {
              ...item,
              categoryId: product?.categoryId,
              productDetails: product
            };
          })
        );
        return { ...order, items: itemsWithDetails };
      })
    );
    
    return ordersWithDetails;
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, { id }) => {
    const order = await ctx.db.get(id);
    if (!order) return null;
    
    // Get product details for each order item
    const itemsWithDetails = await Promise.all(
      order.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          categoryId: product?.categoryId,
          categoryName: product?.categoryId ? (await ctx.db.get(product.categoryId))?.name : null,
          productDetails: product
        };
      })
    );
    
    return { ...order, items: itemsWithDetails };
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      image: v.string(),
      attributes: v.optional(v.record(v.string(), v.any())),
    })),
    subtotal: v.optional(v.number()),
    shipping: v.optional(v.number()),
    tax: v.optional(v.number()),
    total: v.number(),
    customerEmail: v.optional(v.string()),
    shippingAddress: v.object({
      name: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      region: v.string(),
      notes: v.optional(v.string()),
    }),
    paymentIntentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check stock availability
    for (const item of args.items) {
      const prod = await ctx.db.get(item.productId);
      if (!prod) throw new Error(`Bidhaa ${item.name} haipatikani`);
      if (prod.inventory < item.quantity) {
        throw new Error(`Stock hazitoshi kwa ${prod.name}. Zimebaki: ${prod.inventory}`);
      }
    }
    
    // Update inventory
    for (const item of args.items) {
      const prod = await ctx.db.get(item.productId);
      if (prod) {
        await ctx.db.patch(item.productId, { 
          inventory: prod.inventory - item.quantity,
          updatedAt: Date.now()
        });
      }
    }
    
    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      items: args.items,
      subtotal: args.subtotal || args.total,
      shipping: args.shipping || 0,
      tax: args.tax || 0,
      total: args.total,
      customerEmail: args.customerEmail || `${args.shippingAddress.phone}@guest.smartnest.com`,
      shippingAddress: args.shippingAddress,
      status: "pending",
      paymentIntentId: args.paymentIntentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return orderId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, status }) => {
    const order = await ctx.db.get(id);
    if (!order) throw new Error("Order not found");
    
    // If cancelling, restore inventory
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        const prod = await ctx.db.get(item.productId);
        if (prod) {
          await ctx.db.patch(item.productId, { 
            inventory: prod.inventory + item.quantity,
            updatedAt: Date.now()
          });
        }
      }
    }
    
    await ctx.db.patch(id, { 
      status,
      updatedAt: Date.now()
    });
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const completedOrders = orders.filter(o => o.status === "delivered").length;
    
    // Orders by month (last 6 months)
    const now = Date.now();
    const sixMonthsAgo = now - (6 * 30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(o => o.createdAt > sixMonthsAgo);
    
    const ordersByMonth: Record<string, number> = {};
    recentOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      ordersByMonth[monthKey] = (ordersByMonth[monthKey] || 0) + 1;
    });
    
    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      ordersByMonth,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
    };
  },
});