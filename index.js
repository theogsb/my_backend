import "./src/routes/govRoutes.js";
import "./src/routes/scheduleRoutes.js";
import "./src/routes/templateRoutes.js"

// Parte do banco de dados
import dotenv from "dotenv";
dotenv.config();

import connectToDatabase from './src/database/databaseConfig.js';
connectToDatabase();
