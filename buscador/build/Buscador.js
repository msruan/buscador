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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buscador = void 0;
const node_html_parser_1 = require("node-html-parser");
const jsonfile = __importStar(require("jsonfile"));
const PaginaScore_1 = require("./PaginaScore");
const utils_1 = require("./utils");
class Buscador {
    constructor(indexador) {
        this.indexador = indexador;
    }
    busca(searched_term) {
        return __awaiter(this, void 0, void 0, function* () {
            const paginas = this.indexador.paginasBaixadas;
            const paginasScores = [];
            for (let pagina of paginas) {
                const score = this.calcularPontuacoes(pagina, searched_term);
                const paginaScore = new PaginaScore_1.PaginaScore(pagina, score);
                paginasScores.push(paginaScore);
            }
            return paginasScores;
        });
    }
    calcularPontuacoes(pagina, searched_term) {
        const html = pagina.content;
        let scores = jsonfile.readFileSync('../scores.json');
        this.calcularUsoDeTags(html, searched_term, scores);
        this.calcularFrescor(html, scores);
        this.calcularAutoreferencia(pagina, scores);
        return scores;
    }
    calcularUsoDeTags(html, searched_term, scores) {
        const DOOM = (0, node_html_parser_1.parse)(html);
        const h1s = DOOM.querySelectorAll("h1");
        const h2s = DOOM.querySelectorAll("h2");
        const ps = DOOM.querySelectorAll("p");
        const as = DOOM.querySelectorAll("a");
        let h1s_ocorrencias = 0;
        let h2s_ocorrencias = 0;
        let ps_ocorrencias = 0;
        let as_ocorrencias = 0;
        for (let h1 of h1s) {
            if (h1.text.toUpperCase().includes(searched_term.toUpperCase())) { //@Todo: substituir por um reduce todos esses fors 
                h1s_ocorrencias += (0, utils_1.contarOcorrenciasSubstring)(h1.text.toUpperCase(), searched_term.toUpperCase());
            }
        }
        for (let h2 of h2s) {
            if (h2.text.toUpperCase().includes(searched_term.toUpperCase())) {
                h2s_ocorrencias += (0, utils_1.contarOcorrenciasSubstring)(h2.text.toUpperCase(), searched_term.toUpperCase());
            }
        }
        for (let p of ps) {
            if (p.text.toUpperCase().includes(searched_term.toUpperCase())) {
                ps_ocorrencias += (0, utils_1.contarOcorrenciasSubstring)(p.text.toUpperCase(), searched_term.toUpperCase());
            }
        }
        for (let a of as) {
            if (a.text.toUpperCase().includes(searched_term.toUpperCase())) {
                as_ocorrencias += (0, utils_1.contarOcorrenciasSubstring)(a.text.toUpperCase(), searched_term.toUpperCase());
            }
        }
        scores.h1 = scores.h1 * h1s_ocorrencias;
        scores.h2 = scores.h2 * h2s_ocorrencias;
        scores.p = scores.p * ps_ocorrencias;
        scores.a = scores.a * as_ocorrencias;
    }
    calcularFrescor(html, scores) {
        const DOOM = (0, node_html_parser_1.parse)(html);
        const ps = DOOM.querySelectorAll("p");
        for (let p of ps) {
            if (p.text.toUpperCase().startsWith("Data".toUpperCase())) {
                let splited = p.text.split(" ");
                const last_index = splited.length - 1; //Porque a data sempre é a última palavra em frases como "Data de publicação: 12/02/1960"
                const data_str = splited[last_index];
                const data = (0, utils_1.devolverData)(data_str);
                const diferencaDeAnos = new Date().getFullYear() - data.getFullYear();
                if (diferencaDeAnos == 0)
                    scores.velho = 0;
                else {
                    scores.fresco = 0;
                    scores.velho = diferencaDeAnos * scores.velho;
                }
            }
        }
    }
    calcularAutoreferencia(pagina, scores) {
        const link = pagina.link;
        const html = pagina.content;
        const DOM = (0, node_html_parser_1.parse)(html);
        const as = DOM.querySelectorAll("a");
        let autoreferencias = 0;
        for (let a of as) {
            const href = a.getAttribute("href") || "";
            if ((0, utils_1.takeLastElement)(link) == href) {
                autoreferencias++;
            }
        }
        scores.autoreferencia = autoreferencias * scores.autoreferencia;
    }
    calcularAutoridade(paginaACalcular, paginas) {
        const links = {
            "matriz.html": 0
        };
        const nomesDasPaginas = [];
        paginas.forEach((pagina) => nomesDasPaginas.push(pagina.link));
    }
}
exports.Buscador = Buscador;
