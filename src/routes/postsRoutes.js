import { Router } from "express";
import fs from "fs";
import { ScheduleModel } from "../models/userModel.js";
import { usersUpload } from "../multer/multer.js";
import mongoose from "mongoose";

const router = Router();

const handleError = (res, error) => {
  res.status(500).json({
    success: false,
    message: "Erro interno no servidor.",
    error: error.message,
  });
};

// Rota para obter o cronograma de um usuário
router.get("/schedule/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const schedule = await ScheduleModel.findOne({ userId: userId.toString() });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Erro interno no servidor",
        error: "Cronograma não encontrado!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cronograma Enviado com sucesso!",
      data: schedule,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// Rota para obter uma postagem específica de um usuário
router.get("/schedule/:userId/posts/:postId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const postId = req.params.postId;

    const schedule = await ScheduleModel.findOne({ userId: userId });

    if (!schedule) {
      return res.status(401).json({
        success: false,
        message: "Erro interno no servidor",
        error: "Postagem não encontrada!",
      });
    }

    if (!schedule.posts) {
      return res.status(404).json({
        success: false,
        message: "Coleção de posts não encontrada!",
      });
    }

    const post = schedule.posts.id(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Postagem não encontrada!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Postagem Enviada com sucesso!",
      data: post,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Rota para criar uma nova postagem
router.post(
  "/schedule/:userId/posts/",
  usersUpload.single("imagePath"),
  async (req, res) => {
    try {
      const { platform, postDate, postTime } = req.body;

      if (!platform || !postDate || !postTime) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "Campos obrigatorios incompletos",
        });
      }

      if (req.file) {
        req.body.imagePath = req.file.path;
      }

      const schedule = await ScheduleModel.findOne({
        userId: req.params.userId,
      });

      if (!schedule) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(401).json({
          success: false,
          message: "Cronograma não encontrado!",
        });
      }

      const updatedSchedule = await ScheduleModel.findOneAndUpdate(
        { userId: req.params.userId },
        {
          $push: {
            posts: {
              platform: req.body.platform,
              postText: req.body.postText || "",
              postDate: req.body.postDate,
              postTime: req.body.postTime,
              imagePath: req.body.imagePath || "",
            },
          },
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: "Postagem criada com sucesso!",
        file: req.file,
        data: updatedSchedule,
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      handleError(res, error);
    }
  }
);

// Rota para atualizar uma postagem
router.patch(
  "/schedule/:userId/posts/:postId",
  usersUpload.single("imagePath"),
  async (req, res) => {
    try {
      const { userId, postId } = req.params;
      const { platform, postDate, postTime } = req.body;

      if (!platform || !postDate || !postTime) {
        return res.status(400).json({
          success: false,
          message: "Campos obrigatorios incompletos",
        });
      }

      const schedule = await ScheduleModel.findOne({ userId: userId });

      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: "Cronograma não encontrado",
        });
      }

      const postToBePatched = schedule.posts.id(postId);

      if (!postToBePatched) {
        return res.status(404).json({
          success: false,
          message: "Postagem não encontrada!",
        });
      }

      if (req.file) {
        fs.unlinkSync(postToBePatched.imagePath);
        req.body.imagePath = req.file.path;
      }

      const updates = {};
      if (req.body.platform) updates["posts.$.platform"] = req.body.platform;
      if (req.body.postText) updates["posts.$.postText"] = req.body.postText;
      if (req.body.postDate) updates["posts.$.postDate"] = req.body.postDate;
      if (req.body.postTime) updates["posts.$.postTime"] = req.body.postTime;
      if (req.body.imagePath) updates["posts.$.imagePath"] = req.body.imagePath;

      const updatedSchedule = await ScheduleModel.findOneAndUpdate(
        { userId, "posts._id": postId },
        { $set: updates },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Postagem atualizada com sucesso!",
        data: updatedSchedule,
      });
    } catch (error) {
      handleError(res, error);
    }
  }
);

// // Rota para excluir uma postagem
// router.delete("/schedule/:userId/posts/:postId/", async (req, res) => {
//   try {
//     const { userId, postId } = req.params;
//     const schedule = await ScheduleModel.findOne({ userId });

//     if (!schedule) {
//       return res.status(404).json({
//         success: false,
//         message: "Cronograma não encontrado",
//       });
//     }

//     const postToBeDeleted = schedule.posts.id(postId);

//     if (!postToBeDeleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Postagem não encontrada!",
//       });
//     }

//     console.log("Caminho da imagem", postToBeDeleted.imagePath);

//     if (postToBeDeleted.imagePath) {
//       const filePath = postToBeDeleted.imagePath;

//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       } else {
//         console.log("Arquivo de imagem não encontrado:", filePath);
//       }
//     }

//     // const updatedSchedule = await ScheduleModel.findOneAndUpdate(
//     //   { userId },
//     //   { $pull: { posts: { _id: postId } } },
//     //   { new: true }
//     // );

//     schedule.posts.pull(postId);
//     await schedule.save();

//     res.status(200).json({
//       success: true,
//       message: "Postagem excluída com sucesso!",
//       data: schedule,
//     });
//   } catch (error) {
//     console.error("err:", error);
//     handleError(res, error);
//   }
// });

router.delete("/schedule/:userId/posts/:postId/", async (req, res) => {
  try {
    const { userId, postId } = req.params;
    console.log(`deletando post ${postId}`);

    // Valida o postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.log("PostId inválido:", postId);
      return res.status(404).json({
        success: false,
        message: "Postagem não encontrada!",
      });
    }

    // Converte o postId para ObjectId
    const postObjectId = new mongoose.Types.ObjectId(postId);

    // Encontra o cronograma do usuário
    const schedule = await ScheduleModel.findOne({ userId });

    if (!schedule) {
      console.log("Cronograma não encontrado");
      return res.status(404).json({
        success: false,
        message: "Cronograma não encontrado",
      });
    }

    // Encontra a postagem no array `posts`
    const postToBeDeleted = schedule.posts.id(postObjectId);

    if (!postToBeDeleted) {
      console.log("Postagem não encontrada");
      return res.status(404).json({
        success: false,
        message: "Postagem não encontrada!",
      });
    }

    console.log("Caminho da imagem", postToBeDeleted.imagePath);

    // Remove o arquivo de imagem associado à postagem
    if (postToBeDeleted.imagePath) {
      const filePath = postToBeDeleted.imagePath;
      console.log("Caminho da imagem", filePath);

      if (fs.existsSync(filePath)) {
        console.log("Deletando a imagem");
        fs.unlinkSync(filePath);
      } else {
        console.log("Arquivo de imagem não encontrado:", filePath);
      }
    }

    // Remove a postagem do array `posts`
    schedule.posts.pull(postObjectId); // Remove o post do array
    await schedule.save(); // Salva o documento atualizado

    console.log("Postagem removida com sucesso");
    console.log("Cronograma atualizado:", schedule);

    res.status(200).json({
      success: true,
      message: "Postagem excluída com sucesso!",
      data: schedule, // Retorna o documento atualizado
    });
  } catch (error) {
    console.error("err:", error);
    handleError(res, error);
  }
});

export default router;
