"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginaScore = exports.Pagina = void 0;
class Pagina {
    constructor(link, content) {
        this._link = link;
        this._content = content;
        this._autoridade = 0;
    }
    get autoridade() {
        return this._autoridade;
    }
    getLink() {
        return this.link;
    }
    get link() {
        return this._link;
    }
    get content() {
        return this._content;
    }
}
exports.Pagina = Pagina;
class PaginaScore {
    constructor(pagina, score) {
        this._pagina = pagina;
        this._score = score;
    }
}
exports.PaginaScore = PaginaScore;
