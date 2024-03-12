/*4. Crie uma aplicação que receba uma URL de uma página WEB como entrada e
execute uma chamada usando o método GET para a URL e efetue um "parse"
na página obtida e exibindo todos os links presentes na página: atributos href
contidos dentro de tags <a></a>
Ex de link: <a href="http://www.google.com">Página do Google</a>
Dica: use expressões regulares ou o equivalente ao beautiful soap
*/

import { parse } from 'node-html-parser';
import fetch from 'node-fetch';
import { question } from 'readline-sync';

async function main() {

    //sample: "https://meidesu.github.io/programacao-para-internet/";
    const url = question("Type a url, and we will get its links: ")
    const response = await fetch(url);
    const body = await response.text();

    const root = parse(body);
    const links = root.querySelectorAll("a");

    console.log("Links: ");

    for(let link of links){
        console.log(link.getAttribute("href"));
    }
}
main();