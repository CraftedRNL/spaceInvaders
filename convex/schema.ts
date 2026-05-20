import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leaderboard: defineTable({
    playerName: v.string(),
    score: v.number(),
    submittedAt: v.number(),  // Timestamp included
  })
  .index("by_score", ["score"])  // For sorting highest to lowest
  .index("by_submittedAt", ["submittedAt"]),  // For duplicate checking
});