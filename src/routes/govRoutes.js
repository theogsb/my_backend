import express from "express";
import { GovController } from "../controllers/govController.js";

const router = express.Router();
const govController = new GovController();

router.post("/apigov", govController.authenticateUser.bind(govController));

export default router;
