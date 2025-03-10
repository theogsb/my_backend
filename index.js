import "./src/routes/govRoutes.js";
import "./src/routes/templateRoutes.js"
import "./src/routes/postsRoutes.js";
import "./src/textGenerator/textGenerator.js"

import dotenv from "dotenv";
dotenv.config();

import connectToDatabase from './src/database/databaseConfig.js';
connectToDatabase();
