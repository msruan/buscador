import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs';

export async function readWebPageHTML(url : string) : Promise<string>{

    const response =  await fetch(url);
    const html : string = await response.text();
    return html;
}

export async function downloadPages(url : string) : Promise<void>{

    const file_name = takeLastElement(url)
    if(jaVisiteiEssaPagina(file_name)){
        return;
    }
    // console.log("Adicionei o site ",file_name, " pq atualmente os visitados sao ",visitedLinks)
    // const file_name : string = url;
    const text : string = await readWebPageHTML(url);
    downloadPage(text,file_name);

    const DOM = parse(text);
    const links = DOM.querySelectorAll("a");

    for(let a of links){

        let href : string = a.getAttribute("href") || "";
        let page_name : string = takeLastElement(href);
        href = trasnformarURLRelativaEmNormal(url,page_name);
        // console.log(href);
        await downloadPages(href);
    }
}

function downloadPage(text: string, page_name : string) : void{
    
    const sites_dir = '../sites';//@Todo: dá pra melhorar ess lógica, usando funções pra pegar o diretório atual por exemplo
    if (!fs.existsSync(sites_dir)) {
        fs.mkdirSync(sites_dir, { recursive: true });
    }
    fs.writeFileSync(`../sites/${page_name}`,text);
}

function jaVisiteiEssaPagina(file_name : string){

    const sites_dir = '../sites';//@Todo: dá pra melhorar ess lógica, usando funções pra pegar o diretório atual por exemplo
    if (!fs.existsSync(sites_dir)) {
        return false;
    }
    return fs.existsSync(`../sites/${file_name}`);
}

function takeLastElement(url : string) : string{

    const elements : string[] = url.split("/");
    const lastIndex = elements.length-1;
    return elements[lastIndex];
}

function trasnformarURLRelativaEmNormal(urlPaginaInicial : string, urlRelativa : string){

    const urlQuebrada : string [] = urlPaginaInicial.split("/");
    // for(let parte of urlQuebrada){
    //     console.log(parte);
    // }
    const numeroDeDiretoriosAVoltar : number = contarOcorrenciasSubstring(urlPaginaInicial,'..');
    const lastIndex : number = urlQuebrada.length - 1 - numeroDeDiretoriosAVoltar;
    urlQuebrada[lastIndex] = urlRelativa;
    return urlQuebrada.join("/");
}

function contarOcorrenciasSubstring(str : string, substr : string){
    return str.split(substr).length - 1;
}

// downloadPages("https://msruan.github.io/samples/matrix.html");