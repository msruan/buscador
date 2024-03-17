"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarPaginaResultados = void 0;
function criarPaginaResultados(results, searched_term) {
    let html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="results.css">
            <link rel="stylesheet" href="table.css">
            <title>${searched_term}</title>
            <script src="./resultsScript.js"></script>
        </head>
        <body>
            <h1>Resultados da Pesquisa por ${searched_term}</h1>

            <section>
                <div class="main">

                    <img src="img/google.png" alt="icone google">

                    <div class="caixaDePesquisa">
                        <input type="text" class="search" onkeypress="handleEnterDown(event)" placeholder="Buscar">
                    </div>

                    <div class="button">
                        <button id="searchButton">Google Search</button>
                    </div> 

                    <div>
                        <button class="tabela">Abrir tabela</button>
                    </div>
                </div>
            </section

            <div class="caixa-de-cards">
    `;
    results.filter((paginaScore) => paginaScore.ehExibivel()).forEach((result) => {
        html += `
        <div class="card">
            <header>
                <div class="titulo">
                    <a href="../sites/${result.pagina.link}" target="_blank">
                        <h2>${result.pagina.title}</h2>
                    </a>
                </div>
            </header>
            <main>
                <div class="description">
                    <p>${result.pagina.description}</p>
                </div>
            </main>
        </div>
        `;
    });
    html += `
            </div>
            <ur>
    `;
    html += `
            <table summary="Essa tabela contêm as pontuações obtidas por cada página numa determinada busca" caption="Scores">
                <tr>
                    <th>Nome</th>
                    <th>Frequência</th>
                    <th>H1</th>
                    <th>H2</th>
                    <th>A</th>
                    <th>P</th>
                    <th>Autoridade</th>
                    <th>Autoreferência</th>
                    <th>Frescor</th>
                    <th>Total</th>
                    <th>Deve aparecer</th>
                </tr>
                `;
    results.forEach((resultado) => {
        const score = resultado.score;
        html += `
                <tr class="cordacelula">
                    <td>${resultado.pagina.title}</td>
                    <td>${score.frequencia}</td>
                    <td>${score.h1}</td> 
                    <td>${score.h2}</td>
                    <td>${score.a}</td>
                    <td>${score.p}</td>
                    <td>${score.autoridade}</td>
                    <td>${score.autoreferencia}</td>
                    <td>${score.fresco}</td>
                    <td>${score.calcularPontosTotais()}</td>
                    <td>${resultado.ehExibivel() == true ? "Sim" : "Não"}</td>
                </tr>`;
    });
    html += `
          </table>
        </body>
    </html>`;
    return html;
}
exports.criarPaginaResultados = criarPaginaResultados;
