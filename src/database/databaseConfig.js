import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@theo.al2dr.mongodb.net/`
    );
    console.log("Conexão com o banco de dados efetuada com sucesso!");
  } catch (error) {
    console.log(
      "Ocorreu um erro ao realizar conexão com o banco de dados! Erro: ",
      error
    );
  }
};

export default connectToDatabase;
