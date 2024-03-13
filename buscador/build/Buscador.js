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
const fs = __importStar(require("fs"));
class Buscador {
    constructor(indexador) {
        this.indexador = indexador;
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
            const home = "../sites/matrix.html"; //question("Digite o nome da página inicial: ");
            let home_text = fs.readFileSync(home, 'utf8');
            const searched_term = "matriz";
            const pontuacoes = {
                "h1": +15,
                "h2": +10,
                "p": +5,
                "a": +2,
                "autoridade": +20,
                "autoreferencia": -20,
                "fresco": +30,
                "velho": -5,
            };
            // jsonfile.writeFileSync('buscador/scores.json',pontuacoes);
            // const default_scores : ScoreObject = jsonfile.readFileSync('../scores.json');
            const paginaInicial = this.indexador.paginasBaixadas[1];
            console.log(paginaInicial);
            this.calcularPontuacoes(home_text, searched_term);
        });
    }
    calcularPontuacoes(pagina, searched_term) {
        // const html : string = pagina.content
        let scores = { "h1": 15, "h2": 10, "p": 5, "a": 2, "autoridade": 20, "autoreferencia": -20, "fresco": 30, "velho": -5 };
        this.calcularUsoDeTags(pagina, searched_term, scores);
        this.calcularFrescor(pagina, scores);
        // this.calcularAutoreferencia(pagina,scores);
        console.log(scores);
    }
    calcularUsoDeTags(html, searched_term, scores) {
        const DOOM = (0, node_html_parser_1.parse)(html);
        console.log("É " + DOOM.id);
        const h1s = DOOM.querySelectorAll("h1");
        const h2s = DOOM.querySelectorAll("h2");
        const ps = DOOM.querySelectorAll("p");
        console.log("O numero de ocorrencias em p é ", ps.length);
        const as = DOOM.querySelectorAll("a");
        let h1s_ocorrencias = 0;
        let h2s_ocorrencias = 0;
        let ps_ocorrencias = 0;
        let as_ocorrencias = 0;
        for (let h1 of h1s) {
            if (h1.text.toUpperCase().includes(searched_term.toUpperCase())) {
                h1s_ocorrencias += this.contarOcorrenciasSubstring(h1.text.toUpperCase(), searched_term.toUpperCase());
            }
        }
        for (let h2 of h2s) {
            if (h2.text.toUpperCase().includes(searched_term.toUpperCase())) {
                h2s_ocorrencias += this.contarOcorrenciasSubstring(h2.text.toUpperCase(), searched_term.toUpperCase());
            }
        }
        for (let p of ps) {
            if (p.text.toUpperCase().includes(searched_term.toUpperCase())) {
                ps_ocorrencias += this.contarOcorrenciasSubstring(p.text.toUpperCase(), searched_term.toUpperCase());
            }
        }
        for (let a of as) {
            if (a.text.toUpperCase().includes(searched_term.toUpperCase())) {
                as_ocorrencias += this.contarOcorrenciasSubstring(a.text.toUpperCase(), searched_term.toUpperCase());
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
                const last_index = splited.length - 1;
                const data_str = splited[last_index];
                const data = this.devolverData(data_str);
                console.log("A data é " + data);
                console.log("A data atual é " + new Date());
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
    devolverData(str_data) {
        var partesData = str_data.split("/").map(parseFloat);
        var data = new Date(partesData[2], partesData[1] - 1, partesData[0]);
        return data;
    }
    calcularAutoreferencia(pagina, scores) {
        const link = pagina.link;
        const html = pagina.content;
        const DOM = (0, node_html_parser_1.parse)(html);
        const as = DOM.querySelectorAll("a");
        let autoreferencias = 0;
        console.log("To em cima do for");
        for (let a of as) {
            const href = a.getAttribute("href") || "";
            console.log("O href é " + href);
            if (this.indexador.takeLastElement(link) == href) {
                autoreferencias++;
            }
        }
        console.log("Numero de autoreferencias: " + autoreferencias);
        scores.autoreferencia = autoreferencias * scores.autoreferencia;
    }
    contarOcorrenciasSubstring(str, substr) {
        return str.split(substr).length - 1;
    }
}
exports.Buscador = Buscador;
