import {Template, UserModel} from "../models/userModel.js";

const uploadTemplate = async (req, res) => {
    const { userId } = req.params; 

    if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
    }

    try {
        // Criando o novo template
        const newTemplate = new Template({
            imageUrl: req.file.path,
            description: req.body.description,
        });

        const savedTemplate = await newTemplate.save();

        await UserModel.findByIdAndUpdate(userId, { $push: { myTemplates: savedTemplate._id } });

        return res.json({
            message: "Template salvo com sucesso",
            template: savedTemplate,
        });

    } catch (error) {
        return res.status(500).json({
            error: "Erro ao salvar o template no banco",
            details: error.message,
        });
    }
};

const getUserTemplates = async (req, res) => {
    const {userId} = req.params;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.json(user.myTemplates);
    } catch (error) {
        return res.status(500).json({
            error: "Erro ao buscar templates",
            details: error.message,
        });
    }
};

export default { uploadTemplate, getUserTemplates };
