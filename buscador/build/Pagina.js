"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagina = void 0;
class Pagina {
    constructor(link, content) {
        this._link = link;
        this._content = content;
    }
    get link() {
        return this._link;
    }
    get content() {
        return this._content;
    }
}
exports.Pagina = Pagina;
