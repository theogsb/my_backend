import { TemplateModel } from '../models/userModel.js';
import fs from 'fs';

export class TemplateService {
  
  async getTemplates(){
    try {
      const templates = await TemplateModel.find();
      return templates;

    } catch (error) {
      throw new Error(error.message);
    }
  };

  async getTemplate(templateId){
    try {
      const template = await TemplateModel.findById(templateId);
      
      if (!template) {
        throw new Error("Template não encontrado!");
      }

      return template;

    } catch (error) {
        throw new Error(error.message);
    }
  };


  async createTemplate(templatePath){
    try {
      const template = new TemplateModel({
        imagePath: templatePath
      });
      await template.save();

      return template;

    } catch (error) {
        throw new Error(error.message);
    }
  };

  updateTemplate = async (templateId, UpdateTemplatePath) => {
    try {
      const template = await TemplateModel.findById(templateId);
      if (!template) {
        throw new Error('Template não encontrado.');
      }

      if (template.imagePath) {
        try {
          fs.unlinkSync(template.imagePath);
        }catch (error) {
          console.log('Arquivo de imagem não encontrado!');
        }
      }

      template.imagePath = UpdateTemplatePath;
      await template.save();

      return template;

    } catch (error) {
        throw new Error(error.message);
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
            fs.unlinkSync(template.imagePath);
        } catch (error) {
          console.log('Arquivo de imagem não encontrado');
        }
      }

      await template.deleteOne();
    
    } catch (error) {
      throw new Error(error.message);
    }
  };
} 