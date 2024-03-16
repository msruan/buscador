import { Buscador } from "./Buscador";
import { Indexador } from "./Indexador";

import express from 'express';
import cors from 'cors';
import { PaginaScore } from "./PaginaScore";
import { Pagina } from "./Pagina";

async function main(){

    let indexador : Indexador = new Indexador();
    await indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
    indexador.carregarPaginasBaixadas();
    let google : Buscador = new Buscador(indexador);
    const scores : PaginaScore[] = await google.busca('matrix');

    scores.forEach ( (paginaScore) => {console.log("Pontos totais da página "+paginaScore.pagina.title
            +": " + paginaScore.score.calcularPontosTotais())
            console.log("Pontuação detalhada: "+paginaScore.score.toString());
        })

    const scoreTotalPorPagina : Pagina[] = google.ordenarSites(await scores)
    for(let site of scoreTotalPorPagina){
        console.log(site.title)
    }
    
    const app = express();

    // Define o diretório onde os arquivos estáticos (como HTML, CSS, imagens, etc.) serão servidos
    //app.use(express.static(path.join(__dirname, '../google')));
    app.use(express.json()) 
    app.use(cors())

    // Define a rota principal (localhost:300)
    app.get('/', (req, res) => {
        res.send('Servidor Node.js está rodando!')
    });

    //Define a rota a partir da qual será chamada a página de resultados
    app.get('/search/:value', async (req, res) => {
        const input = req.params.value
        const array =  await google.busca(input)
        
        res.json(array)
    });

    // Inicia o servidor na porta 3000
    app.listen(3000, () => {
    console.log('Servidor Express iniciado na porta 3000');
    });
}

main();