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
exports.resetCor = exports.obterCorAleatoria = exports.devolverData = exports.contarOcorrenciasSubstring = exports.takeLastElement = exports.trasnformarURLRelativaEmNormal = exports.readWebPageHTML = exports.listarArquivosDoDiretorio = void 0;
const fs = __importStar(require("fs"));
//File
function listarArquivosDoDiretorio(diretorio) {
    const arquivos = [];
    if (fs.existsSync(diretorio)) {
        let listaDeArquivos = fs.readdirSync(diretorio);
        for (let k in listaDeArquivos) {
            arquivos.push(listaDeArquivos[k]);
        }
    }
    return arquivos;
}
exports.listarArquivosDoDiretorio = listarArquivosDoDiretorio;
//Web
function readWebPageHTML(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const html = yield response.text();
        return html;
    });
}
exports.readWebPageHTML = readWebPageHTML;
function trasnformarURLRelativaEmNormal(urlPaginaInicial, urlRelativa) {
    const urlQuebrada = urlPaginaInicial.split("/");
    const numeroDeDiretoriosAVoltar = contarOcorrenciasSubstring(urlPaginaInicial, '..');
    const lastIndex = urlQuebrada.length - 1 - numeroDeDiretoriosAVoltar;
    urlQuebrada[lastIndex] = urlRelativa;
    return urlQuebrada.join("/");
}
exports.trasnformarURLRelativaEmNormal = trasnformarURLRelativaEmNormal;
//String
function takeLastElement(url) {
    const elements = url.split("/");
    const lastIndex = elements.length - 1;
    return elements[lastIndex];
}
exports.takeLastElement = takeLastElement;
function contarOcorrenciasSubstring(str, substr) {
    return str.split(substr).length - 1;
}
exports.contarOcorrenciasSubstring = contarOcorrenciasSubstring;
//Date
function devolverData(str_data) {
    var partesData = str_data.split("/").map(parseFloat);
    var data = new Date(partesData[2], partesData[1] - 1, partesData[0]);
    return data;
}
exports.devolverData = devolverData;
//Colors
function obterCorAleatoria() {
    const keys = Object.keys(COLORS);
    const randomIndex = Math.floor(Math.random() * keys.length);
    return COLORS[keys[randomIndex]];
}
exports.obterCorAleatoria = obterCorAleatoria;
function resetCor() {
    return COLORS.RESET;
}
exports.resetCor = resetCor;
const COLORS = {
    RESET: '\x1b[0m',
    BLACK: '\x1b[0;30m',
    RED: '\x1b[0;31m',
    GREEN: '\x1b[0;32m',
    YELLOW: '\x1b[0;33m',
    BLUE: '\x1b[0;34m',
    PURPLE: '\x1b[0;35m',
    CYAN: '\x1b[0;36m',
    WHITE: '\x1b[0;37m'
};
function obterCor(numero) {
    switch (numero) {
        case 1:
            return COLORS.BLACK;
        case 2:
            return COLORS.RED;
        case 3:
            return COLORS.GREEN;
        case 4:
            return COLORS.YELLOW;
        case 5:
            return COLORS.BLUE;
        case 6:
            return COLORS.PURPLE;
        case 7:
        default:
            return COLORS.CYAN;
    }
}
