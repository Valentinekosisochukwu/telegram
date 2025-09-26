import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user by their Clerk user ID
export const getUserByClerkUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
  },
});

// create or update a user (sync from Clerk)

export const upsertUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, { userId, name, email, imageUrl }) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (existingUser) {
      await ctx.db.patch(existingUser._id, { name, imageUrl });
      return existingUser._id;
    }

    return await ctx.db.insert("users", { userId, name, email, imageUrl });
  },
});

// search users by email (for admin features)
export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    if (!searchTerm.trim()) return [];

    const normalizedSearch = searchTerm.toLowerCase().trim();

    // Get all users and filter them by name or email containing the search term
    const allUsers = await ctx.db.query("users").collect();

    return allUsers
      .filter((user) => {
        return (
          user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch)
        );
      })
      .slice(0, 20); // Limit to 20 results
  },
});


// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// // Get user by Clerk user ID
// export const getUserByClerkUserId = query({
//   args: { userId: v.string() },
//   handler: async (ctx, { userId }) => {
//     if (!userId) return null;

//     return await ctx.db
//       .query("users")
//       .withIndex("by_userId", (q) => q.eq("userId", userId))
//       .unique();
//   },
// });

// // Create or update user (sync from Clerk)
// export const upsertUser = mutation({
//   args: {
//     userId: v.string(),
//     name: v.string(),
//     email: v.string(),
//     imageUrl: v.string(),
//   },
//   handler: async (ctx, { userId, name, email, imageUrl }) => {
//     const existingUser = await ctx.db
//       .query("users")
//       .withIndex("by_userId", (q) => q.eq("userId", userId))
//       .unique();

//     if (existingUser) {
//       await ctx.db.patch(existingUser._id, { name, email, imageUrl });
//       return existingUser._id;
//     }

//     return await ctx.db.insert("users", { userId, name, email, imageUrl });
//   },
// });



// // import { query } from "./_generated/server";
// // import { v } from "convex/values";

// export const searchUsers = query({
//   args: { searchTerm: v.string() },
//   handler: async (ctx, { searchTerm }) => {
//     const users = await ctx.db.query("users").collect();

//     if (!searchTerm.trim()) return users;

//     return users.filter((user) =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   },
// });
