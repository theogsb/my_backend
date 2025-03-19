import request from "supertest";
import express from "express";
import { TemplateModel } from "../../src/models/userModel.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import fs from "fs";
import path from "path";
import templateRoutes from "../../src/routes/templateRoutes.js";

jest.mock("../../src/multer/multer.js", () => ({
  publicUpload: {
    single: () => (req, res, next) => {
      if (req.headers["content-type"]?.includes("multipart/form-data")) {
        req.file = {
          fieldname: "imagePath",
          originalname: "test-image.png",
          encoding: "7bit",
          mimetype: "image/png",
          destination: "./public/uploads/",
          filename: "test-image.png",
          path: "caminho/simulado/da/imagem.png",
          size: 1234
        };
      } else {
        req.file = undefined;
      }
      next();
    },
  },
}));

jest.mock("fs", () => ({
  ...jest.requireActual("fs"),
  unlinkSync: jest.fn(),
}));

let server;
let mongoServer;
let filePath;

const setupTestServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(templateRoutes);
  return app.listen(0);
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  server = await setupTestServer();

  filePath = path.resolve(__dirname, "temp_image.png");
  fs.writeFileSync(filePath, "conteúdo simulado do arquivo");
});

afterAll(async () => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  if (server) server.close();
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

describe("GET /template/", () => {
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
  });
});

describe("GET /template/:id", () => {
  let templateId;

  beforeAll(async () => {
    const template = await TemplateModel.create({
      imagePath: "caminho/da/imagem.png",
      isTest: true,
    });
    templateId = template._id;
  });

  it("deve retornar um template pelo ID", async () => {
    const response = await request(server).get(`/template/${templateId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data._id).toBe(templateId.toString());
    expect(response.body.data.imagePath).toBe("caminho/da/imagem.png");
  });

  it("deve retornar erro 404 se o template não for encontrado", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const response = await request(server).get(`/template/${invalidId}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Template não encontrado!");
  });
});

describe("POST /template", () => {
  it("deve criar um novo template", async () => {
    const response = await request(server)
      .post("/template")
      .field("isTest", true)
      .attach("imagePath", filePath);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imagePath).toBeDefined();
  });

  it("deve retornar erro quando nenhuma imagem é enviada", async () => {
    const response = await request(server)
      .post("/template")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Nenhuma imagem foi enviada."
    });
  });
});

describe("DELETE /template/:id", () => {
  let templateId;

  beforeAll(async () => {
    const template = await TemplateModel.create({
      imagePath: "caminho/da/imagem.png",
      isTest: true,
    });
    templateId = template._id;
  });

  it("deve excluir um template pelo ID", async () => {
    const response = await request(server).delete(`/template/${templateId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Template excluído com sucesso!");
  });

  it("deve retornar erro 404 se o template não for encontrado", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const response = await request(server).delete(`/template/${invalidId}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Template não encontrado!");
  });
});

describe("PATCH /template/:id", () => {
  let templateId;

  beforeAll(async () => {
    const template = await TemplateModel.create({
      imagePath: "caminho/da/imagem.png",
      isTest: true,
    });
    templateId = template._id;
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
  });

  it("deve retornar erro 404 se o template não for encontrado", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    const response = await request(server)
      .patch(`/template/${invalidId}`)
      .send({ imagePath: "novo/caminho/da/imagem.png" });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Template não encontrado!");
  });
});
