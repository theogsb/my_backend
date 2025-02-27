import { UserModel, Template } from "../models/userModel.js";
import mongoose from "mongoose";

const createSchedule = async (req, res)  => {
    const { email } = req.params;
    const { platform, postText, postDate, postTime, templateId } = req.body;

    console.log("Email:", email);
    console.log("Dados:", { platform, postText, postDate, postTime, templateId });

    try {
        if (!mongoose.Types.ObjectId.isValid(templateId)) {
            return res.status(400).json({ error: "ID do template inválido" });
        }

        console.log("Tentando buscar template com ID:", templateId);
        const template = await Template.findById(templateId);
        if (!template) {
            console.log("Template não encontrado no banco de dados.");
            return res.status(400).json({ error: "Template não existe "});
        }
        
        const newSchedule = { 
            _id: new mongoose.Types.ObjectId(),
            platform, 
            postText, 
            postDate : new Date(postDate), 
            postTime,
            templateId,
        };

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        const existingSchedule = user.mySchedules.find(schedule =>
            schedule.platform === platform &&
            schedule.postDate.toISOString() === new Date(postDate).toISOString() &&
            schedule.postTime === postTime
        );

        if (existingSchedule) {
            return res.status(400).json({
                success: false,
                message: "Lembrete já existe"
            });
        }

        user.mySchedules.push(newSchedule);

        await user.save();

        res.status(201).json({
            success: true,
            message: "Lembrete criado com sucesso",
            schedule: newSchedule,
        });
    } catch (error) {
        console.error("Erro ao criar lembrete:", error.message);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }
};

const getSchedule = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        res.json({
            success: true,
            schedules: user.mySchedules
        });
    } catch (error) {
        console.error("Erro ao buscar lembretes:", error.message);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }
};

const deleteSchedule = async (req, res) => {
    const { email, scheduleId } = req.params;

    try {
        const user= await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        const initialLenght = user.mySchedules.length;
        user.mySchedules = user.mySchedules.filter(schedule => schedule._id.toString() !== scheduleId);

        if (user.mySchedules.length === initialLenght) {
            return res.status(404).json({
                success: false,
                message: "Lembrete não encontrado"
            });
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Lembrete excluído com sucess"
        });
    } catch (error) {
        console.error("Erro ao excluir lembrete", error.message);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }
};

const updateSchedule = async (req, res) => {
    const { email, scheduleId } = req.params;
    const { platform, postText, postDate, postTime } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        const scheduleIndex = user.mySchedules.findIndex(schedule => schedule._id.toString() === scheduleId);

        if (scheduleIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Lembrete não encontrado"
            });
        }

        if (platform !== undefined) user.mySchedules[scheduleIndex].platform = platform;
        if (postText !== undefined) user.mySchedules[scheduleIndex].postText = postText;
        if (postDate !== undefined) user.mySchedules[scheduleIndex].postDate = new Date(postDate);
        if (postTime !== undefined) user.mySchedules[scheduleIndex].postTime = postTime;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Lembrete atualizado com sucesso",
            schedule: user.mySchedules[scheduleIndex],
        });
    } catch (error) {
        console.error("Erro ao atualizar lembrete:", error.message);
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor"
        });
    }
};

export { createSchedule, getSchedule, deleteSchedule, updateSchedule };