import { ScheduleService } from '../services/scheduleService.js';
import fs from 'fs';

const handleError = (res, error) => {
  res.status(500).json({
    success: false,
    message: error.message
  });
};

export class ScheduleController {
  
  constructor() {
    this.service = new ScheduleService();
  }


  async getSchedule(req, res) {
    try {
      const { userId } = req.params;
      const schedule = await this.service.getSchedule(userId);

      return res.status(200).json({
        success: true,
        message: "Cronograma enviado com sucesso!",
        data: schedule,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async getPost(req, res) {
    try {
      const { userId, postId } = req.params;
      const post = await this.service.getPost(userId, postId);

      return res.status(200).json({
        success: true,
        message: "Postagem enviado com sucesso!",
        data: post,
      });
    } catch (error) {
      handleError(res, error);
    }
  }


  async createPost(req, res) {
    try {
      const { userId } = req.params;
      const postData = req.body;
      const file = req.file;

      if (!postData.platform || !postData.postDate || !postData.postTime) {
        throw new Error("Campos obrigatórios incompletos");
      }

      if (!file) {
        throw new Error("Nenhuma imagem foi enviada.");
      }

      const schedule = await this.service.createPost(userId, { ...postData, imagePath: file.path });

      return res.status(201).json({
        success: true,
        message: "Postagem criada com sucesso!",
        data: schedule,
      });
      
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      handleError(res, error);
    }
  }


  async updatePost(req, res) {
    try {
      const { userId, postId } = req.params;
      const updateData = req.body;
      const file = req.file;

      const schedule = await this.service.updatePost(userId, postId, { ...updateData, imagePath: file?.path });

      return res.status(200).json({
        success: true,
        message: "Postagem atualizada com sucesso!",
        data: schedule,
      });

    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      handleError(res, error);
    }
  }

  
  async deletePost(req, res) {
    try {
      const { userId, postId } = req.params;
      const schedule = await this.service.deletePost(userId, postId);

      return res.status(200).json({
        success: true,
        message: "Postagem excluída com sucesso!",
      });
    } catch (error) {
      handleError(res, error);
    }
  }
}