import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import connectToDatabase from './src/database/connect.js';
import userRoutes from './src/routes/userRoutes.js';
import templateRoutes from './src/routes/templateRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';
import scheduleRoutes from './src/routes/scheduleRoutes.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use("/api", profileRoutes);
app.use("/api", scheduleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/templates", templateRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});

connectToDatabase();
