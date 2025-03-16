import "./src/services/express.js"

import dotenv from "dotenv";
dotenv.config();

import connectToDatabase from './src/database/databaseConfig.js';
connectToDatabase();
