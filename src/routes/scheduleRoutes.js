import app from "../services/express.js";
import fs from 'fs';
import { ScheduleModel } from "../models/userModel.js";
import { publicUpload } from "../multer/multer.js"


const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({ 
        success: false, 
        message: "Erro interno no servidor.", 
        error: error.message 
    })
};



app.get('/schedule/:id', async (req, res) => {
    try {

        const id = req.params.id;
        const schedule = await ScheduleModel.findById(id);

        res.status(200).json(
            {
                sucess: true,
                message: "Cronograma Enviada com sucesso!",
                dados: schedule

            });

    } catch (error) {
        handleError(res, error);
    }
});


app.post('/schedule', publicUpload.single('imagePath'), async (req, res) => {
    try {
    
        if(req.file) {
            req.body.imagePath = req.file.path;
        }

        const schedule = await ScheduleModel.create(req.body);

        res.status(201).json(
            {
                sucess: true,
                message: "Cronograma criado com sucesso!",
                file: req.file,
                dados: schedule
            });

    } catch (error) {

        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        handleError(res, error);
    }
});


app.patch('/schedule/:id', publicUpload.single('image'), async (req, res) => {
    try {
        if(req.file) {
            const existingSchedule = await ScheduleModel.findById(req.params.id);
            fs.unlinkSync(existingSchedule.imagePath);
            
            req.body.imagePath = req.file.path;
        }

        const schedule = await ScheduleModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        
        res.status(200).json(
            {
                sucess: true,
                message: "Cronograma atualizado com sucesso!",
                dados: schedule
            });

    } catch (error) {
        handleError(res, error);
    }
}
);


app.delete('/schedule/:id', async (req, res) => {
    try {
        const schedule = await ScheduleModel.findByIdAndDelete(req.params.id);

        res.status(200).json(
            {
                sucess: true,
                message: "Cronograma excluído com sucesso!",
                dados: schedule
            });

    } catch (error) {
        handleError(res, error);
    }
});
