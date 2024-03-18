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
exports.Indexador = void 0;
const node_html_parser_1 = require("node-html-parser");
const fs = __importStar(require("fs"));
const Pagina_1 = require("./Pagina");
const utils_1 = require("./utils");
class Indexador {
    constructor() {
        this._paginasBaixadas = [];
        this._dirPaginasBaixadas = '../sites/';
        this.carregarPaginasBaixadas();
    }
    get paginasBaixadas() {
        return this._paginasBaixadas;
    }
    carregarPaginasBaixadas() {
        if (this.paginasBaixadas.length == 0) {
            const nomeDasPaginasBaixadas = (0, utils_1.listarArquivosDoDiretorio)(this._dirPaginasBaixadas);
            if (nomeDasPaginasBaixadas.length > 0) { //@Todo: substituir por uma exceção 'NotFound' posteriormente
                for (let nome of nomeDasPaginasBaixadas) {
                    const conteudo = fs.readFileSync(`${this._dirPaginasBaixadas}${nome}`).toString();
                    const pagina = new Pagina_1.Pagina(nome, conteudo);
                    this.paginasBaixadas.push(pagina);
                }
            }
        }
    }
    downloadPages(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const file_name = (0, utils_1.takeLastElement)(url);
            if (this.jaBaixeiEssaPagina(file_name)) {
                return;
            }
            const text = yield (0, utils_1.readWebPageHTML)(url);
            this.downloadPage(text, file_name);
            const DOM = (0, node_html_parser_1.parse)(text);
            const links = DOM.querySelectorAll("a");
            for (let a of links) {
                let href = a.getAttribute("href") || "";
                let page_name = (0, utils_1.takeLastElement)(href);
                href = (0, utils_1.trasnformarURLRelativaEmNormal)(url, page_name);
                yield this.downloadPages(href);
            }
            console.log("Indexador diz: páginas baixadas!");
        });
    }
    downloadPage(text, page_name) {
        //@Todo: alterar essa lógica para conferir noa rray?
        if (!fs.existsSync(this._dirPaginasBaixadas)) {
            fs.mkdirSync(this._dirPaginasBaixadas, { recursive: true });
        }
        fs.writeFileSync(`${this._dirPaginasBaixadas}${page_name}`, text);
    }
    jaBaixeiEssaPagina(file_name) {
        if (!fs.existsSync(this._dirPaginasBaixadas)) {
            return false;
        }
        return fs.existsSync(`${this._dirPaginasBaixadas}${file_name}`);
    }
}
exports.Indexador = Indexador;
