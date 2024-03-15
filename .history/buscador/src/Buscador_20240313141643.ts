import { Pagina, PaginaScore } from "./Pagina";
import { link } from "fs";
import {question} from 'readline-sync'
import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import {Indexador } from "./Indexador";
import { listarArquivosDoDiretorio } from "./main";

export class Buscador {
    // private paginas : Pagina[];

    private indexador : Indexador

    constructor(indexador: Indexador){
        this.indexador = indexador;
    }

    public async pesquisa(termo_procurado : string){
        
    }

    async main() : PaginaScore[]{

        const paginasScores : PaginaScore[] = [];

        await this.indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
        const home : string = "../sites/matrix.html"//question("Digite o nome da página inicial: ");
        let home_text = fs.readFileSync(home, 'utf8');

        const searched_term = "matriz"; 
        const pontuacoes = {
            "h1" : +15,
            "h2" : +10,
            "p" : +5,
            "a" : +2,
        
            "autoridade" : +20,
            "autoreferencia" : -20,
            "fresco" : +30,
            "velho" : -5,
        }
        // jsonfile.writeFileSync('buscador/scores.json',pontuacoes);
        // const default_scores : ScoreObject = jsonfile.readFileSync('../scores.json');
        const paginas : Pagina[] = this.indexador.paginasBaixadas;
        for(let pagina of paginas){
            const score : ScoreObject = this.calcularPontuacoes(pagina,searched_term);
            const paginaScore : PaginaScore = new PaginaScore(pagina,score);
            pa
        }

        return paginasScores;
    }

    private calcularPontuacoes(pagina : Pagina, searched_term : string) : ScoreObject {// : ScoreObject

        const html : string = pagina.content
        let scores : ScoreObject = {"h1":15,"h2":10,"p":5,"a":2,"autoridade":20,"autoreferencia":-20,"fresco":30,"velho":-5}
        this.calcularUsoDeTags(html,searched_term,scores);
        this.calcularFrescor(html,scores);
        this.calcularAutoreferencia(pagina,scores);
        console.log(scores);
        return scores;
    }

    private calcularUsoDeTags(html : string, searched_term : string, scores : ScoreObject){
    
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
                h1s_ocorrencias += this.contarOcorrenciasSubstring(h1.text.toUpperCase(),searched_term.toUpperCase());
            }
        }
        for(let h2 of h2s){
            if(h2.text.toUpperCase().includes(searched_term.toUpperCase())){
                h2s_ocorrencias += this.contarOcorrenciasSubstring(h2.text.toUpperCase(),searched_term.toUpperCase());
            }
        }
        for(let p of ps){
            if(p.text.toUpperCase().includes(searched_term.toUpperCase())){
                ps_ocorrencias += this.contarOcorrenciasSubstring(p.text.toUpperCase(),searched_term.toUpperCase());
            }
        }
        for(let a of as){
            if(a.text.toUpperCase().includes(searched_term.toUpperCase())){
                as_ocorrencias += this.contarOcorrenciasSubstring(a.text.toUpperCase(),searched_term.toUpperCase());
            }
        }

        scores.h1 = scores.h1 * h1s_ocorrencias;
        scores.h2 = scores.h2 * h2s_ocorrencias;
        scores.p = scores.p * ps_ocorrencias;
        scores.a = scores.a * as_ocorrencias;
    }

    private calcularFrescor(html : string, scores : ScoreObject){
        const DOOM = parse(html);
        const ps = DOOM.querySelectorAll("p");
        for(let p of ps){
            if(p.text.toUpperCase().startsWith("Data".toUpperCase())){
                let splited : string[] = p.text.split(" ");
                const last_index = splited.length - 1;
                const data_str : string = splited[last_index];
                const data : Date = this.devolverData(data_str);
                console.log("A data é "+data);
                console.log("A data atual é "+new Date());
                const diferencaDeAnos : number = new Date().getFullYear()-data.getFullYear();
                if(diferencaDeAnos == 0)
                    scores.velho = 0;
                else {
                    scores.fresco = 0;
                    scores.velho = diferencaDeAnos * scores.velho;
                }
            }
        }
    }

    private devolverData(str_data: string) : Date {
        var partesData = str_data.split("/").map(parseFloat);
        var data : Date = new Date(partesData[2], partesData[1] - 1, partesData[0]);
        return data;
    }

    private calcularAutoreferencia(pagina : Pagina, scores : ScoreObject){

        const link : string = pagina.link;
        const html : string = pagina.content;
        const DOM = parse(html);
        const as = DOM.querySelectorAll("a");
        let autoreferencias : number = 0;
        console.log("To em cima do for")
        for(let a of as){
            const href :string = a.getAttribute("href") || "";
            if(this.indexador.takeLastElement(link) == href){
                autoreferencias++;
            }
        }
        scores.autoreferencia = autoreferencias * scores.autoreferencia;
    }

    

    private contarOcorrenciasSubstring(str: string, substr: string){
        return str.split(substr).length - 1;
    }

    private calcularAutoridade(paginaACalcular : Pagina, paginas : Pagina[]){
        const links = {
            "matriz.html" : 0
        }
        const nomesDasPaginas : string [] = [];
        paginas.forEach((pagina)=>nomesDasPaginas.push(pagina.link));
    }
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