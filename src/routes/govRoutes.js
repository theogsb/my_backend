import app from "../services/express.js";
import { ScheduleModel } from "../models/userModel.js";


app.post("/apigov", async (req, res) => {
    
    try {
        const response = await fetch("https://bora-impactar-prd.setd.rdmapps.com.br/api/login.json" ,   {
                    
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(req.body)
            },

        );
        const data = await response.json();
        const userId = data.ngo.id;
        
        
        const schedule = await ScheduleModel.findOne({ userId });
        if (!schedule) {
            const newSchedule = new ScheduleModel({
                userId,
                posts: [],
            });
            await newSchedule.save();
        }

        
        res.json({
            success : true,
            message : "Usuário Criado com sucesso",
            data, schedule
        });


    } catch (error) {

        console.log(error);
        res.status(500).json({
            success: false,
            message: "Erro ao criar usuário!",
            error: error.message  
        })
    }
});