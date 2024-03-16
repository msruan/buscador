import * as jsonfile from 'jsonfile'

export class Score {
     
    h1: number;
    h2: number;
    p: number;
    a: number;
    autoridade: number;
    autoreferencia: number;
    fresco: number;
    velho: number;

    constructor() {
        const default_scores = jsonfile.readFileSync('../scores.json');//@Todo: essa deveria ser a lógica? 
        //Por que simplesmente executar o programa do lugar errado já ocasionaria em aml funcionamento
        this.h1 = default_scores.h1;
        this.h2 = default_scores.h2;
        this.p = default_scores.p;
        this.a = default_scores.a;
        this.autoridade = default_scores.autoridade;
        this.autoreferencia = default_scores.autoreferencia;
        this.fresco = default_scores.fresco;
        this.velho = default_scores.velho;
    }
}

/*const pontuacoes = {
            "h1" : +15,
            "h2" : +10,
            "p" : +5,
            "a" : +2,
        
            "autoridade" : +20,
            "autoreferencia" : -20,
            "fresco" : +30,
            "velho" : -5,
        } */
// jsonfile.writeFileSync('buscador/scores.json',pontuacoes);
        // const default_scores : ScoreObject = jsonfile.readFileSync('../scores.json');