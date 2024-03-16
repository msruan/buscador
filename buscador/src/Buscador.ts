import {parse} from 'node-html-parser'
import * as jsonfile from 'jsonfile'
import {Indexador } from "./Indexador";

import { Pagina } from "./Pagina";
import { PaginaScore } from './PaginaScore';
import { Score } from './Score';
import { contarOcorrenciasSubstring, devolverData, takeLastElement } from "./utils";

export class Buscador {

    private indexador : Indexador

    constructor(indexador: Indexador){
        this.indexador = indexador;
    }

    public async busca(searched_term : string) : Promise<PaginaScore[]>{

        const paginas : Pagina[] = this.indexador.paginasBaixadas;
        const paginasScores : PaginaScore[] = [];

        for(let pagina of paginas){
            const score : Score = this.calcularPontuacoes(pagina,searched_term);
            const paginaScore : PaginaScore = new PaginaScore(pagina,score);
            paginasScores.push(paginaScore);
        }
        return paginasScores;
    }

    private calcularPontuacoes(pagina : Pagina, searched_term : string) : Score {// : ScoreObject

        const html : string = pagina.content
        let scores : Score = jsonfile.readFileSync('../scores.json');
        this.calcularUsoDeTags(html,searched_term,scores);
        this.calcularFrescor(html,scores);
        this.calcularAutoreferencia(pagina,scores);
        return scores;
    }

    private calcularUsoDeTags(html : string, searched_term : string, scores : Score){
    
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
            
            if(h1.text.toUpperCase().includes(searched_term.toUpperCase())){//@Todo: substituir por um reduce todos esses fors 
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

    private calcularFrescor(html : string, scores : Score){

        const DOOM = parse(html);
        const ps = DOOM.querySelectorAll("p");

        for(let p of ps){
            if(p.text.toUpperCase().startsWith("Data".toUpperCase())){
                let splited : string[] = p.text.split(" ");
                const last_index = splited.length - 1;//Porque a data sempre é a última palavra em frases como "Data de publicação: 12/02/1960"
                const data_str : string = splited[last_index];
                const data : Date = devolverData(data_str);
                const diferencaDeAnos : number = new Date().getFullYear() - data.getFullYear();
                if(diferencaDeAnos == 0)
                    scores.velho = 0;
                else {
                    scores.fresco = 0;
                    scores.velho = diferencaDeAnos * scores.velho;
                }
            }
        }
    }

    private calcularAutoreferencia(pagina : Pagina, scores : Score){

        const link : string = pagina.link;
        const html : string = pagina.content;
        const DOM = parse(html);
        const as = DOM.querySelectorAll("a");
        let autoreferencias : number = 0;

        for(let a of as){
            const href :string = a.getAttribute("href") || "";
            if(takeLastElement(link) == href){
                autoreferencias++;
            }
        }
        scores.autoreferencia = autoreferencias * scores.autoreferencia;
    }

    private calcularAutoridade(paginaACalcular : Pagina, paginas : Pagina[]){
        const links = {
            "matriz.html" : 0
        }
        const nomesDasPaginas : string [] = [];
        paginas.forEach((pagina)=>nomesDasPaginas.push(pagina.link));
    }
}