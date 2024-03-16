"use strict";
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
const PaginaScore_1 = require("./PaginaScore");
const Score_1 = require("./Score");
const utils_1 = require("./utils");
class Buscador {
    constructor(indexador) {
        this.indexador = indexador;
    }
    ordenarSites(paginasScores) {
        paginasScores.sort((a, b) => {
            const somaPontuacao_a = a.score.calcularPontosTotais();
            const somaPontuacao_b = b.score.calcularPontosTotais();
            if (somaPontuacao_a == somaPontuacao_b) {
                return 0;
            }
            else if (somaPontuacao_a < somaPontuacao_b) {
                return 1;
            }
            else {
                return -1;
            }
        });
        const paginasOrdenadas = [];
        paginasScores.forEach((paginaScore) => { paginasOrdenadas.push(paginaScore.pagina); });
        return paginasOrdenadas;
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
        const paginas = this.indexador.paginasBaixadas;
        const html = pagina.content;
        let score = new Score_1.Score();
        this.calcularFrequenciaDeTermo(html, searched_term, score);
        this.calcularUsoDeTags(html, searched_term, score);
        this.calcularFrescor(html, score);
        this.calcularAutoreferencia(pagina, score);
        this.calcularAutoridade(pagina, paginas, score);
        return score;
    }
    calcularFrequenciaDeTermo(html, searched_term, scores) {
        const ocorrencias = (0, utils_1.contarOcorrenciasSubstring)(html.toUpperCase(), searched_term.toUpperCase());
        scores.frequencia = ocorrencias * scores.frequencia;
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
                if (diferencaDeAnos != 0) {
                    scores.fresco = scores.fresco + (diferencaDeAnos * scores.velho);
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
    calcularAutoridade(paginaACalcular, paginas, scores) {
        const links = {};
        const nomesDasPaginas = [];
        for (let pagina of paginas) {
            links[pagina.link] = 0;
            nomesDasPaginas.push(pagina.link);
        }
        for (let pagina of paginas) {
            const dom = (0, node_html_parser_1.parse)(pagina.content);
            const as = dom.querySelectorAll('a');
            for (let a of as) {
                const href = a.getAttribute("href") || "";
                if (nomesDasPaginas.includes(href)) {
                    links[href] += 1;
                }
            }
        }
        let autoridade = 0;
        for (let [string, number] of Object.entries(links)) {
            if (string === paginaACalcular.link) {
                autoridade = number;
            }
        }
        scores.autoridade = scores.autoridade * autoridade;
    }
}
exports.Buscador = Buscador;
