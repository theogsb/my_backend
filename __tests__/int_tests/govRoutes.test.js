import request from "supertest";
import express from "express";
import { ScheduleModel } from "../../src/models/userModel.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import govRoutes from "../../src/routes/govRoutes.js";

// Mock do node-fetch
jest.mock("node-fetch", () => jest.fn());
import fetch from "node-fetch";

describe("Gov Routes Tests", () => {
  let server;
  let mongoServer;

  const setupTestServer = async () => {
    const app = express();
    app.use(express.json());
    app.use(govRoutes);
    return app.listen(0);
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    server = await setupTestServer();
  });

  afterAll(async () => {
    if (server) server.close();
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  beforeEach(async () => {
    await ScheduleModel.deleteMany({});
    jest.clearAllMocks();
  });

  describe("POST /apigov", () => {
    it("deve autenticar usuário com sucesso e criar cronograma", async () => {
      // Mock da resposta da API externa
      const mockApiResponse = {
        ngo: {
          id: "123456",
          name: "ONG Teste"
        }
      };

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockApiResponse)
      });

      const response = await request(server)
        .post("/apigov")
        .send({
          cnpj: "12345678901234",
          password: "senha123"
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Usuário Criado com sucesso");
      expect(response.body.data.ngo.id).toBe("123456");
      
      // Verifica se o cronograma foi criado
      const schedule = await ScheduleModel.findOne({ userId: "123456" });
      expect(schedule).toBeTruthy();
      expect(schedule.posts).toHaveLength(0);
    });

    it("deve retornar erro quando a API externa retorna dados inválidos", async () => {
      // Mock de resposta inválida da API
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ error: "Invalid credentials" })
      });

      const response = await request(server)
        .post("/apigov")
        .send({
          cnpj: "12345678901234",
          password: "senha_errada"
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Dados inválidos retornados pela API externa");
    });

    it("deve retornar erro quando a API externa está indisponível", async () => {
      // Mock de erro de rede
      fetch.mockRejectedValueOnce(new Error("Network error"));

      const response = await request(server)
        .post("/apigov")
        .send({
          cnpj: "12345678901234",
          password: "senha123"
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Erro ao criar usuário!");
    });

    it("não deve criar cronograma duplicado se usuário já existe", async () => {
      // Primeiro cria um cronograma
      await ScheduleModel.create({
        userId: "123456",
        posts: []
      });

      // Mock da resposta da API externa
      const mockApiResponse = {
        ngo: {
          id: "123456",
          name: "ONG Teste"
        }
      };

      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockApiResponse)
      });

      const response = await request(server)
        .post("/apigov")
        .send({
          cnpj: "12345678901234",
          password: "senha123"
        });

      expect(response.status).toBe(200);
      
      // Verifica se ainda existe apenas um cronograma
      const schedules = await ScheduleModel.find({ userId: "123456" });
      expect(schedules).toHaveLength(1);
    });
  });
}); 