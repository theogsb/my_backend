import request from "supertest";
import express from "express";
import { ScheduleModel } from "../../src/models/userModel.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import fetch from "node-fetch";
import govRoutes from "../../src/routes/govRoutes.js";

// Mock da função fetch
jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("POST /apigov", () => {
  let server;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const app = express();
    app.use(express.json());
    app.use("/", govRoutes);
    server = app.listen(0);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    server.close();
  });

  it("deve criar um usuário e cronograma com dados válidos da API externa", async () => {
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          ngo: { id: "12345" }, // Dados simulados da API
        }),
    });

    const response = await request(server)
      .post("/apigov")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Usuário Criado com sucesso");
    expect(response.body.data.ngo.id).toBe("12345");
  });

  it("deve retornar erro se a API externa retornar dados inválidos", async () => {
    // Mock da resposta da API externa com dados inválidos
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    });

    const response = await request(server)
      .post("/apigov")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Dados inválidos retornados pela API externa"
    );
  });
});
