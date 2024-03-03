/*3. Crie um programa em que permita baixar, via HTTP e usando o método GET,
um arquivo de imagem (escolha um tipo apenas - jpg ou gif...):
• Passe como parâmetro o "endereço WEB" completo até o arquivo;
• Receba o corpo a resposta em formato binário;
• Salve em disco a imagem.
*/

import fetch from 'node-fetch';
import fs from 'fs'
import { question } from 'readline-sync';

async function main(){

    //sample: "https://meidesu.github.io/programacao-para-internet/assets/ruan.jpg"
    const url = question("Type a url of a JPG image, and we will download it for u: ");

    const img_blob = await get_blob(url);
    const buffer = Buffer.from(await img_blob.arrayBuffer());

    const input = question("Type the name of the image file: ");
    const nome_do_arquivo =  input.includes(".jpg") ? input : input + ".jpg";
    download_image(nome_do_arquivo,buffer);
}

function download_image(nome_do_arquivo, imagem){

    fs.writeFile(nome_do_arquivo, imagem, (err) => {
        if (err) {
          console.error('Erro ao salvar a imagem:', err);
          return;
        }
        console.log('Imagem baixada com sucesso!');
      });
}

async function get_blob(url){
    const response = await fetch(url);
    const img_blob = await response.blob();

    return img_blob;
}

main();