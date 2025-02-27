import { UserModel } from '../models/userModel.js';

const getUserProfile = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        const profileData = {
            name: user.name,
            email: user.email,
            contact_phone: user.ngo.contact_phone,
            start_year: user.ngo.start_year,
            description: user.ngo.description,
            logo: user.ngo.logo,
            instagram_link: user.ngo.instagram_link,
            facebook_link: user.ngo.facebook_link,
            x_link: user.ngo.x_link,
            pix_qr_code_link: user.ngo.pix_qr_code_link
        };
        
        res.json({
            success: true,
            message: "Perfil encontrado",
            profile: profileData
        });
    } catch (error) {
        console.error("Erro ao buscar perfil: ", error.message);
        res.status(500).json({
            success: false,
            message: "Falha ao tentar buscar o perfil"
        });
    }
};

const updateUserProfile = async (req, res) => {
    const { email } = req.params;
    const updateData = req.body;

    try {
        const updateUser = await UserModel.findOneAndUpdate(
            { email },
            { $set: updateData },
            { new: true, runValidator: true } 
        );

        if (!updateUser) {
            return res.status(404).json({
                success: false,
                message: "Usuário não encontrado"
            });
        }

        res.json({
            success: true,
            message: "Perfil atualizado com sucesso",
            profile: updateUser,
        });
    } catch (error) {
        console.error("Erro ao atualizar o perfil:", error.message);
        res.status(500).json({
            success: false,
            message: "Falha ao tentar atualizar o perfil"
        });
    }
};

export { getUserProfile, updateUserProfile };
