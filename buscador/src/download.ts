import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs';

export async function downloadPages(url : string) : Promise<void>{

    const file_name : string = takeLastElement(url);
    const text : string = await readWebPageHTML(url);

    downloadPage(text,file_name);
    let downloaded_pages : string[] = [file_name];

    const root_DOM = parse(text);
    const links = root_DOM.querySelectorAll("a");
    for(let link of links){
        console.log(link.textContent);
    }
}

async function readWebPageHTML(url : string) : Promise<string>{

    const response =  await fetch(url);
    const html : string = await response.text();
    return html;
}


function downloadPage(text: string, page_name : string) : void{
    
    const sites_dir = '../sites';
    if (!fs.existsSync(sites_dir)) {
        fs.mkdirSync(sites_dir, { recursive: true });
    }

    fs.writeFileSync(`../sites/${page_name}`,text);
}

function takeLastElement(url : string) : string{

    const elements : string[] = url.split("/");
    const lastIndex = elements.length-1;
    return elements[lastIndex];
}

downloadPages("https://msruan.github.io/samples/matrix.html");