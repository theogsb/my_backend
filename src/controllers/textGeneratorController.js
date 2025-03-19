import { TextGeneratorService } from "../services/textGeneratorService.js";

export class TextGeneratorController {
  constructor() {
    this.service = new TextGeneratorService();
  }

  async generateText(req, res) {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({
          success: false,
          message: "Campo 'prompt' é obrigatório",
        });
      }

      const result = await this.service.generateText(prompt);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erro interno no servidor.",
        error: error.message,
      });
    }
  }
}