import express from "express";
import { handleGenerateText } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate", handleGenerateText);

export default router;