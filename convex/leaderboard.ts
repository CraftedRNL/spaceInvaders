import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get top scores - automatically sorted highest to lowest
export const getTopScores = query({
  args: {},
  handler: async (ctx) => {
    const scores = await ctx.db
      .query("leaderboard")
      .withIndex("by_score")
      .order("desc")
      .take(50);
    
    // Return scores with all data
    return scores.map(score => ({
      playerName: score.playerName,
      score: score.score,
      submittedAt: score.submittedAt
    }));
  },
});

// Submit a new score with validation
export const submitScore = mutation({
  args: {
    playerName: v.string(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const tenSecondsAgo = now - 10000;
    
    // 1. Prevent empty submissions
    if (!args.playerName || args.playerName.trim() === "") {
      throw new Error("Player name cannot be empty");
    }
    
    if (args.score < 0 || isNaN(args.score)) {
      throw new Error("Invalid score");
    }
    
    // 2. Prevent duplicate spam entries
    // Check for same player and same score in last 10 seconds
    const recentScores = await ctx.db
      .query("leaderboard")
      .filter((q) => q.eq(q.field("playerName"), args.playerName.trim()))
      .filter((q) => q.eq(q.field("score"), args.score))
      .collect();
    
    const hasDuplicate = recentScores.some(entry => 
      entry.submittedAt > tenSecondsAgo
    );
    
    if (hasDuplicate) {
      throw new Error("Duplicate entry - please wait 10 seconds before submitting the same score again");
    }
    
    // 3. Save with timestamp
    const id = await ctx.db.insert("leaderboard", {
      playerName: args.playerName.trim(),
      score: args.score,
      submittedAt: now,  // Timestamp included
    });
    
    return { success: true, id, submittedAt: now };
  },
});