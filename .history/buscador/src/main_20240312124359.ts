import {question} from 'readline-sync'
import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import fs from 'fs'
import jsonfile from 'jsonfile'
import { downloadPages } from './download'

async function main(){
    //Por enquanto, vou presumir que as pastas estão em \sites
    await downloadPages("https://msruan.github.io/samples/matrix.html");
    const home : string = "../sites/matrix.html"//question("Digite o nome da página inicial: ");
    const searched_term = "matrix"; 
    
    // jsonfile.writeFileSync('../scores.json',pontuacoes);
    const default_scores : ScoreObject = jsonfile.readFileSync('../scores.json');
    calcularPontuacoes(default_scores);
}

function calcularPontuacoes(scores : ScoreObject) : number{

    return -1;
}

type ScoreObject = {
    h1: number;
    h2: number;
    p: number;
    a: number;
    autoridade: number;
    autoreferencia: number;
    fresco: number;
    velho: number;
};

main();

