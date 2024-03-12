import { Buscador } from "./Buscador";

async function main(){
    let google : Buscador = new Buscador();
    await google.main();
}
main()