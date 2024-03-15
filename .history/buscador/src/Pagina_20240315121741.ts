export class Pagina {
    private link : string;
    private content : string;
    private autoridade : number;

    constructor(link : string, content : string) {
        this.link = link;
        this.content = content;
        this.autoridade = 0;
    }

}

export class PaginaScore {
    private pagina : Pagina;
    private score : ScoreObject;
    constructor(pagina : Pagina, score : ScoreObject){
        this.pagina = pagina;
        this.score = score;
    }

    // toJson() {
    //     return {
    //         pagina: this.pagina,
    //         score: this.score
    //     }
    // }
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