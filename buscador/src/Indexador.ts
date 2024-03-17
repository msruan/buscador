import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs';
import { Pagina } from './Pagina';
import { contarOcorrenciasSubstring, listarArquivosDoDiretorio, readWebPageHTML, takeLastElement, trasnformarURLRelativaEmNormal } from './utils';

export class Indexador {

    private _paginasBaixadas : Pagina[] = [];
    private _dirPaginasBaixadas : string = '../sites/';
    

    constructor(){
        this.carregarPaginasBaixadas();
    }

    public get paginasBaixadas() : Pagina[] {
        return this._paginasBaixadas;
    }

    public carregarPaginasBaixadas(){

        if(this.paginasBaixadas.length == 0){

            const nomeDasPaginasBaixadas : string[] = listarArquivosDoDiretorio(this._dirPaginasBaixadas);

            if(nomeDasPaginasBaixadas.length > 0){//@Todo: substituir por uma exceção 'NotFound' posteriormente

                for(let nome of nomeDasPaginasBaixadas){

                    const conteudo : string = fs.readFileSync(`${this._dirPaginasBaixadas}${nome}`).toString();
                    const pagina : Pagina = new Pagina(nome,conteudo);
                    this.paginasBaixadas.push(pagina);
                }
            }
        }
    }

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

    private downloadPage(text: string, page_name : string) : void{
        
        //@Todo: alterar essa lógica para conferir noa rray?
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