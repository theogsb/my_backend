import request from "supertest";
import express from "express"; // Import express to create a new app instance
import { TemplateModel } from "../src/models/userModel.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import templateRoutes from "../src/routes/templateRoutes.js"; // Import your routes
dotenv.config();

let server; // Define server at the top

describe("GET /template/", () => {
  beforeAll(async () => {
    await mongoose.connect(
      `mongodb+srv://theo:theo@theo.al2dr.mongodb.net/nome_do_banco_de_dados`
    );
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    // Create a new app instance for testing
    const app = express();
    app.use(express.json());
    app.use(templateRoutes);

    // Start the server on a different port
    server = app.listen(0, () => {
      console.log(`Servidor de teste rodando na porta ${server.address().port}`);
    });
  });

  afterAll(async () => {
    await TemplateModel.deleteMany({ isTest: true });
    console.log("Templates de teste removidos.");

    await mongoose.connection.close();
    server.close();
    console.log("Conexão com o banco de dados fechada.");
  });

  it("deve retornar uma lista de templates", async () => {
    await TemplateModel.create({
      imagePath: "caminho/da/imagem.png",
      isTest: true,
    });

    const response = await request(server).get("/template/");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
  }, 20000);
});

describe("GET /template/:id", () => {
  let templateId;

  beforeAll(async () => {
    await mongoose.connect(
      `mongodb+srv://theo:theo@theo.al2dr.mongodb.net/nome_do_banco_de_dados`
    );

    console.log("Conexao com o banco de dados estabelecida com sucess");

    const template = await TemplateModel.create({
      imagePath: "caminho/da/imagem.png",
      isTest: true, // marca o template como teste
    });

    templateId = template._id;
  });

  afterAll(async () => {
    await TemplateModel.deleteMany({ isTest: true });
    console.log("Templates de teste removidos!");

    await mongoose.connection.close();
    server.close();
    console.log("Conexao com o banco de dados fechada");
  });

  it("deve retornar um template pelo ID", async () => {
    const response = await request(server).get(`/template/${templateId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(templateId.toString());
    expect(response.body.data.imagePath).toBe("caminho/da/imagem.png");
  }, 20000);
});

describe("POST /template", () => {
  beforeAll(async () => {
    await mongoose.connect(
      `mongodb+srv://theo:theo@theo.al2dr.mongodb.net/nome_do_banco_de_dados`
    );
    console.log("Conexao com o banco de dados estabelecida com sucess");
  });

  afterAll(async () => {
    await TemplateModel.deleteMany({ isTest: true });
    console.log("Templates de teste removidos");

    await mongoose.connection.close();
    server.close();
    console.log("Conexao com o banco de dados fechada");
  });

  it("deve criar um novo template", async () => {
    // simulando uma file
    const filePath = path.join(__dirname, "test-file.png");
    fs.writeFileSync(filePath, "Conteúdo do arquivo de teste");

    const response = await request(server)
      .post("/template")
      .field("isTest", true)
      .attach("imagePath", filePath);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imagePath).toBeDefined();
    expect(response.body.data._id).toBeDefined();

    fs.unlinkSync(filePath);
  }, 20000);
});

describe("DELETE /template/:id", () => {
  let templateId;

  beforeAll(async () => {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@theo.al2dr.mongodb.net/`
    );

    console.log("Conexao com o banco de dados estabelecida com sucesso");

    const template = await TemplateModel.create({
      imagePath: "caminho/da/imagem.png",
      isTest: true,
    });
    templateId = template._id;
  });

  afterAll(async () => {
    await TemplateModel.deleteMany({ isTest: true });
    console.log("Templates de teste removidos");

    await mongoose.connection.close();
    server.close();
    console.log("Conexao com o banco de dados fechada");
  });

  it("deve excluir um template pelo ID", async () => {
    const response = await request(server).delete(`/template/${templateId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Template excluído com sucesso!");
  }, 20000);
});

describe("PATCH /template/:id", () => {
  let templateId;

  beforeAll(async () => {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@theo.al2dr.mongodb.net/`
    );
    console.log("Conexao com o banco de dados estabelecida com sucesso");

    const template = await TemplateModel.create({
      imagePath: "caminho/da/imagem.png",
      isTest: true,
    });
    templateId = template._id;
  });

  afterAll(async () => {
    await TemplateModel.deleteMany({ isTest: true });
    console.log("Templates de teste removidos");

    await mongoose.connection.close();
    server.close();
    console.log("Conexao com o banco de dados fechada");
  });

  it("deve atualizar um template pelo ID", async () => {
    const updatedData = {
      imagePath: "novo/caminho/da/imagem.png",
    };

    const response = await request(server)
      .patch(`/template/${templateId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imagePath).toBe(updatedData.imagePath);
  }, 20000);
});
