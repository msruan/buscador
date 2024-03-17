import { Pagina } from "./Pagina";
import {Score} from "./Score"
import { obterCorAleatoria, resetCor } from "./utils";

export class PaginaScore {

    private _pagina : Pagina;
    private _score : Score;
    constructor(pagina : Pagina, score : Score){
        this._pagina = pagina;
        this._score = score;
    }

    public get pagina(){
        return this._pagina;
    }

    public get score(){
        return this._score;
    }

    public exibirTabelaScore() : void{
        console.log(obterCorAleatoria()+"Página: "+this.pagina.title);
        console.log(obterCorAleatoria()+"Pontuação total: "+this.score.calcularPontosTotais());
        console.table(this.score);
        console.log("\n"+resetCor())
    }

    public ehExibivel() : boolean {
        return this.score.frequencia > 0;
    }
}