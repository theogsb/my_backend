import app from "../services/express.js";
import fs from 'fs';
import { ScheduleModel } from "../models/userModel.js";
import { usersUpload } from "../multer/multer.js"


const handleError = (res, error) => {
    res.status(500).json({ 
        success: false, 
        message: "Erro interno no servidor.", 
        error: error.message 
    })
};

app.get('/schedule/:userId', async (req, res) => {
    try {
        const schedule = await ScheduleModel.findOne({userId: req.params.userId});
        
        if(!schedule) {
            res.status(401).json({ 
                success: false, 
                message: "Erro interno no servidor", 
                error: "Cronograma não encontrado!" 
            })};

        res.status(200).json(
            {
                success: true,
                message: "Cronograma Enviadao com sucesso!",
                data: schedule
            });

    } catch (error) {
        handleError(res, error);
    }
});

app.get('/schedule/:userId/posts/:postId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;

        
        let schedule = await ScheduleModel.findOne({userId: userId});
        schedule = schedule.posts.id(postId);

        if(!schedule) {
            res.status(401).json({ 
                success: false, 
                message: "Erro interno no servidor", 
                error: "Postagem não encontrada!" 
            })};


        res.status(200).json(
            {
                success: true,
                message: "Postagem Enviada com sucesso!",
                data: schedule
            });

    } catch (error) {
        handleError(res, error);
    }
});


app.post('/schedule/:userId/posts/', usersUpload.single('imagePath'), async (req, res) => {
    try {
        if(req.file) {
            req.body.imagePath = req.file.path;
        }
        
        const schedule = await ScheduleModel.findOne({userId: req.params.userId});
        if(!schedule) {

            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            res.status(401).json({ 
                success: false, 
                message: "Erro interno no servidor", 
                error: "Cronograma não encontrado!" 
            })
        }
        else {

        const userId = req.params.userId;

        const createPost = await ScheduleModel.findOneAndUpdate (
            { userId: req.params.userId },
            { $push: { 
                posts: 
                    {
                        platform:  req.body.platform,
                        postText:  req.body.postText,
                        postDate:  req.body.postDate,
                        postTime:  req.body.postTime,
                        imagePath: req.body.imagePath
                    }
            }},
            { new: true }
        );


        res.status(201).json(
            {
                success: true,
                message: "Postagem criada com sucesso!",
                file: req.file,
                data: createPost
            });
        }

    } catch (error) {

        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        handleError(res, error);
    }
});


app.patch('/schedule/:userId/posts/:postId', usersUpload.single('imagePath'), async (req, res) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;

        const scheduleToBePatched = await ScheduleModel.findOne({userId : userId});
        const postToBePatched = scheduleToBePatched.posts.id(postId);
        
        if(req.file) {
            fs.unlinkSync(postToBePatched.imagePath);
            req.body.imagePath = req.file.path;
        }
        
        const updates = {};
        if (req.body.platform) updates['posts.$.platform'] = req.body.platform;
        if (req.body.postText) updates['posts.$.postText'] = req.body.postText;
        if (req.body.postDate) updates['posts.$.postDate'] = req.body.postDate;
        if (req.body.postTime) updates['posts.$.postTime'] = req.body.postTime;
        if (req.body.imagePath) updates['posts.$.imagePath'] = req.body.imagePath;
        
        
        const schedule = await ScheduleModel.findOneAndUpdate(
            {userId, "posts._id" : postId }, 
            { $set: updates}, 
            { new : true }
        );


        res.status(200).json(
            {
                success: true,
                message: "Postagem atualizado com sucesso!",
                data: schedule
            });

    } catch (error) {
        handleError(res, error);
    }
}
);


app.delete('/schedule/:userId/posts/:postId/', async (req, res) => {
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;
        
        const schedule = await ScheduleModel.findOne({ userId: userId });
        const postToBeDeleted = schedule.posts.id(postId);
        
        const updatedSchedule = await ScheduleModel.findOneAndUpdate(
            { userId } , 
            { $pull: { posts: { _id: postId } } },
            { new: true }
        );
        
        if (postToBeDeleted.imagePath) {
            fs.unlinkSync(postToBeDeleted.imagePath);
        }

        res.status(200).json(
            {
                success: true,
                message: "Postagem excluída com sucesso!",
                data: updatedSchedule
            });

    } catch (error) {
        handleError(res, error);
    }
});
