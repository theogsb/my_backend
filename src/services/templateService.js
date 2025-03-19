import { TemplateModel } from '../models/userModel.js';
import fs from 'fs';

export class TemplateService {
  validateTemplateData = (templateData) => {
    const { imagePath } = templateData;
    if (!imagePath) {
      throw new Error("Imagem é obrigatória");
    }
  };

  getTemplates = async () => {
    try {
      const templates = await TemplateModel.find();
      return templates;
    } catch (error) {
      throw new Error("Erro ao buscar templates");
    }
  };

  getTemplate = async (templateId) => {
    try {
      const template = await TemplateModel.findById(templateId);
      
      if (!template) {
        throw new Error("Template não encontrado!");
      }

      return template;
    } catch (error) {
      if (error.message === "Template não encontrado.") {
        throw error;
      }
      throw new Error("Erro ao buscar template");
    }
  };

  createTemplate = async (templateData) => {
    try {
      this.validateTemplateData(templateData);

      const template = new TemplateModel({
        imagePath: templateData.imagePath
      });
      await template.save();

      return template;
    } catch (error) {
      if (error.message === "Imagem é obrigatória") {
        throw error;
      }
      throw new Error("Erro ao criar template");
    }
  };

  updateTemplate = async (templateId, updateData) => {
    try {
      const template = await TemplateModel.findById(templateId);
      if (!template) {
        throw new Error('Template não encontrado.');
      }

      if (template.imagePath) {
        try {
          fs.unlinkSync(template.imagePath);
        } catch (error) {
          console.log("Arquivo de imagem não encontrado:", template.imagePath);
        }
      }

      template.imagePath = updateData.imagePath;
      await template.save();

      return template;
    } catch (error) {
      if (error.message === "Template não encontrado.") {
        throw error;
      }
      throw new Error("Erro ao atualizar template");
    }
  };

  deleteTemplate = async (templateId) => {
    try {
      const template = await TemplateModel.findById(templateId);
      
      if (!template) {
        throw new Error("Template não encontrado!");
      }

      if (template.imagePath) {
        try {
          if (fs.existsSync(template.imagePath)) {
            fs.unlinkSync(template.imagePath);
          }
        } catch (error) {
          console.error('Erro ao deletar arquivo de imagem:', error);
        }
      }

      await template.deleteOne();
    } catch (error) {
      if (error.message === "Template não encontrado.") {
        throw error;
      }
      throw new Error("Erro ao deletar template");
    }
  };
} 