"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = void 0;
const jsonfile = __importStar(require("jsonfile"));
class Score {
    constructor() {
        const default_scores = jsonfile.readFileSync('../scores.json'); //@Todo: essa deveria ser a lógica? 
        //Por que simplesmente executar o programa do lugar errado já ocasionaria em aml funcionamento
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
    calcularPontosTotais() {
        const somaPontuacao = this.a + this.autoreferencia + this.autoridade
            + this.fresco + this.h1 + this.h2 + this.p + this.frequencia;
        return somaPontuacao;
    }
    toString() {
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
exports.Score = Score;
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
