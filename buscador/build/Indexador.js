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
exports.Indexador = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const node_html_parser_1 = require("node-html-parser");
const fs = __importStar(require("fs"));
const Pagina_1 = require("./Pagina");
class Indexador {
    constructor() {
        this._paginasBaixadas = [];
        this.carregarPaginasBaixadas();
    }
    get paginasBaixadas() {
        return this._paginasBaixadas;
    }
    readWebPageHTML(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(url);
            const html = yield response.text();
            return html;
        });
    }
    carregarPaginasBaixadas() {
        const nomeDasPaginasBaixadas = this.listarArquivosDoDiretorio('../sites');
        // console.log(nomeDasPaginasBaixadas)
        for (let nome of nomeDasPaginasBaixadas) {
            const conteudo = fs.readFileSync(`../sites/${nome}`).toString();
            const pagina = new Pagina_1.Pagina(nome, conteudo);
            this.paginasBaixadas.push(pagina);
        }
    }
    downloadPages(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const file_name = this.takeLastElement(url);
            if (this.jaVisiteiEssaPagina(file_name)) {
                return;
            }
            // console.log("Adicionei o site ",file_name, " pq atualmente os visitados sao ",visitedLinks)
            // const file_name : string = url;
            const text = yield this.readWebPageHTML(url);
            this.downloadPage(text, file_name);
            const DOM = (0, node_html_parser_1.parse)(text);
            const links = DOM.querySelectorAll("a");
            for (let a of links) {
                let href = a.getAttribute("href") || "";
                let page_name = this.takeLastElement(href);
                href = this.trasnformarURLRelativaEmNormal(url, page_name);
                // console.log(href);
                yield this.downloadPages(href);
            }
            // console.log("Indexador diz: páginas baixadas!")
        });
    }
    downloadPage(text, page_name) {
        const sites_dir = '../sites'; //@Todo: dá pra melhorar ess lógica, usando funções pra pegar o diretório atual por exemplo
        if (!fs.existsSync(sites_dir)) {
            fs.mkdirSync(sites_dir, { recursive: true });
        }
        fs.writeFileSync(`../sites/${page_name}`, text);
    }
    jaVisiteiEssaPagina(file_name) {
        const sites_dir = '../sites'; //@Todo: dá pra melhorar ess lógica, usando funções pra pegar o diretório atual por exemplo
        if (!fs.existsSync(sites_dir)) {
            return false;
        }
        return fs.existsSync(`../sites/${file_name}`);
    }
    takeLastElement(url) {
        const elements = url.split("/");
        const lastIndex = elements.length - 1;
        return elements[lastIndex];
    }
    trasnformarURLRelativaEmNormal(urlPaginaInicial, urlRelativa) {
        const urlQuebrada = urlPaginaInicial.split("/");
        // for(let parte of urlQuebrada){
        //     console.log(parte);
        // }
        const numeroDeDiretoriosAVoltar = this.contarOcorrenciasSubstring(urlPaginaInicial, '..');
        const lastIndex = urlQuebrada.length - 1 - numeroDeDiretoriosAVoltar;
        urlQuebrada[lastIndex] = urlRelativa;
        return urlQuebrada.join("/");
    }
    contarOcorrenciasSubstring(str, substr) {
        return str.split(substr).length - 1;
    }
    listarArquivosDoDiretorio(diretorio) {
        const arquivos = [];
        let listaDeArquivos = fs.readdirSync(diretorio);
        for (let k in listaDeArquivos) {
            arquivos.push(listaDeArquivos[k]);
        }
        return arquivos;
        // downloadPages("https://msruan.github.io/samples/matrix.html");   
    }
}
exports.Indexador = Indexador;
