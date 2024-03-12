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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const jsonfile_1 = __importDefault(require("jsonfile"));
const download_1 = require("./download");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //Por enquanto, vou presumir que as pastas estão em \sites
        yield (0, download_1.downloadPages)("https://msruan.github.io/samples/matrix.html");
        const home = "../sites/matrix.html"; //question("Digite o nome da página inicial: ");
        const searched_term = "matrix";
        var home_text = fs_1.default.readFileSync(home, 'utf8');
        // jsonfile.writeFileSync('../scores.json',pontuacoes);
        const default_scores = jsonfile_1.default.readFileSync('../scores.json');
        calcularPontuacoes(default_scores);
    });
}
function calcularPontuacoes(scores) {
    return -1;
}
main();
// const pontuacoes = {
//     //Quantidade dos Termos Buscados: Frequência com que os termos buscados 
//     //aparecem no código-fonte da página:
//     //Pontos: Cada ocorrência do termo buscado vale +5 pontos. Caso não existam ocorrências, a página não deve ser listada
//     //c) Uso das Tags (head, h1, h2, p) para Relevância:
//     // Pontos: Uso de termos buscados em title e meta tags (+20 pontos cada), h1 (+15
//     // pontos cada ocorrência), h2 (+10 pontos cada), p (+5 pontos cada), a (+2pontos)
//     "h1" : +15,
//     "h2" : +10,
//     "p" : +5,//e span
//     "a" : +2,
//     "autoridade" : +20,
//     //Penalidades
//     "autoreferencia" : -20,
//     //Frescor do conteúdo
//     "fresco" : +30,
//     "velho" : -5,
// }
