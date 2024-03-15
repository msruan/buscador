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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarArquivosDoDiretorio = void 0;
const Buscador_1 = require("./Buscador");
const Indexador_1 = require("./Indexador");
const fs = __importStar(require("fs"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let indexador = new Indexador_1.Indexador();
        // await indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
        let google = new Buscador_1.Buscador(indexador);
        console.log(yield google.main());
        // console.log(listarArquivosDoDiretorio('../sites'));
        const app = (0, express_1.default)();
        // Define o diretório onde os arquivos estáticos (como HTML, CSS, imagens, etc.) serão servidos
        app.use(express_1.default.static(path_1.default.join(__dirname, '../google')));
        // Define a rota principal para enviar o arquivo HTML
        app.get('/', (req, res) => {
            res.sendFile(path_1.default.join(__dirname, '../google', 'index.html'));
        });
        // Inicia o servidor na porta 3000
        app.listen(3000, () => {
            console.log('Servidor Express iniciado na porta 3000');
        });
    });
}
function listarArquivosDoDiretorio(diretorio) {
    const arquivos = [];
    let listaDeArquivos = fs.readdirSync(diretorio);
    for (let k in listaDeArquivos) {
        arquivos.push(listaDeArquivos[k]);
    }
    return arquivos;
    // downloadPages("https://msruan.github.io/samples/matrix.html");   
}
exports.listarArquivosDoDiretorio = listarArquivosDoDiretorio;
main();
