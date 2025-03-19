import { ScheduleModel } from '../models/userModel.js';
import fs from 'fs';
import mongoose from 'mongoose';

export class PostService {
  async getSchedule(userId) {
    const schedule = await ScheduleModel.findOne({ userId });
    if (!schedule) {
      throw { statusCode: 404, message: 'Cronograma não encontrado!' };
    }
    return schedule;
  }

  async getPost(userId, postId) {
    const schedule = await ScheduleModel.findOne({ userId });
    if (!schedule) {
      throw { statusCode: 404, message: 'Cronograma não encontrado!' };
    }

    const post = schedule.posts.id(postId);
    if (!post) {
      throw { statusCode: 404, message: 'Postagem não encontrada!' };
    }

    return post;
  }

  async createPost(userId, postData) {
    const schedule = await ScheduleModel.findOne({ userId });
    if (!schedule) {
      throw { statusCode: 404, message: 'Cronograma não encontrado!' };
    }

    schedule.posts.push(postData);
    await schedule.save();

    return schedule;
  }

  async updatePost(userId, postId, updateData) {
    const schedule = await ScheduleModel.findOne({ userId });
    if (!schedule) {
      throw { statusCode: 404, message: 'Cronograma não encontrado!' };
    }

    const postToUpdate = schedule.posts.id(postId);
    if (!postToUpdate) {
      throw { statusCode: 404, message: 'Postagem não encontrada!' };
    }

    if (updateData.imagePath && postToUpdate.imagePath) {
      try {
        fs.unlinkSync(postToUpdate.imagePath);
      } catch (error) {
        console.log("Arquivo de imagem não encontrado:", postToUpdate.imagePath);
      }
    }

    // Atualiza apenas os campos fornecidos
    Object.keys(updateData).forEach(key => {
      postToUpdate[key] = updateData[key] || postToUpdate[key];
    });

    await schedule.save();

    return schedule;
  }

  async deletePost(userId, postId) {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw { statusCode: 404, message: 'Postagem não encontrada!' };
    }

    const schedule = await ScheduleModel.findOne({ userId });
    if (!schedule) {
      throw { statusCode: 404, message: 'Cronograma não encontrado!' };
    }

    const postToDelete = schedule.posts.id(postId);
    if (!postToDelete) {
      throw { statusCode: 404, message: 'Postagem não encontrada!' };
    }

    if (postToDelete.imagePath) {
      try {
        fs.unlinkSync(postToDelete.imagePath);
      } catch (error) {
        console.log("Arquivo de imagem não encontrado:", postToDelete.imagePath);
      }
    }

    schedule.posts.pull(postId);
    await schedule.save();

    return schedule;
  }
}