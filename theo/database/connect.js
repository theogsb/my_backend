import mongoose from 'mongoose';

const connectToDatabase = () => {
    mongoose
        .connect('mongodb+srv://theo:theo@theo.al2dr.mongodb.net/?retryWrites=true&w=majority&appName=Theo', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('Conexão com o banco de dados efetuada com sucesso!');
        })
        .catch((err) => {
            console.log('Erro ao conectar ao banco de dados:', err);
        });
};

export default connectToDatabase;