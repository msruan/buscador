import {question} from 'readline-sync'
import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { downloadPages } from './download'

async function main(){
    //Por enquanto, vou presumir que as pastas estão em \sites
    await downloadPages("https://msruan.github.io/samples/matrix.html");
    const home : string = "../sites/matrix.html"//question("Digite o nome da página inicial: ");
    let home_text = fs.readFileSync(home, 'utf8');

    const searched_term = "matrix"; 
    const pontuacoes = {
        //Quantidade dos Termos Buscados: Frequência com que os termos buscados 
        //aparecem no código-fonte da página:
        //Pontos: Cada ocorrência do termo buscado vale +5 pontos. Caso não existam ocorrências, a página não deve ser listada
        //c) Uso das Tags (head, h1, h2, p) para Relevância:
    
        // Pontos: Uso de termos buscados em title e meta tags (+20 pontos cada), h1 (+15
        // pontos cada ocorrência), h2 (+10 pontos cada), p (+5 pontos cada), a (+2pontos)
        "h1" : +15,
        "h2" : +10,
        "p" : +5,//e span
        "a" : +2,
    
        "autoridade" : +20,
        //Penalidades
        "autoreferencia" : -20,
        //Frescor do conteúdo
        "fresco" : +30,
        "velho" : -5,
    }
    jsonfile.writeFileSync('buscador/scores.json',pontuacoes);
    const default_scores : ScoreObject = jsonfile.readFileSync('../scores.json');
    // calcularPontuacoes(default_scores);

    const DOOM = parse(home_text);
    const ps = DOOM.querySelectorAll("p");
    for(let p of ps){
        if(p.text.toLocaleLowerCase().includes(searched_term.toLocaleLowerCase()))
            console.log("Achei "+searched_term);
    }

}
function calcularUsoDeTags(html : string, searched_term : string, scores : ScoreObject){
   
    const DOOM = parse(html);
    const h1s = DOOM.querySelectorAll("h1");
    const h2s = DOOM.querySelectorAll("h2");
    const ps = DOOM.querySelectorAll("p");
    const as = DOOM.querySelectorAll("a");
    let h1s_ocorrencias : number = 0;
    let h2s_ocorrencias : number = 0;
    let ps_ocorrencias : number = 0;
    let as_ocorrencias : number = 0;

    for(let h1 of h1s){
        if(h1.text.toLocaleLowerCase().includes(searched_term.toLocaleLowerCase()))
            h1s_ocorrencias++;
    }
    for(let h2 of h2s){
        if(h2.text.toLocaleLowerCase().includes(searched_term.toLocaleLowerCase()))
            h2s_ocorrencias++;
    }
    for(let p of ps){
        if(p.text.toLocaleLowerCase().includes(searched_term.toLocaleLowerCase()))
            ps_ocorrencias++;
    }
    for(let a of as){
        if(a.text.toLocaleLowerCase().includes(searched_term.toLocaleLowerCase()))
            as_ocorrencias++;
    }

    scores.h1 = scores.h1 * h1s_ocorrencias;
    scores.h2 = scores.h2 * h2s_ocorrencias;
    scores.p = scores. p * ps_ocorrencias;
    scores.a = scores.a * as_ocorrencias;
}


function calcularPontuacoes(site_html : string, searched_term : string, scoresDefault : ScoreObject)  {// : ScoreObject

    let scores : ScoreObject = {"h1":15,"h2":10,"p":5,"a":2,"autoridade":20,"autoreferencia":-20,"fresco":30,"velho":-5}

    calcularUsoDeTags(site_html,searched_term,scores);
    // c) Uso das Tags (head, h1, h2, p) para Relevância:

    // ‘
    // Pontos: Uso de termos buscados em title e meta tags (+20 pontos cada), h1 (+15
    // pontos cada ocorrência), h2 (+10 pontos cada), p (+5 pontos cada), a (+2pontos)


    
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

