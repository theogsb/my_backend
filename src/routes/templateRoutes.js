import express from "express";
import { TemplateModel } from "../models/userModel.js";
import { publicUpload } from "../multer/multer.js";
import fs from "fs";

const router = express.Router();

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Erro interno no servidor.",
    error: error.message,
  });
};

router.get("/template/", async (req, res) => {
  try {
    const templates = await TemplateModel.find({}, { _id: 1, imagePath: 1 });

    res.status(200).json({
      success: true,
      message: "Templates enviados com sucesso!",
      data: templates,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.get("/template/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const template = await TemplateModel.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template não encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Template enviado com sucesso!",
      data: template,
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post("/template", publicUpload.single("imagePath"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Nenhuma imagem foi enviada.",
      });
    }

    req.body.imagePath = req.file.path;
    const template = await TemplateModel.create(req.body);

    res.status(201).json({
      success: true,
      message: "Template criado com sucesso!",
      data: template,
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    handleError(res, error);
  }
});

router.patch("/template/:id", publicUpload.single("imagePath"),
  async (req, res) => {
    try {
      const template = await TemplateModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template não encontrado.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Template atualizado com sucesso!",
        data: template,
      });
    } catch (error) {
      handleError(res, error);
    }
  }
);

router.delete("/template/:id", async (req, res) => {
  try {
    const template = await TemplateModel.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template não encontrado.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Template excluído com sucesso!",
      data: template,
    });
  } catch (error) {
    handleError(res, error);
  }
});

export default router;
