import { Buscador } from "./Buscador";
import { Indexador } from "./Indexador";
import * as fs from "fs"

import express from 'express';
import cors from 'cors';
import path from 'path';

async function main(){
    let indexador : Indexador = new Indexador();
    // await indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
    let google : Buscador = new Buscador(indexador);
    console.log(await google.main());

    // console.log(listarArquivosDoDiretorio('../sites'));


    const app = express();

    // Define o diretório onde os arquivos estáticos (como HTML, CSS, imagens, etc.) serão servidos
    //app.use(express.static(path.join(__dirname, '../google')));
    app.use(express.json()) 
    app.use(cors())



    // Define a rota principal para enviar o arquivo HTML
    app.get('/search/:value', (req, res) => {
        console.log("chegueeeeeeeeeeeeeeeeeeeei to preparada pra arrasar")
        const input = req.query.inputValue

        console.log(input)
        res.json({"bianca": "input"})
    });

    // Inicia o servidor na porta 3000
    app.listen(3000, () => {
    console.log('Servidor Express iniciado na porta 3000');
    });
}


export function listarArquivosDoDiretorio(diretorio : string) : string[]{

    const arquivos : string[] = [];
    let listaDeArquivos = fs.readdirSync(diretorio);
    for(let k in listaDeArquivos) {
        arquivos.push(listaDeArquivos[k]);
    }
    return arquivos;


// downloadPages("https://msruan.github.io/samples/matrix.html");   
}
main();