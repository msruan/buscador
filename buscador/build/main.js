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
const Buscador_1 = require("./Buscador");
const Indexador_1 = require("./Indexador");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let indexador = new Indexador_1.Indexador();
        yield indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
        indexador.carregarPaginasBaixadas();
        let google = new Buscador_1.Buscador(indexador);
        const scores = google.busca('blade');
        const scoreTotalPorPagina = google.calcularPontosTotais(yield scores);
        const app = (0, express_1.default)();
        // Define o diretório onde os arquivos estáticos (como HTML, CSS, imagens, etc.) serão servidos
        //app.use(express.static(path.join(__dirname, '../google')));
        app.use(express_1.default.json());
        app.use((0, cors_1.default)());
        // Define a rota principal (localhost:300)
        app.get('/', (req, res) => {
            res.send('Servidor Node.js está rodando!');
        });
        //Define a rota a partir da qual será chamada a página de resultados
        app.get('/search/:value', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const input = req.params.value;
            const array = yield google.busca(input);
            res.json(array);
        }));
        // Inicia o servidor na porta 3000
        app.listen(3000, () => {
            console.log('Servidor Express iniciado na porta 3000');
        });
    });
}
main();
