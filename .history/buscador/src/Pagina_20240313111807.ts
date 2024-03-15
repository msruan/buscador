export class Pagina {
    private _link : string;
    private _content : string;
    private _autoridade : number;

    constructor(link : string, content : string) {
        this._link = link;
        this._content = content;
    }

    public get link : number {
        return 
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
