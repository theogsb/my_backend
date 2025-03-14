import request from "supertest";
import express from "express"; // Import express to create a new app instance
import mongoose from "mongoose";
import dotenv from "dotenv";
import textGeneratorRoutes from "../src/routes/textGeneratorRoutes.js"; // Import your routes
dotenv.config();

let server; // Define server at the top

describe("POST /generate-text", () => {
  beforeAll(async () => {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@theo.al2dr.mongodb.net/`
    );
    console.log("Conexao com o banco de dados estabelecidada com sucesso");

    // Create a new app instance for testing
    const app = express();
    app.use(express.json());
    app.use(textGeneratorRoutes);

    // Start the server on a different port
    server = app.listen(0, () => {
      console.log(
        `Servidor de teste rodando na porta ${server.address().port}`
      );
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
    console.log("Conexão com o banco de dados fechada.");
  });

  it("deve gerar texto com base em um prompt", async () => {
    const prompt =
      "Escreva uma frase de legenda para post de Story do Instagram de uma Ong de cachorros de rua.";

    const response = await request(server)
      .post("/generate-text")
      .send({ prompt });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.text).toBeDefined();
  }, 20000);
});
