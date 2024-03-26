import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs';
import { Pagina } from './Pagina';
import { contarOcorrenciasSubstring, listarArquivosDoDiretorio, readWebPageHTML, takeLastElement, trasnformarURLRelativaEmNormal } from './utils';

 /**
 * Responsável por fornecer o array de Páginas para a classe Buscador.
 * @class
 */
export class Indexador {

    private _paginasBaixadas : Pagina[] = [];
    private _dirPaginasBaixadas : string = '../sites/';
    

    constructor(){
        this.carregarPaginasBaixadas();
    }

    public get paginasBaixadas() : Pagina[] {
        return this._paginasBaixadas;
    }

    /**
     * Realiza a instanciação dos objetos Página a partir dos sites locais no sistema de arquivos.
     * @class
     */
    public carregarPaginasBaixadas() : void{

        if(this.paginasBaixadas.length == 0){

            const nomeDasPaginasBaixadas : string[] = listarArquivosDoDiretorio(this._dirPaginasBaixadas);

            if(nomeDasPaginasBaixadas.length > 0){

                for(let nome of nomeDasPaginasBaixadas){

                    const conteudo : string = fs.readFileSync(`${this._dirPaginasBaixadas}${nome}`).toString();
                    const pagina : Pagina = new Pagina(nome,conteudo);
                    this.paginasBaixadas.push(pagina);
                }
            }
        }
    }

    /**
     * Baixa um conjunto de páginas a partir de uma URL inicial
     * @method
    */
    public async downloadPages(url : string) : Promise<void>{

        const file_name = takeLastElement(url)
        if(this.jaBaixeiEssaPagina(file_name)){
            return;
        }
        const text : string = await readWebPageHTML(url);

        this.downloadPage(text,file_name);

        const DOM = parse(text);
        const links = DOM.querySelectorAll("a");

        for(let a of links){

            let href : string = a.getAttribute("href") || "";
            let page_name : string = takeLastElement(href);
            href = trasnformarURLRelativaEmNormal(url,page_name);
            await this.downloadPages(href);
        }
        console.log("Indexador diz: páginas baixadas!")
    }

    /**
     * Salva o conteúdo de uma página localmente no sistema de arquivos
     * @method
    */
    private downloadPage(text: string, page_name : string) : void{
        
        if (!fs.existsSync(this._dirPaginasBaixadas)) {
            fs.mkdirSync(this._dirPaginasBaixadas, { recursive: true });
        }
        fs.writeFileSync(`${this._dirPaginasBaixadas}${page_name}`,text);
    }

    private jaBaixeiEssaPagina(file_name : string){

        if (!fs.existsSync(this._dirPaginasBaixadas)) {
            return false;
        }
        return fs.existsSync(`${this._dirPaginasBaixadas}${file_name}`);
    }
}