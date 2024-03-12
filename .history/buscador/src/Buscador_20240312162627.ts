import { Pagina } from "./Pagina";
import { link } from "fs";
import {question} from 'readline-sync'
import fetch from 'node-fetch'
import {parse} from 'node-html-parser'
import * as fs from 'fs'
import * as jsonfile from 'jsonfile'
import { downloadPages } from './download'
export class Buscador {
    private paginas : Pagina[];

    constructor(link : string, content : string) {
        this.link = link;
        this.content = content;
    }
}