import { Pagina } from "./Pagina";
export class Buscador {
    private paginas : Pagina[];

    constructor(link : string, content : string) {
        this.link = link;
        this.content = content;
    }
}