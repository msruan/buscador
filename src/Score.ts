import * as jsonfile from 'jsonfile'

export class Score {

    frequencia: number;
    h1: number;
    h2: number;
    p: number;
    a: number;
    autoridade: number;
    autoreferencia: number;
    fresco: number;
    velho: number;

    constructor() {
        const default_scores = jsonfile.readFileSync('./scores.json');
        this.h1 = default_scores.h1;
        this.h2 = default_scores.h2;
        this.p = default_scores.p;
        this.a = default_scores.a;
        this.autoridade = default_scores.autoridade;
        this.autoreferencia = default_scores.autoreferencia;
        this.fresco = default_scores.fresco;
        this.velho = default_scores.velho;
        this.frequencia = default_scores.frequencia;
    }

    public calcularPontosTotais() :number {

        const somaPontuacao = this.a + this.autoreferencia + this.autoridade
            + this.fresco + this.h1 + this.h2 + this.p + this.frequencia;
        return somaPontuacao;
    }

    public toString() : string{
        return `
            frequencia = ${this.frequencia};
            h1 = ${this.h1};
            h2 = ${this.h2};
            p = ${this.p};
            a = ${this.a};
            autoridade = ${this.autoridade};
            autoreferencia = ${this.autoreferencia};
            fresco = ${this.fresco};
        `;
    }
}

/*pontuacoes padrões = {
    "h1" : +15,
    "h2" : +10,
    "p" : +5,
    "a" : +2,
    "autoridade" : +20,
    "autoreferencia" : -20,
    "fresco" : +30,
    "velho" : -5,
} */
