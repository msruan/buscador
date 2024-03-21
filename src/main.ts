import { Buscador } from "./Buscador";
import { Indexador } from "./Indexador";

import express from "express";
import cors from "cors";
import * as jsonfile from "jsonfile";

async function main() {
  let indexador: Indexador = new Indexador();
  // const fonte : string = jsonfile.readFileSync('../scores.json').fonte;
  // console.log("A fonte é "+fonte);
  await indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
  indexador.carregarPaginasBaixadas();
  let google: Buscador = new Buscador(indexador);
  // const scores : PaginaScore[] = await google.busca('matrix');

  const app = express();
  app.use(express.json());
  app.use(cors());

  // Define a rota principal (localhost:300)
  app.get("/", (req, res) => {
    res.send("Servidor Node.js está rodando!");
  });

  // Inicia o servidor na porta 3000
  app.listen(3000, () => {
    console.log("Servidor Express iniciado na porta 3000");
  });

  app.get("/search/:value", async (req, res) => {
    const input = req.params.value;
    const results = await google.busca(input);
    // const html = criarPaginaResultados(results,input); // Função para criar a página HTML com os resultados
    res.json(results);
  });

  app.post("/atualizar-scores", async (req, res) => {
    try {
      const scores = jsonfile.readFileSync("../scores.json");
      res.json(scores);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao atualizar JSON");
    }
  });

  app.post("/resetar-scores", async (req, res) => {
    try {
      const scores = jsonfile.readFileSync("../default_scores.json");
      jsonfile.writeFileSync("../scores.json", scores);
      res.json(scores);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao atualizar JSON");
    }
  });

  app.post("/atualizar-json", async (req, res) => {
    try {
      const newData = req.body;
      jsonfile.writeFileSync("../scores.json", newData);
      res.json(newData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao atualizar JSON");
    }
  });
}
main();
