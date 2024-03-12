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
exports.downloadPages = exports.readWebPageHTML = void 0;
var node_fetch_1 = require("node-fetch");
var node_html_parser_1 = require("node-html-parser");
var fs = require("fs");
function readWebPageHTML(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, node_fetch_1.default)(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    html = _a.sent();
                    return [2 /*return*/, html];
            }
        });
    });
}
exports.readWebPageHTML = readWebPageHTML;
function downloadPages(url) {
    return __awaiter(this, void 0, void 0, function () {
        var file_name, text, DOM, links, _i, links_1, a, href, page_name;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file_name = takeLastElement(url);
                    if (jaVisiteiEssaPagina(file_name)) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, readWebPageHTML(url)];
                case 1:
                    text = _a.sent();
                    downloadPage(text, file_name);
                    DOM = (0, node_html_parser_1.parse)(text);
                    links = DOM.querySelectorAll("a");
                    _i = 0, links_1 = links;
                    _a.label = 2;
                case 2:
                    if (!(_i < links_1.length)) return [3 /*break*/, 5];
                    a = links_1[_i];
                    href = a.getAttribute("href") || "";
                    page_name = takeLastElement(href);
                    href = trasnformarURLRelativaEmNormal(url, page_name);
                    // console.log(href);
                    return [4 /*yield*/, downloadPages(href)];
                case 3:
                    // console.log(href);
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.downloadPages = downloadPages;
function downloadPage(text, page_name) {
    var sites_dir = '../sites'; //@Todo: dá pra melhorar ess lógica, usando funções pra pegar o diretório atual por exemplo
    if (!fs.existsSync(sites_dir)) {
        fs.mkdirSync(sites_dir, { recursive: true });
    }
    fs.writeFileSync("../sites/".concat(page_name), text);
}
function jaVisiteiEssaPagina(file_name) {
    var sites_dir = '../sites'; //@Todo: dá pra melhorar ess lógica, usando funções pra pegar o diretório atual por exemplo
    if (!fs.existsSync(sites_dir)) {
        return false;
    }
    return fs.existsSync("../sites/".concat(file_name));
}
function takeLastElement(url) {
    var elements = url.split("/");
    var lastIndex = elements.length - 1;
    return elements[lastIndex];
}
function trasnformarURLRelativaEmNormal(urlPaginaInicial, urlRelativa) {
    var urlQuebrada = urlPaginaInicial.split("/");
    // for(let parte of urlQuebrada){
    //     console.log(parte);
    // }
    var numeroDeDiretoriosAVoltar = contarOcorrenciasSubstring(urlPaginaInicial, '..');
    var lastIndex = urlQuebrada.length - 1 - numeroDeDiretoriosAVoltar;
    urlQuebrada[lastIndex] = urlRelativa;
    return urlQuebrada.join("/");
}
function contarOcorrenciasSubstring(str, substr) {
    return str.split(substr).length - 1;
}
// downloadPages("https://msruan.github.io/samples/matrix.html");
