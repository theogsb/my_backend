import {UserModel} from "../models/userModel.js";

const addTemplate = async (req, res) => {
    const { email } = req.params;
    const { imageUrl, description } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            console.log("Usuário não encontrado");

            return res.status(404).json ({
                success: false,
                message: "Usuário não encontrado",
            });
        }

        user.myTemplates.push({ imageUrl, description });
        await user.save();

        console.log("Template adicionado com sucesos");

        res.status(201).json ({
            success: true,
            message: "Template adicionado com sucesso",
            templates: user.myTemplates,
        });
    } catch (error) {
        console.error("Erro ao adicioanr template: ", error.message);
        res.status(500).json({
            success: false,
            message: "Erro ao adicioanr template"
        });
    }
};

const addSchedule = async (req, res) => {
    const { email } = req.params;
    const { platform, postText, postDate, postTime } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            console.log("Usuário não encontrado")

            return res.status(404).json ({
                success: false,
                message: "Usuário não encontrado",
            });
        }

        user.mySchedule.push({ platform, postText, postDate, postTime });
        await user.save();

        console.log("Lembrete de postagem adicionada com sucesso");

        res.status(201).json ({
            success: true,
            message: "Lembrete de postagem adicionada com sucesso",
            schedule: user.mySchedule,
        });
    } catch (error) {
        console.error("Erro ao adicionar lembrete de Postagem: ", error.message);
        res.status(500).json({
            success: false,
            message: "Erro ao adicionar lembrete de postagem",
        });
    }
};

export { addTemplate, addSchedule };

