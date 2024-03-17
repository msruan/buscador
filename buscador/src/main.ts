import { Buscador } from "./Buscador";
import { Indexador } from "./Indexador";
import { Pagina } from "./Pagina";
import { criarPaginaResultados } from "./index";

import express from 'express';
import cors from 'cors';
import * as jsonfile from 'jsonfile'
import * as fs from 'fs';

async function main(){

    let indexador : Indexador = new Indexador();
    await indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
    indexador.carregarPaginasBaixadas();
    let google : Buscador = new Buscador(indexador);
    const scores : Pagina[] = await google.busca('matrix');

    // scores.forEach ( (paginaScore) => {console.log("Pontos totais da página "+paginaScore.pagina.title
    //         +": " + paginaScore.score.calcularPontosTotais())
    //         console.log("Pontuação detalhada: "+paginaScore.score.toString());
    //     })

    const app = express();

    // Define o diretório onde os arquivos estáticos (como HTML, CSS, imagens, etc.) serão servidos
    //app.use(express.static(path.join(__dirname, '../google')));
    app.use(express.json()) 
    app.use(cors())

    // Define a rota principal (localhost:300)
    app.get('/', (req, res) => {
        res.send('Servidor Node.js está rodando!')
    });

    // Inicia o servidor na porta 3000
    app.listen(3000, () => {
    console.log('Servidor Express iniciado na porta 3000');
    });

    app.get('/search/:value', async (req, res) => {
        const input = req.params.value;
        const results = await google.busca(input);
        const html = criarPaginaResultados(results,input); // Função para criar a página HTML com os resultados
        res.send(html);
    });

    // app.get('/config/:value', async (req, res) => {

    //     fs.writeFileSync('eba.txt',"só alegria haha");
    //     try {

    //     const input = req.params.value;

    //         Recebe os dados enviados pelo cliente
    //         const newData = req.params.value;
    
    //         Lê o arquivo JSON existente
    //         let jsonData = jsonfile.readFileSync('../scores.json');
    //         jsonData = JSON.parse(jsonData);
    
    //         Atualiza os dados existentes com os novos dados
    //         Object.assign(jsonData, newData);
    
    //         Escreve os dados atualizados de volta no arquivo JSON
    //         jsonfile.writeFileSync('../scores.json', jsonData);
    //         jsonfile.writeFileSync('dados.json', JSON.stringify(jsonData, null, 2));
    
    //         res.send('JSON atualizado com sucesso');
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send('Erro ao atualizar JSON');
    //     }
    // });
    
    app.post('/atualizar-json', /**
     * Description placeholder
     * @date 17/03/2024 - 14:01:38
     *
     * @async
     * @param {*} req
     * @param {*} res
     * @returns {*}
     */
    async (req, res) => {
        try {
            // Recebe os dados enviados pelo cliente
            const newData = req.body;

            

            /*75

It means you are alerting an instance of an object. When alerting the object, toString() is called on the object, and the default implementation returns [object Object].
 */

            // var strBuilder = [];
            // for(key in newData) {
            // if (newData.hasOwnProperty(key)) {
            //     strBuilder.push("Key is " + key + ", value is " + jsonObj[key] + "\n");
            // }
            // }

            // alert(strBuilder.join(""));
            
            console.log("OBA! Recebi ");//vem pra Script.js
            // console.log(newData);
            console.log(JSON.stringify(newData,null,2))
            
            // Lê o arquivo JSON existente
            // let jsonData = jsonfile.readFileSync('../scores.json');
            // jsonData = JSON.parse(jsonData);
    
            // Atualiza os dados existentes com os novos dados
            // Object.assign(jsonData, newData);
            
            // Escreve os dados atualizados de volta no arquivo JSON
            jsonfile.writeFileSync('../scores.json', newData);
            // jsonfile.writeFileSync('dados.json', JSON.stringify(jsonData, null, 2));
            res.json(newData);
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao atualizar JSON');
        }
    });
}
main();