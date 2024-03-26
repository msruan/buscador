import {parse} from 'node-html-parser'
import {Indexador } from "./Indexador";

import { Pagina } from "./Pagina";
import { PaginaScore } from './PaginaScore';
import { Score } from './Score';
import { contarOcorrenciasSubstring, devolverData, takeLastElement } from "./utils";


 /**
     * A partir de um array de Páginas e um termo buscado, realiza o ranqueamento dos sites. Responsável por fornecer o array de Páginas para a classe Buscador.
     * Baixa um conjunto de páginas a partir de uma URL inicial
     * e realiza a instanciação dos objetos Página a partir dos sites locais no sistema de arquivos.
     * @class
     */
export class Buscador {

    private indexador : Indexador

    constructor(indexador: Indexador){
        this.indexador = indexador;
    }

       /**
     * A partir das páginas baixadas por um Indexador, percorre cada página calculando sua pontuação 
     * a partir de um termo buscado e devolve um array ordenado das páginas e seus scores.
     * @method
     */
       public async busca(searched_term : string) : Promise<PaginaScore[]>{

        const paginas : Pagina[] = this.indexador.paginasBaixadas;
        let paginasScores : PaginaScore[] = [];

        for(let pagina of paginas){
            const score : Score = this.calcularPontuacoes(pagina,searched_term);
            const paginaScore : PaginaScore = new PaginaScore(pagina,score);
            paginasScores.push(paginaScore);
        }

        let paginasScoresOrdenadas : PaginaScore[] = this.ordenarSites(paginasScores);
    
        return paginasScoresOrdenadas;        
    }

        /**
     * Esta é uma função que recebe um array desordenado e aplica um 'sort' baseado primeiramente
     * no maior score total e depois nos critérios de desempate.
     * @method
     */
    public ordenarSites(paginasScores: PaginaScore[]): PaginaScore[] {

        const paginasOrdenadas = paginasScores.sort( (a,b) => {
            const somaPontuacao_a = a.score.calcularPontosTotais();
            const somaPontuacao_b = b.score.calcularPontosTotais();

            if(somaPontuacao_a == somaPontuacao_b){
                /*a. Maior quantidade de termos buscados no corpo do texto; 
                b. Maior frescor do conteúdo (datas mais recentes); 
                c. Maior número de links recebidos */
                if(a.score.frequencia == b.score.frequencia){
                    if(a.score.fresco == b.score.fresco){
                        if(a.score.autoridade == b.score.autoridade)
                            return 0;
                        else if(a.score.autoridade < b.score.autoridade)
                            return -1;
                        else 
                            return 1;

                    }
                    else if(a.score.fresco < b.score.fresco){
                        return 1;
                    }
                    else
                        return -1;
                }
                else if(a.score.frequencia < b.score.frequencia){
                    return 1;
                }
                else
                    return -1;
            }
            return -(somaPontuacao_a-somaPontuacao_b);
        } );

        return paginasOrdenadas;
    }
    

    private calcularPontuacoes(pagina : Pagina, searched_term : string) : Score {
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

       /**
     * Percorre o array de Páginas e usa um dicionário para guardar o nome do site e o número de referências totais.
     * @method
     */
    private calcularAutoridade(paginaACalcular : Pagina, paginas : Pagina[], scores : Score) : void{
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