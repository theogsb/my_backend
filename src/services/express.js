const express = require('express');
const UserModel = require('../models/user.model');

// inicializar o express
const app = express();

// Middlewares (são executados antes de qualquer requisição)
// caso apague o "next", ele não continua para as requisições...

app.use((req, res, next) => {
    console.log(req.body);
    console.log(`Request Type: ${req.method}`);
    console.log(`Content Type: ${req.headers["content-type"]}`);
    
    next();
}
);

// Req get (Recebe os Usuários)
app.get("/users", async (req, res) => {

    try {
        const users = await UserModel.find({});
        res.status(200).json(users);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Req get (Pegar usuário pelo ID)
app.get('/users/:id', async (req, res) => {
    try{
        const id = req.params.id;

        const users = await UserModel.findById(id);
        res.status(200).json(users);

    } catch (error) {
        res.status(500).send(error.message)
    }
}
);


// Req post (Cria usuários)
app.post('/users', async (req, res) => {
    try{       
        const user = await UserModel.create(req.body);
        res.status(201).json(user);
        
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// req patch (Atualizar Usuário)
app.patch('/users/:id', async (req, res) => {
    try{
        const id = req.params.id;

        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(user);

    } catch (error){
        res.status(500).send(error.message);
    }
}
);



// Req delete (Deleta um usuário)
app.delete('/users/:id', async (req, res) => {
    try{
        const id = req.params.id;

        const user = await UserModel.findByIdAndDelete(id);
        res.status(200).json(user);

    } catch (error) {
        res.status(500).send(error.message);
    }
}
);

const port = 8080;
app.listen(port, () => console.log(`Rodando com express na porta ${port}!`));

