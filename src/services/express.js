import express from "express";

import govRoutes from "../routes/govRoutes.js";
import postsRoutes from '../routes/postsRoutes.js';
import templateRoutes from "../routes/templateRoutes.js";
import textGeneratorRoutes from "../routes/textGeneratorRoutes.js";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(govRoutes);
app.use(postsRoutes);
app.use(templateRoutes);
app.use(textGeneratorRoutes);

const server = app.listen(port, () => {
  console.log(`Rodando com express na porta ${port}!`);
});

export { app, server };
