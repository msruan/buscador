export class Pagina {
    private _link : string;
    private _content : string;
    private _autoridade : number;

    constructor(link : string, content : string) {
        this._link = link;
        this._content = content;
        this._autoridade = 0;
    }

    public get autoridade(): number {
        return this._autoridade;
    }

    public getLink() : string {
        return this.link;
    }
    
    public get link() : string {
        return this._link;
    }

    public get content() : string {
        return this._content;
    }
}

class PaginaScore {
    
}