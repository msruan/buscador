import { link } from "fs";

class Buscador {
    private Paginas : string;
    private content : string;

    constructor(link : string, content : string) {
        this.link = link;
        this.content = content;
    }
}