import app from "../services/express.js";
import fs from 'fs';
import {TemplateModel} from "../models/userModel.js";
import { publicUpload } from "../multer/multer.js";

const handleError = (res, error) => {
    console.error(error);
    res.status(500).json({ 
        success: false, 
        message: "Erro interno no servidor.", 
        error: error.message 
    })
};

app.get('/template/:id', async (req, res) => {
    try {
        
        const id = req.params.id;
        const template = await TemplateModel.findById(id);
        
        res.status(200).json(
            {
                sucess: true,
                message: "Template Enviado com sucesso!",
                dados: template
                
            });
            
        } catch (error) {
            handleError(res, error);
    }
});


app.post('/template', publicUpload.single('imagePath'), async (req, res) => {
    try {
        req.body.imagePath = req.file.path;
        const template = await TemplateModel.create(req.body);

        res.status(201).json(
            {
                sucess: true,
                message: "Template criado com sucesso!",
                dados: template
            });

    } catch (error) {

        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        console.log(error)
        handleError(res, error);
    }
});



app.patch('/template/:id', publicUpload.single('imagePath'), async (req, res) => {
    try {
        if(req.file){
            req.body.imagePath = req.file.path;
        }
        const template = await TemplateModel.findByIdAndUpdate(req.params.id, req.body, { new : true });
        
        res.status(200).json(
            {
                sucess: true,
                message: "Template atualizado com sucesso!",
                dados: template
            });

    } catch (error) {
        handleError(res, error);
    }
}
);


app.delete('/template/:id', async (req, res) => {
    try {
        const template = await TemplateModel.findByIdAndDelete(req.params.id);

        res.status(200).json(
            {
                sucess: true,
                message: "Template excluído com sucesso!",
                dados: template
            });

    } catch (error) {
        handleError(res, error);
    }
});
