import { ScheduleModel } from "../models/userModel.js";

export class GovService {

  async authenticateUser(userData) {
    try {
      const response = await fetch(
        "https://bora-impactar-prd.setd.rdmapps.com.br/api/login.json",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );
      const data = await response.json();
  
      if (!data || !data.ngo || !data.ngo.id) {
        throw new Error("Dados inválidos retornados pela API externa");
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
  
      return {
        data,
        schedule
      };
      
    }catch( error ) {
      throw new Error(error.message);
    } 
  }
} 