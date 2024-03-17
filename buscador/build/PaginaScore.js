"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginaScore = void 0;
const utils_1 = require("./utils");
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
    exibirTabelaScore() {
        console.log((0, utils_1.obterCorAleatoria)() + "Página: " + this.pagina.title);
        console.log((0, utils_1.obterCorAleatoria)() + "Pontuação total: " + this.score.calcularPontosTotais());
        console.table(this.score);
        console.log("\n" + (0, utils_1.resetCor)());
    }
}
exports.PaginaScore = PaginaScore;
