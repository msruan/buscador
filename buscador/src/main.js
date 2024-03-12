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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_html_parser_1 = require("node-html-parser");
var fs = require("fs");
var download_1 = require("./download");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var home, home_text, searched_term, pontuacoes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                //Por enquanto, vou presumir que as pastas estão em \sites
                return [4 /*yield*/, (0, download_1.downloadPages)("https://msruan.github.io/samples/matrix.html")];
                case 1:
                    //Por enquanto, vou presumir que as pastas estão em \sites
                    _a.sent();
                    home = "../sites/duna.html" //question("Digite o nome da página inicial: ");
                    ;
                    home_text = fs.readFileSync(home, 'utf8');
                    searched_term = "duna";
                    pontuacoes = {
                        //Quantidade dos Termos Buscados: Frequência com que os termos buscados 
                        //aparecem no código-fonte da página:
                        //Pontos: Cada ocorrência do termo buscado vale +5 pontos. Caso não existam ocorrências, a página não deve ser listada
                        //c) Uso das Tags (head, h1, h2, p) para Relevância:
                        // Pontos: Uso de termos buscados em title e meta tags (+20 pontos cada), h1 (+15
                        // pontos cada ocorrência), h2 (+10 pontos cada), p (+5 pontos cada), a (+2pontos)
                        "h1": +15,
                        "h2": +10,
                        "p": +5, //e span
                        "a": +2,
                        "autoridade": +20,
                        //Penalidades
                        "autoreferencia": -20,
                        //Frescor do conteúdo
                        "fresco": +30,
                        "velho": -5,
                    };
                    // jsonfile.writeFileSync('buscador/scores.json',pontuacoes);
                    // const default_scores : ScoreObject = jsonfile.readFileSync('../scores.json');
                    calcularPontuacoes(home_text, searched_term);
                    return [2 /*return*/];
            }
        });
    });
}
function calcularUsoDeTags(html, searched_term, scores) {
    var DOOM = (0, node_html_parser_1.parse)(html);
    console.log("É " + DOOM.id);
    var h1s = DOOM.querySelectorAll("h1");
    var h2s = DOOM.querySelectorAll("h2");
    var ps = DOOM.querySelectorAll("p");
    console.log("O numero de ocorrencias em p é ", ps.length);
    var as = DOOM.querySelectorAll("a");
    var h1s_ocorrencias = 0;
    var h2s_ocorrencias = 0;
    var ps_ocorrencias = 0;
    var as_ocorrencias = 0;
    for (var _i = 0, h1s_1 = h1s; _i < h1s_1.length; _i++) {
        var h1 = h1s_1[_i];
        if (h1.text.toUpperCase().includes(searched_term.toUpperCase())) {
            h1s_ocorrencias += contarOcorrenciasSubstring(h1.text.toUpperCase(), searched_term.toUpperCase());
        }
    }
    for (var _a = 0, h2s_1 = h2s; _a < h2s_1.length; _a++) {
        var h2 = h2s_1[_a];
        if (h2.text.toUpperCase().includes(searched_term.toUpperCase())) {
            h2s_ocorrencias += contarOcorrenciasSubstring(h2.text.toUpperCase(), searched_term.toUpperCase());
        }
    }
    for (var _b = 0, ps_1 = ps; _b < ps_1.length; _b++) {
        var p = ps_1[_b];
        if (p.text.toUpperCase().includes(searched_term.toUpperCase())) {
            ps_ocorrencias += contarOcorrenciasSubstring(p.text.toUpperCase(), searched_term.toUpperCase());
        }
    }
    for (var _c = 0, as_1 = as; _c < as_1.length; _c++) {
        var a = as_1[_c];
        if (a.text.toUpperCase().includes(searched_term.toUpperCase())) {
            as_ocorrencias += contarOcorrenciasSubstring(a.text.toUpperCase(), searched_term.toUpperCase());
        }
    }
    scores.h1 = scores.h1 * h1s_ocorrencias;
    scores.h2 = scores.h2 * h2s_ocorrencias;
    scores.p = scores.p * ps_ocorrencias;
    scores.a = scores.a * as_ocorrencias;
}
function calcularFrescor(html, searched_term, scores) {
    var DOOM = (0, node_html_parser_1.parse)(html);
    var ps = DOOM.querySelectorAll("p");
    for (var _i = 0, ps_2 = ps; _i < ps_2.length; _i++) {
        var p = ps_2[_i];
        if (p.text.toUpperCase().startsWith("Data".toUpperCase())) {
            var splited = p.text.split(" ");
            var last_index = splited.length - 1;
            var data_str = splited[last_index];
            var data = devolverData(data_str);
            console.log("A data é " + data);
            console.log("A data atual é " + new Date());
            if (data.getFullYear() == new Date().getFullYear())
                scores.velho = 0;
            else
                scores.fresco = 0;
        }
    }
    //     e) Frescor do Conteúdo: Avaliado pela data de publicação da página.
    // Pontos: Páginas publicadas no ano corrente recebem +30 pontos, com uma
    // redução de -5 pontos para cada ano anterior.
}
function devolverData(str_data) {
    var partesData = str_data.split("/").map(parseFloat);
    var data = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    return data;
}
function calcularPontuacoes(site_html, searched_term) {
    var scores = { "h1": 15, "h2": 10, "p": 5, "a": 2, "autoridade": 20, "autoreferencia": -20, "fresco": 30, "velho": -5 };
    calcularUsoDeTags(site_html, searched_term, scores);
    calcularFrescor(site_html, searched_term, scores);
    console.log(scores);
    // c) Uso das Tags (head, h1, h2, p) para Relevância:
    // ‘
    // Pontos: Uso de termos buscados em title e meta tags (+20 pontos cada), h1 (+15
    // pontos cada ocorrência), h2 (+10 pontos cada), p (+5 pontos cada), a (+2pontos)
}
function contarOcorrenciasSubstring(str, substr) {
    return str.split(substr).length - 1;
}
main();
