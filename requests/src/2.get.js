/*2. Crie um programa que receba uma URL e execute um método GET exibindo
como saída alguns elementos como: Status code, Encoding, O tamanho da
resposta, O corpo da resposta, dentre outros*/

import fetch from 'node-fetch';
import { question } from 'readline-sync';

function main(){

    //sample: "https://starbuzzcoffee.com"
    const url = question("Type a url, and we will get it for u: ");
    get(url);
}

async function get(url){

    const response = await fetch(url);
    const body = await response.text();
    const status = response.status;
    const status_text = response.statusText;
    const header = response.headers.get('content-type');
    const index_charset = header.search("charset"); 
    const charset = header.substring(index_charset);

    console.log("Corpo da resposta: "+body);
    console.log("Tamanho da resposta: "+body.length);
    console.log("Status da requisição: "+status+ " - "+status_text);
    console.log("Encoding: " + charset);
}

main();

