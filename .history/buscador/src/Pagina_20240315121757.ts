export class Pagina {
    private link : string;
    private content : string;

    constructor(link : string, content : string) {
        this.link = link;
        this.content = content;
    }
}

export class PaginaScore {
    private pagina : Pagina;
    private score : ScoreObject;
    constructor(pagina : Pagina, score : ScoreObject){
        this.pagina = pagina;
        this.score = score;
    }
}

type ScoreObject = {
    h1: number;
    h2: number;
    p: number;
    a: number;
    autoridade: number;
    autoreferencia: number;
    fresco: number;
    velho: number;
};