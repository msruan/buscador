import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs';
import { Pagina } from './Pagina';

export class Indexador {

    private _paginasBaixadas : Pagina[] = [];

    constructor(){
        this.carregarPaginasBaixadas();
    }

    public get paginasBaixadas() : Pagina[] {
        return this._paginasBaixadas;
    }

    

    private async readWebPageHTML(url : string) : Promise<string>{

        const response =  await fetch(url);
        const html : string = await response.text();
        return html;
    }

    public carregarPaginasBaixadas(){
        const nomeDasPaginasBaixadas : string[] = this.listarArquivosDoDiretorio('../sites');
        // console.log(nomeDasPaginasBaixadas)
        for(let nome of nomeDasPaginasBaixadas){
            const conteudo : string = fs.readFileSync(`../sites/${nome}`).toString();
            const pagina : Pagina = new Pagina(nome,conteudo);
            this.paginasBaixadas.push(pagina);
        }
    }

    public async downloadPages(url : string) : Promise<void>{

        const file_name = this.takeLastElement(url)
        if(this.jaVisiteiEssaPagina(file_name)){
            return;
        }
        // console.log("Adicionei o site ",file_name, " pq atualmente os visitados sao ",visitedLinks)
        // const file_name : string = url;
        const text : string = await this.readWebPageHTML(url);
        

        this.downloadPage(text,file_name);

        const DOM = parse(text);
        const links = DOM.querySelectorAll("a");

        for(let a of links){

            let href : string = a.getAttribute("href") || "";
            let page_name : string = this.takeLastElement(href);
            href = this.trasnformarURLRelativaEmNormal(url,page_name);
            // console.log(href);
            await this.downloadPages(href);
        }
        console.log("Indexador diz: páginas baixadas!")
    }

    private downloadPage(text: string, page_name : string) : void{
        
        const sites_dir = '../sites';//@Todo: dá pra melhorar ess lógica, usando funções pra pegar o diretório atual por exemplo
        if (!fs.existsSync(sites_dir)) {
            fs.mkdirSync(sites_dir, { recursive: true });
        }
        fs.writeFileSync(`../sites/${page_name}`,text);
    }

    private jaVisiteiEssaPagina(file_name : string){

        const sites_dir = '../sites';//@Todo: dá pra melhorar ess lógica, usando funções pra pegar o diretório atual por exemplo
        if (!fs.existsSync(sites_dir)) {
            return false;
        }
        return fs.existsSync(`../sites/${file_name}`);
    }

    public takeLastElement(url : string) : string{

        const elements : string[] = url.split("/");
        const lastIndex = elements.length-1;
        return elements[lastIndex];
    }

    private trasnformarURLRelativaEmNormal(urlPaginaInicial : string, urlRelativa : string){

        const urlQuebrada : string [] = urlPaginaInicial.split("/");
        // for(let parte of urlQuebrada){
        //     console.log(parte);
        // }
        const numeroDeDiretoriosAVoltar : number = this.contarOcorrenciasSubstring(urlPaginaInicial,'..');
        const lastIndex : number = urlQuebrada.length - 1 - numeroDeDiretoriosAVoltar;
        urlQuebrada[lastIndex] = urlRelativa;
        return urlQuebrada.join("/");
    }

    private contarOcorrenciasSubstring(str : string, substr : string){
        return str.split(substr).length - 1;
    }

    private listarArquivosDoDiretorio(diretorio : string) : string[]{

        const arquivos : string[] = [];
        let listaDeArquivos = fs.readdirSync(diretorio);
        for(let k in listaDeArquivos) {
            arquivos.push(listaDeArquivos[k]);
        }
        return arquivos;
    
    
    // downloadPages("https://msruan.github.io/samples/matrix.html");   
    }
}