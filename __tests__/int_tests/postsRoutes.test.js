import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import postsRoutes from "../../src/routes/postsRoutes.js";
import { ScheduleModel } from "../../src/models/userModel.js";
import fs from "fs";
import path from "path";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.NODE_ENV = "test";

let mongoServer;
let server;

const setupTestServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(postsRoutes);
  return app.listen(0);
};

const connectToDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

const cleanupDatabase = async () => {
  await ScheduleModel.deleteMany({});
};

const closeServerAndDatabase = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
};

describe("Testes das rotas de posts", () => {
  let userId;
  let postId;
  let testFilePath;

  beforeAll(async () => {
    await connectToDatabase();
    server = await setupTestServer();

    const schedule = await ScheduleModel.create({
      userId: "testUserId",
      posts: [],
    });
    userId = schedule.userId;

    const testUploadsDir = path.join(__dirname, "temp_uploads");
    if (!fs.existsSync(testUploadsDir)) {
      fs.mkdirSync(testUploadsDir, { recursive: true });
    }

    testFilePath = path.join(testUploadsDir, "test-file.png");
    fs.writeFileSync(testFilePath, "Conteudo do arquivo de teste");

    const createResponse = await request(server)
      .post(`/schedule/${userId}/posts`)
      .field("platform", "instagram")
      .field("postText", "Test post text")
      .field("postDate", "2025-10-01")
      .field("postTime", "10:00")
      .attach("imagePath", testFilePath);

    postId = createResponse.body.data.posts[0]._id;
  });

  afterAll(async () => {
    const testUploadsDir = path.join(__dirname, "temp_uploads");
    if (fs.existsSync(testUploadsDir)) {
      fs.rmSync(testUploadsDir, { recursive: true, force: true });
    }

    await cleanupDatabase();
    await closeServerAndDatabase();
  });

  describe("POST /schedule/:userId/posts", () => {
    it("deve criar uma nova postagem", async () => {
      const response = await request(server)
        .post(`/schedule/${userId}/posts`)
        .field("platform", "instagram")
        .field("postText", "Test post text")
        .field("postDate", "2025-10-01")
        .field("postTime", "10:00")
        .attach("imagePath", testFilePath);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Postagem criada com sucesso!");
      expect(response.body.data).toBeDefined();
      expect(response.body.data.posts[0]._id).toBeDefined();
    });

    it("deve retornar erro ao criar postagem sem dados obrigatórios", async () => {
      const response = await request(server)
        .post(`/schedule/${userId}/posts`)
        .field("platform", "")
        .field("postDate", "")
        .field("postTime", "")
        .attach("imagePath", testFilePath);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Campos obrigatórios incompletos");
    });
  });

  describe("GET /schedule/:userId/posts/:postId", () => {
    it("deve retornar uma postagem específica", async () => {
      const response = await request(server).get(
        `/schedule/${userId}/posts/${postId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(postId);
    });

    it("deve retornar erro ao buscar postagem inexistente", async () => {
      const response = await request(server).get(
        `/schedule/${userId}/posts/invalidPostId`
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PATCH /schedule/:userId/posts/:postId", () => {
    it("deve atualizar uma postagem existente", async () => {
      const updatedData = {
        platform: "facebook",
        postText: "Texto atualizado",
        postDate: "2025-05-02",
        postTime: "13:00",
      };

      const response = await request(server)
        .patch(`/schedule/${userId}/posts/${postId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Postagem atualizada com sucesso!");
      expect(response.body.data.posts[0].platform).toBe(updatedData.platform);
      expect(response.body.data.posts[0].postText).toBe(updatedData.postText);

      const receivedDate = new Date(response.body.data.posts[0].postDate)
        .toISOString()
        .split("T")[0];

      expect(receivedDate).toBe(updatedData.postDate);
      expect(response.body.data.posts[0].postTime).toBe(updatedData.postTime);
    });

    it("deve retornar erro ao atualizar uma postagem inexistente", async () => {
      const updatedData = {
        platform: "facebook",
        postText: "Texto atualizado",
        postDate: "2025-09-15",
        postTime: "11:00",
      };

      const response = await request(server)
        .patch(`/schedule/${userId}/posts/invalidPostId`)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Postagem não encontrada!");
    });

    it("deve retornar erro ao atualizar com campos inválidos", async () => {
      const updatedData = {
        platform: "",
        postDate: "",
        postTime: "",
      };

      const response = await request(server)
        .patch(`/schedule/${userId}/posts/${postId}`)
        .send(updatedData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Campos obrigatórios incompletos");
    });
  });

  describe("DELETE /schedule/:userId/posts/:postId", () => {
    it("deve excluir uma postagem existente", async () => {
      const response = await request(server).delete(
        `/schedule/${userId}/posts/${postId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Postagem excluída com sucesso!");
      expect(response.body.data).toBeDefined();

      const schedule = await ScheduleModel.findOne({ userId });
      const post = schedule.posts.id(postId);
      expect(post).toBeNull();
    });

    it("deve retornar erro ao tentar excluir uma postagem inexistente", async () => {
      const response = await request(server).delete(
        `/schedule/${userId}/posts/invalidPostId`
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Postagem não encontrada!");
    });

    it("deve retornar erro ao tentar excluir uma postagem de um usuário inexistente", async () => {
      const response = await request(server).delete(
        `/schedule/invalidUserId/posts/${postId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Cronograma não encontrado!");
    });
  });
});
