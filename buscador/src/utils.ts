import * as fs from 'fs'

//File
export function listarArquivosDoDiretorio(diretorio : string) : string[]{

    const arquivos : string[] = [];
    if (fs.existsSync(diretorio)) {
        
        let listaDeArquivos = fs.readdirSync(diretorio);
        for(let k in listaDeArquivos) {
            arquivos.push(listaDeArquivos[k]);
        }
    }
    return arquivos;
}

//Web
export async function readWebPageHTML(url : string) : Promise<string>{

    const response =  await fetch(url);
    const html : string = await response.text();
    return html;
}

export function trasnformarURLRelativaEmNormal(urlPaginaInicial : string, urlRelativa : string){

    const urlQuebrada : string [] = urlPaginaInicial.split("/");
    const numeroDeDiretoriosAVoltar : number = contarOcorrenciasSubstring(urlPaginaInicial,'..');
    const lastIndex : number = urlQuebrada.length - 1 - numeroDeDiretoriosAVoltar;
    urlQuebrada[lastIndex] = urlRelativa;
    return urlQuebrada.join("/");
}

//String
export function takeLastElement(url : string) : string{

    const elements : string[] = url.split("/");
    const lastIndex = elements.length-1;
    return elements[lastIndex];
}

export function contarOcorrenciasSubstring(str : string, substr : string){
    return str.split(substr).length - 1;
}

//Date
export function devolverData(str_data: string) : Date {
    var partesData = str_data.split("/").map(parseFloat);
    var data : Date = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    return data;
}