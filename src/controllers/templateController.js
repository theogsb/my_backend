import { TemplateModel } from "../models/userModel.js";
import fs from "fs";

export class TemplateController {
  async getAllTemplates(req, res) {
    try {
      const templates = await TemplateModel.find();
      res.status(200).json({
        success: true,
        data: templates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao buscar templates",
        error: error.message
      });
    }
  }

  async getTemplateById(req, res) {
    try {
      const template = await TemplateModel.findById(req.params.id);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template não encontrado!"
        });
      }

      res.status(200).json({
        success: true,
        data: template
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao buscar template",
        error: error.message
      });
    }
  }

  async createTemplate(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Nenhuma imagem foi enviada."
        });
      }

      const template = new TemplateModel({
        imagePath: req.file.path,
        isTest: req.body.isTest
      });

      await template.save();

      res.status(201).json({
        success: true,
        data: template
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        message: "Erro ao criar template",
        error: error.message
      });
    }
  }

  async updateTemplate(req, res) {
    try {
      const template = await TemplateModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template não encontrado!"
        });
      }

      res.status(200).json({
        success: true,
        data: template
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao atualizar template",
        error: error.message
      });
    }
  }

  async deleteTemplate(req, res) {
    try {
      const template = await TemplateModel.findById(req.params.id);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template não encontrado!"
        });
      }

      if (template.imagePath && fs.existsSync(template.imagePath)) {
        fs.unlinkSync(template.imagePath);
      }

      await template.deleteOne();

      res.status(200).json({
        success: true,
        message: "Template excluído com sucesso!"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro ao excluir template",
        error: error.message
      });
    }
  }
} 