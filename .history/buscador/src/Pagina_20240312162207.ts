import { link } from "fs";

export class Pagina {
    private link : string;
    private content : string;

    constructor(link : string, content : string) {
        this.link = link;
        this.content = content;
    }
}