import { Pagina } from "./Pagina";
import {Score} from "./Score"

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
}