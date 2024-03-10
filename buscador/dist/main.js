"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import fs from 'fs'
const fs = require('fs');
// import jsonfile from 'jsonfile'
const jsonfile = require('jsonfile');
function main() {
    //Por enquanto, vou presumir que as pastas estão em \sites
    const home = "../sites/matrix.html"; //question("Digite o nome da página inicial: ");
    var home_text = fs.readFileSync(home, 'utf8');
    const pontuacoes = {
        //Quantidade dos Termos Buscados: Frequência com que os termos buscados 
        //aparecem no código-fonte da página:
        //Pontos: Cada ocorrência do termo buscado vale +5 pontos. Caso não existam ocorrências, a página não deve ser listada
        //c) Uso das Tags (head, h1, h2, p) para Relevância:
        // Pontos: Uso de termos buscados em title e meta tags (+20 pontos cada), h1 (+15
        // pontos cada ocorrência), h2 (+10 pontos cada), p (+5 pontos cada), a (+2pontos)
        "h1": +15,
        "h2": +10,
        "p": +5, //e span
        "a": +2,
        "autoridade": +20,
        //Penalidades
        "autoreferencia": -20,
        //Frescor do conteúdo
        "fresco": +30,
        "velho": -5,
    };
    // jsonfile.writeFileSync('../scores.json',pontuacoes);
    const scores = jsonfile.readFileSync('../scores.json');
    calcularPontuacoes(scores);
}
function calcularPontuacoes(scores) {
    return -1;
}
main();
