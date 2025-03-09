import express from "express";

const app = express();
app.use(express.json());

const dominio = "http://localhost:";
const port = 3000;

app.listen(port, () => console.log(`Rodando com express na porta ${port}!`));

export default app;