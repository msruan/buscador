import {question} from 'readline-sync'
import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { downloadPages } from './download'


async function main(){
    //Por enquanto, vou presumir que as pastas estão em \sites
    await downloadPages("https://msruan.github.io/samples/matrix.html");
    const home : string = "../sites/duna.html"//question("Digite o nome da página inicial: ");
    let home_text = fs.readFileSync(home, 'utf8');

    const searched_term = "duna"; 
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
    // jsonfile.writeFileSync('buscador/scores.json',pontuacoes);
    // const default_scores : ScoreObject = jsonfile.readFileSync('../scores.json');
    calcularPontuacoes(home_text,searched_term);

}
function calcularUsoDeTags(html : string, searched_term : string, scores : ScoreObject){
   
    const DOOM = parse(html);
    console.log("É "+DOOM.id);
    const h1s = DOOM.querySelectorAll("h1");
    const h2s = DOOM.querySelectorAll("h2");
    const ps = DOOM.querySelectorAll("p");
    console.log("O numero de ocorrencias em p é ",ps.length)
    const as = DOOM.querySelectorAll("a");
    let h1s_ocorrencias : number = 0;
    let h2s_ocorrencias : number = 0;
    let ps_ocorrencias : number = 0;
    let as_ocorrencias : number = 0;

    for(let h1 of h1s){
        
        if(h1.text.toUpperCase().includes(searched_term.toUpperCase())){
            h1s_ocorrencias += contarOcorrenciasSubstring(h1.text.toUpperCase(),searched_term.toUpperCase());
        }
    }
    for(let h2 of h2s){
        if(h2.text.toUpperCase().includes(searched_term.toUpperCase())){
            h2s_ocorrencias += contarOcorrenciasSubstring(h2.text.toUpperCase(),searched_term.toUpperCase());
        }
    }
    for(let p of ps){
        if(p.text.toUpperCase().includes(searched_term.toUpperCase())){
            ps_ocorrencias += contarOcorrenciasSubstring(p.text.toUpperCase(),searched_term.toUpperCase());
        }
    }
    for(let a of as){
        if(a.text.toUpperCase().includes(searched_term.toUpperCase())){
            as_ocorrencias += contarOcorrenciasSubstring(a.text.toUpperCase(),searched_term.toUpperCase());
        }
    }

    scores.h1 = scores.h1 * h1s_ocorrencias;
    scores.h2 = scores.h2 * h2s_ocorrencias;
    scores.p = scores.p * ps_ocorrencias;
    scores.a = scores.a * as_ocorrencias;
}

function calcularFrescor(html : string, searched_term : string, scores : ScoreObject){
    const DOOM = parse(html);
    const ps = DOOM.querySelectorAll("p");
    for(let p of ps){
        if(p.text.toUpperCase().startsWith("Data".toUpperCase())){
            let splited : string[] = p.text.split(" ");
            const last_index = splited.length - 1;
            const data_str : string = splited[last_index];
            const data : Date = devolverData(data_str);
            console.log("A data é "+data);
            console.log("A data atual é "+new Date());
            const diferencaDeAnos : number = new Date().getFullYear()-data.getFullYear();
            if(diferencaDeAnos == 0)
                scores.velho = 0;
            else {

            }
        }
    }

//     e) Frescor do Conteúdo: Avaliado pela data de publicação da página.
// Pontos: Páginas publicadas no ano corrente recebem +30 pontos, com uma
// redução de -5 pontos para cada ano anterior.
}

function devolverData(str_data: string) : Date {
    var partesData = str_data.split("/").map(parseFloat);
    var data : Date = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    return data;
}

function calcularPontuacoes(site_html : string, searched_term : string)  {// : ScoreObject

    let scores : ScoreObject = {"h1":15,"h2":10,"p":5,"a":2,"autoridade":20,"autoreferencia":-20,"fresco":30,"velho":-5}
    calcularUsoDeTags(site_html,searched_term,scores);
    calcularFrescor(site_html,searched_term,scores);
    console.log(scores);
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

function contarOcorrenciasSubstring(str: string, substr: string){
    return str.split(substr).length - 1;
}

main();

