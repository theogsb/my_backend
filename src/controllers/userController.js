import { UserService } from "../services/userServices.js";

export class UserController {
  constructor() {
    this.service = new (UserService);
  }

  async createUser(req, res) {
    try {
      const { newUser, newSchedule } = await this.service.createUser(req.body);

      res.status(200).json({
        success: true,
        message: "Usuário Criado com sucesso",
        data: newUser,
        shedule: newSchedule
      });
      
    } catch (error) {
        if (error.message === "Dados inválidos retornados pela API externa") {
          res.status(400).json({
            success: false,
            message: error.message
          });
        }
      
        else {
          res.status(500).json({
            success: false,
            message: error.message
          }
        );
      }
    }
  }

  async getUser(req, res) {
    try {
      const response = await this.service.getUser(req.params.userId);

      res.status(200).json({
        success: true,
        message: "Usuário enviado com sucesso!",
        data: response
      });

    } catch( error ) {
      res.status(500).json({
        success: false,
        message: error.message
      })
    }
  }

}
