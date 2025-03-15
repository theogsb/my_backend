import express from "express";
import { ScheduleModel } from "../models/userModel.js";
import fetch from "node-fetch";

const router = express.Router();

router.post("/apigov", async (req, res) => {
  try {
    const response = await fetch(
      "https://bora-impactar-prd.setd.rdmapps.com.br/api/login.json",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );
    const data = await response.json();

    if (!data || !data.ngo || !data.ngo.id) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos retornados pela API externa",
      });
    }

    const userId = data.ngo.id;

    const schedule = await ScheduleModel.findOne({ userId });
    if (!schedule) {
      const newSchedule = new ScheduleModel({
        userId,
        posts: [],
      });
      await newSchedule.save();
    }

    res.json({
      success: true,
      message: "Usuário Criado com sucesso",
      data,
      schedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar usuário!",
      error: error.message,
    });
  }
});

export default router;
