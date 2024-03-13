import { Buscador } from "./Buscador";
import { Indexador } from "./Indexador";
import * as fs from "fs"
async function main(){
    let indexador : Indexador = new Indexador();
    // await indexador.downloadPages("https://msruan.github.io/samples/matrix.html");
    let google : Buscador = new Buscador(indexador);
    await google.main();

    // console.log(listarArquivosDoDiretorio('../sites'));
}
function listarArquivosDoDiretorio(diretorio : string) : string[]{

    const arquivos : string[] = [];
    let listaDeArquivos = fs.readdirSync(diretorio);
    for(let k in listaDeArquivos) {
        arquivos.push(listaDeArquivos[k]);
    }
    return arquivos;


// downloadPages("https://msruan.github.io/samples/matrix.html");   
}
main();