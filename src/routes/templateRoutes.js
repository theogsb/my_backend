import express from "express";
import { TemplateModel } from "../models/userModel.js";
import { publicUpload } from "../multer/multer.js";
import fs from "fs";
import path from "path";

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
    const template = await TemplateModel.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template não encontrado.",
      });
    }

    if (!template.imagePath) {
      return res.status(400).json({
        success: false,
        message: "Caminho da imagem não encontrado no template.",
      });
    }

    const filePath = path.resolve(template.imagePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("Arquivo excluído com sucesso!", filePath);
    } else {
      console.log("Arquivo não encontrado na pasta!", filePath);
    }

    await TemplateModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Template excluído com sucesso!",
      data: template,
    });
  } catch (error) {
    console.error("Erro ao excluir template:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno ao excluir template.",
    });
  }
});

export default router;
