import request from "supertest";
import express from "express";
import router from "../../src/routes/textGeneratorRoutes.js";
import fetch from "node-fetch";

jest.mock("node-fetch", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("POST /generate-text", () => {
  let server;
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router);
    server = app.listen(0);
  });

  afterAll(() => {
    server.close();
  });

  it("deve retornar uma resposta gerada com sucesso", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: "Resposta mockada da API do Gemini",
                },
              ],
            },
          },
        ],
      }),
    });

    const response = await request(app)
      .post("/generate-text")
      .send({ prompt: "Test prompt" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Resposta gerada com sucesso!");
    expect(response.body.text).toBe("Resposta mockada da API do Gemini");
  });

  it("deve retornar erro 500 se a API do Gemini falhar", async () => {
    fetch.mockRejectedValueOnce(new Error("Erro na API do Gemini"));

    const response = await request(app)
      .post("/generate-text")
      .send({ prompt: "Teste de prompt" });

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Erro interno no servidor.");
    expect(response.body.error).toBe("Erro na API do Gemini");
  });

  it("deve retornar erro 400 se o prompt estiver ausente", async () => {
    const response = await request(app).post("/generate-text").send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Campo 'prompt' é obrigatório");
  });
});