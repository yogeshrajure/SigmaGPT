import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/openai.js";
import { userVerification } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// ==================== Get All Threads ====================
router.get("/thread", userVerification, async (req, res) => {
  try {
    const threads = await Thread.find({
      userId: req.user._id,
    }).sort({ updatedAt: -1 });

    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to fetch threads",
    });
  }
});

// ==================== Get Messages of a Thread ====================
router.get("/thread/:threadId", userVerification, async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({
      threadId,
      userId: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.json(thread.messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to fetch chat",
    });
  }
});

// ==================== Delete Thread ====================
router.delete("/thread/:threadId", userVerification, async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      userId: req.user._id,
    });

    if (!deletedThread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.json({
      success: "Thread deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to delete thread",
    });
  }
});

// ==================== Chat ====================
router.post("/chat", userVerification, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      userId: req.user._id,
    });

    // Create new thread
    if (!thread) {
      thread = new Thread({
        userId: req.user._id,
        threadId,
        title:
          message.length > 30
            ? message.slice(0, 30) + "..."
            : message,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
    }
    // Existing thread
    else {
      thread.messages.push({
        role: "user",
        content: message,
      });
    }

    // Gemini Response
    const assistantReply = await getGeminiAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    res.json({
      reply: assistantReply,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

export default router;