"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginaScore = void 0;
class PaginaScore {
    constructor(pagina, score) {
        this._pagina = pagina;
        this._score = score;
    }
    get pagina() {
        return this._pagina;
    }
    get score() {
        return this._score;
    }
}
exports.PaginaScore = PaginaScore;
