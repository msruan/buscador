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
exports.downloadPages = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const node_html_parser_1 = require("node-html-parser");
const fs = __importStar(require("fs"));
function downloadPages(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const file_name = takeLastElement(url);
        const text = yield readWebPageHTML(url);
        downloadPage(text, file_name);
        let downloaded_pages = [file_name];
        const root_DOM = (0, node_html_parser_1.parse)(text);
        const links = root_DOM.querySelectorAll("a");
        for (let link of links) {
            console.log(link.textContent);
        }
    });
}
exports.downloadPages = downloadPages;
function readWebPageHTML(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, node_fetch_1.default)(url);
        const html = yield response.text();
        return html;
    });
}
function downloadPage(text, page_name) {
    const sites_dir = '../sites';
    if (!fs.existsSync(sites_dir)) {
        fs.mkdirSync(sites_dir, { recursive: true });
    }
    fs.writeFileSync(`../sites/${page_name}`, text);
}
function takeLastElement(url) {
    const elements = url.split("/");
    const lastIndex = elements.length - 1;
    return elements[lastIndex];
}
downloadPages("https://msruan.github.io/samples/matrix.html");
