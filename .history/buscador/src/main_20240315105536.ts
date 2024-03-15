import { Buscador } from "./Buscador";
import { Indexador } from "./Indexador";
import * as fs from "fs"

import express from 'express';
import path from 'path';


async function main(){
    let indexador : Indexador = new Indexador();
    // await indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
    let google : Buscador = new Buscador(indexador);
    console.log(await google.main());

    // console.log(listarArquivosDoDiretorio('../sites'));
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