"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagina = void 0;
const node_html_parser_1 = require("node-html-parser");
class Pagina {
    constructor(link, content) {
        var _a;
        this._description = "";
        this._link = link;
        this._content = content;
        const DOOM = (0, node_html_parser_1.parse)(content);
        this._title = DOOM.getElementsByTagName("title")[0].text;
        const metas = DOOM.getElementsByTagName("meta");
        for (let meta of metas) {
            if ((_a = meta.getAttribute("name")) === null || _a === void 0 ? void 0 : _a.includes("description")) {
                this._description = meta.getAttribute("content") || "";
            }
        }
    }
    get link() {
        return this._link;
    }
    get content() {
        return this._content;
    }
    get title() {
        return this._title;
    }
    get description() {
        return this._description;
    }
}
exports.Pagina = Pagina;
