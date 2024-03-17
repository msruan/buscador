import { Pagina } from "./Pagina";
export function criarPaginaResultados(results : Pagina[], searched_term : string) {
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="results.css">
            <title>${searched_term}</title>
        </head>
        <body>
            <h1>Resultados da Pesquisa por ${searched_term}</h1>

            <section>
                <div class="main">

                    <img src="img/google.png" alt="icone google">

                    <div class="caixaDePesquisa">
                        <input type="text" class="search" onkeypress="handleEnterDown(event)">
                    </div>

                    <div class="button">
                        <button id="searchButton">Google Search</button>
                    </div>

                
                </div>
            </section>

            <div class="caixa-de-cards">
    `;

    results.forEach(result => {
        html += `
        <div class="card">
            <header>
                <div class="titulo">
                    <a href="../sites/${result.link}" target="_blank">
                        <h2>${result.title}</h2>
                    </a>
                </div>
            </header>
            <main>
                <div class="description">
                    <p>${result.description}</p>
                </div>
            </main>
        </div>
        `;
    });

    
    
    // results.forEach(result => {
    //     html += `
    //     <div class="resultTable">
    //     <header>
    //     <div class="titulo">
    //     <a href="../sites/${result.link}" target="_blank">
    //     <h2>${result.title}</h2>
    //     </a>
    //             </div>
    //             </header>
    //             <main>
    //             <div class="description">
    //                 <p>${result.description}</p>
    //             </div>
    //         </main>
    //         </div>
    //     `;
    // });
    
    html += `
            </div>
        </body>
        </html>
    `;

    return html;
}