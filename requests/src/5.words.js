/*5. Crie uma aplicação que receba uma URL de uma página WEB como entrada e
uma palavra ou termo de pesquisa. Execute uma chamada usando o método
GET para a URL e efetue um "parse" na página obtida listando todas as
ocorrências da palavra na página. Para cada ocorrência, liste as 10 palavras
anteriores e as 10 posteriores, caso existam. */

import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import { question } from 'readline-sync';

async function main(){

    //sample: "https://meidesu.github.io/programacao-para-internet/";
    const url = question("Type a url, and we will get its links: ");
    const searched = question("Type the searched word: ");;
    const response = await fetch(url);
    const body = await response.text();

    const root = parse(body);
    const text = root.text;

    if(text.includes(searched)){

        let words = [''];
        words = getWords(text);

        const searchedIndex = words.indexOf(searched);
        let minIndex = searchedIndex - 10 < 0 ? 0 : searchedIndex - 10;
        let maxIndex = searchedIndex + 10 > words.length ? words.length : searchedIndex + 10;
    
        for(let i = minIndex; i <= maxIndex; i++){
            process.stdout.write(words[i]+" ");
        }
    }else{
        
        console.log("Palavra não encontrada!");
    }
}
function getWords(text){

    let words = text.split(" ");

    words = words.filter(function(word){
        return !isBlank(word);
    });

    for(let i = 0; i < words.length; i++){
        words[i] = myTrim(words[i]);
    }
    return words;
}

function isBlank(str) {
    return !str.trim(); 
}

function myTrim(word){

    let chars = [];

    for (let i = 0; i < word.length; i++) {
        const char = word[i];
        if (isLetter(char)) {
            chars.push(char);
        }
    }
    return chars.join('');
}

function isLetter(char) {
    const alphabet = 'abcçdefghijklmnopqrstuvwxyzABCÇDEFGHIJKLMNOPQRSTUVWXYZáéíóúÁÉÍÓÚâêîôÂÊÎÔãõÃÕàèìòùÀÈÌÒÙ';
    return alphabet.includes(char);
}

main();