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
const Buscador_1 = require("./Buscador");
const Indexador_1 = require("./Indexador");
const index_1 = require("./index");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonfile = __importStar(require("jsonfile"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let indexador = new Indexador_1.Indexador();
        // const fonte : string = jsonfile.readFileSync('../scores.json').fonte;
        // console.log("A fonte é "+fonte);
        yield indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
        indexador.carregarPaginasBaixadas();
        let google = new Buscador_1.Buscador(indexador);
        // const scores : PaginaScore[] = await google.busca('matrix');
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        // Define a rota principal (localhost:300)
        app.get('/', (req, res) => {
            res.send('Servidor Node.js está rodando!');
        });
        // Inicia o servidor na porta 3000
        app.listen(3000, () => {
            console.log('Servidor Express iniciado na porta 3000');
        });
        app.get('/search/:value', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const input = req.params.value;
            const results = yield google.busca(input);
            const html = (0, index_1.criarPaginaResultados)(results, input); // Função para criar a página HTML com os resultados
            res.send(html);
        }));
        app.post('/atualizar-json', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = req.body;
                jsonfile.writeFileSync('../scores.json', newData);
                res.json(newData);
            }
            catch (error) {
                console.error(error);
                res.status(500).send('Erro ao atualizar JSON');
            }
        }));
    });
}
main();
