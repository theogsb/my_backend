import express from "express";
import { TextGeneratorController } from "../controllers/textGeneratorController.js";

const router = express.Router();
const textGeneratorController = new TextGeneratorController();

router.post("/generate-text", textGeneratorController.generateText.bind(textGeneratorController));

export default router;
