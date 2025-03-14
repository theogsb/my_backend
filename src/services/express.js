import express from "express";
import templateRoutes from "../routes/templateRoutes.js";
import textGeneratorRoutes from "../routes/textGeneratorRoutes.js";
import postsRoutes from '../routes/postsRoutes.js';

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(templateRoutes);
app.use(textGeneratorRoutes);
app.use(postsRoutes);

const server = app.listen(port, () => {
  console.log(`Rodando com express na porta ${port}!`);
});

export { app, server };
