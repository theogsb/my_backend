import apiService from '../services/apiService.js';
import { UserModel } from '../models/userModel.js';

const loginAndSaveUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const response = await apiService.authenticateWithApi(email, password);
  
        if (response && response.message === "Login bem-sucedido") {
            const userData = response.user;
            const ngoData = response.ngo;
  
            const newUser = new UserModel({
                email: userData.email,
                password: password,
                name: userData.name,
                ngo: {
                    id: ngoData.id,
                    name: ngoData.name,
                    description: ngoData.description,
                    is_formalized: ngoData.is_formalized,
                    start_year: ngoData.start_year,
                    contact_phone: ngoData.contact_phone,
                    instagram_link: ngoData.instagram_link,
                    x_link: ngoData.x_link,
                    facebook_link: ngoData.facebook_link,
                    pix_qr_code_link: ngoData.pix_qr_code_link,
                    gallery_images_url: ngoData.gallery_images_url,
                    skills: ngoData.skills,
                    causes: ngoData.causes,
                    sustainable_development_goals: ngoData.sustainable_development_goals
                }
            });
  
            await newUser.save();
            res.status(200).json({ message: 'Usuário criado com sucesso!' });
        } else {
            res.status(400).json({ message: 'Erro no login.' });
        }
    } catch (error) {
        console.error('Erro ao fazer login ou salvar o usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};


const deleteUser = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await UserModel.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json ({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        res.json ({
            success: true,
            message: "Usuário deletado com sucesso",
            user
    });
    } catch (error) {
        console.error("Erro ao deletar o usuário: ", error.message);
        res.status(500).json ({
            success: false,
            message: "Falha ao tentar deletar usuário"
        });
    }
};

const getUser = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await UserModel.findOne({email});

        if (!user) {
            return res.status(404).json ({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        const allUserData = {
            message: userData.message,
            user: userData.user,
            ngo: userData.ngo,
        };

        res.json ({
            success: true,
            message: "Usuário encontrado",
            user: allUserData,
        });
    } catch (error) {
        console.error("Erro ao buscar usuário: ", error.message);
        res.status(500).json ({
            success: false,
            message: "Falha ao tentar buscar o usuário"
        });
    }
};

export { loginAndSaveUser, deleteUser, getUser };