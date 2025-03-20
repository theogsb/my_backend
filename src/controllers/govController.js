import { GovService } from "../services/govService.js";

export class GovController {
  constructor() {
    this.service = new GovService();
  }

  async createUser(req, res) {
    try {
      const { data, schedule } = await this.service.authenticateUser(req.body);

      return res.status(200).json({
        success: true,
        message: "Usuário Criado com sucesso",
        data,
        schedule,
      });
      
    } catch (error) {
        if (error.message === "Dados inválidos retornados pela API externa") {
          return res.status(400).json({
            success: false,
            message: error.message
          });
        }
      
        else {
          return res.status(500).json({
            success: false,
            message: error.message
          }
        );
      }
}}}
