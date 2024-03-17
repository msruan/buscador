import {parse} from 'node-html-parser'
import * as jsonfile from 'jsonfile'
import {Indexador } from "./Indexador";

import { Pagina } from "./Pagina";
import { PaginaScore } from './PaginaScore';
import { Score } from './Score';
import { contarOcorrenciasSubstring, devolverData, takeLastElement } from "./utils";
import { ObjectType } from 'typescript';

export class Buscador {

    private indexador : Indexador

    constructor(indexador: Indexador){
        this.indexador = indexador;
    }

    public ordenarSites(paginasScores: PaginaScore[]): PaginaScore[] {

        const paginasOrdenadas = paginasScores.sort( (a,b) => {
            const somaPontuacao_a = a.score.calcularPontosTotais();
            const somaPontuacao_b = b.score.calcularPontosTotais();

            if(somaPontuacao_a == somaPontuacao_b){
                return 0;
            }
            else if(somaPontuacao_a < somaPontuacao_b){
                return 1;
            }
            else{
                return -1;
            }
        } );

        return paginasOrdenadas;
    }

    private ehExibivel(paginaScore : PaginaScore) : boolean {
        return paginaScore.score.frequencia > 0;
    }
    
    public async busca(searched_term : string) : Promise<Pagina[]>{

        const paginas : Pagina[] = this.indexador.paginasBaixadas;
        let paginasScores : PaginaScore[] = [];

        for(let pagina of paginas){
            const score : Score = this.calcularPontuacoes(pagina,searched_term);
            const paginaScore : PaginaScore = new PaginaScore(pagina,score);
            paginasScores.push(paginaScore);
        }

        let paginasScoresOrdenadas : PaginaScore[] = this.ordenarSites(paginasScores);
        //Mostra tabelas com scores no console
        paginasScoresOrdenadas.reverse().forEach((pagina)=>pagina.exibirTabelaScore());

        //Tirar as que nao incluem o termo pesquisado
        paginasScoresOrdenadas = paginasScoresOrdenadas.filter((paginaScore) => {return this.ehExibivel(paginaScore)});

        const paginasOrdenadas : Pagina[] = [];
        paginasScoresOrdenadas.forEach((paginaScore) => {paginasOrdenadas.push(paginaScore.pagina)});

        return paginasOrdenadas;        
    }

    private calcularPontuacoes(pagina : Pagina, searched_term : string) : Score {// : ScoreObject
        const paginas : Pagina[] = this.indexador.paginasBaixadas;
        const html : string = pagina.content
        let score : Score  = new Score();
        this.calcularFrequenciaDeTermo(html,searched_term,score)
        this.calcularUsoDeTags(html,searched_term,score);
        this.calcularFrescor(html,score);
        this.calcularAutoreferencia(pagina,score);
        this.calcularAutoridade(pagina,paginas,score)
        return score;
    }

    private calcularFrequenciaDeTermo(html : string, searched_term : string, scores : Score) : void{

        const ocorrencias = contarOcorrenciasSubstring(html.toUpperCase() ,searched_term.toUpperCase());
        scores.frequencia = ocorrencias * scores.frequencia;
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
                if(diferencaDeAnos != 0){
                    scores.fresco = scores.fresco + (diferencaDeAnos * scores.velho);
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

    private calcularAutoridade(paginaACalcular : Pagina, paginas : Pagina[], scores : Score){
        const links: Record<string,number> = {};
        const nomesDasPaginas : string [] = [];

        for(let pagina of paginas){
            links[pagina.link] = 0;
            nomesDasPaginas.push(pagina.link)
        }

        for(let pagina of paginas){
            const dom = parse(pagina.content);
            const as = dom.querySelectorAll('a')
            
            for(let a of as){
                const href :string = a.getAttribute("href") || "";
                if(nomesDasPaginas.includes(href)){
                    links[href] += 1;
                }
            }
        }
        
        let autoridade = 0;
        for(let [string,number] of Object.entries(links)){
        
            if(string === paginaACalcular.link){
                autoridade = number;  
            }
        }
        scores.autoridade = scores.autoridade * autoridade
    }
}