import {parse} from 'node-html-parser'
export class Pagina {
    private _title : string;
    private _description : string = "";
    private _link : string;
    private _content : string;

    constructor(link : string, content : string) {
        this._link = link;
        this._content = content;
        
        const DOOM = parse(content);
        this._title = DOOM.getElementsByTagName("title")[0].text;

        const metas = DOOM.getElementsByTagName("meta");
        for(let meta of metas){
            if(meta.getAttribute("name")?.includes("description")){
                this._description = meta.getAttribute("content") || "";
            }
        }
    }

    public get link() : string {
        return this._link;
    }

    public get content() : string {
        return this._content;
    }

    public get title() : string {
        return this._title;
    }

    public get description() : string {
        return this._description;
    }
}