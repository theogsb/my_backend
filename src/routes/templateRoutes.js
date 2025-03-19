import express from "express";
import { publicUpload } from "../multer/multer.js";
import { TemplateController } from "../controllers/templateController.js";

const router = express.Router();
const templateController = new TemplateController();

router.get("/template/", templateController.getAllTemplates.bind(templateController));
router.get("/template/:id", templateController.getTemplateById.bind(templateController));
router.post("/template", publicUpload.single("imagePath"), templateController.createTemplate.bind(templateController));
router.patch("/template/:id", publicUpload.single("imagePath"), templateController.updateTemplate.bind(templateController));
router.delete("/template/:id", templateController.deleteTemplate.bind(templateController));

export default router;
