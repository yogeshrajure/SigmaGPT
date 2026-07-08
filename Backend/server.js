import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Test Route
app.get("/", (req, res) => {
  res.send("Gemini Backend Running...");
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch (err) {
        console.log("Failed to connect with DB", err);
        process.exit(1);
    }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Chat Route
// app.post("/chat", async (req, res) => {
//   const { prompt } = req.body;

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             {
//               text: prompt,
//             },
//           ],
//         },
//       ],
//     }),
//   };

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       options
//     );

//     const data = await response.json();
//     //console.log(data);
//     res.send({
//       reply: data.candidates[0].content.parts[0].text,
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// });


