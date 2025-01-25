import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
export default model;