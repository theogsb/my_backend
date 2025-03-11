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

app.get('/template/', async (req, res) => {
    try {
        
        const templates = await TemplateModel.find({}, {_id: 1, imagePath: 1});
    
        res.status(200).json(
            {
                success: true,
                message: "Templates Enviado com sucesso!",
                data: templates
                
            });
            
        } catch (error) {
            handleError(res, error);
    }
});

app.get('/template/:id', async (req, res) => {
    try {
        
        const id = req.params.id;
        const template = await TemplateModel.findById(id);
        
        res.status(200).json(
            {
                success: true,
                message: "Template Enviado com sucesso!",
                data: template
                
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
                success: true,
                message: "Template criado com sucesso!",
                data: template
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
                success: true,
                message: "Template atualizado com sucesso!",
                data: template
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
                success: true,
                message: "Template excluído com sucesso!",
                data: template
            });

    } catch (error) {
        handleError(res, error);
    }
});
