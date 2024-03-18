document.addEventListener("DOMContentLoaded", main);

async function main() {
  const value = window.localStorage.getItem("@data");

  document.querySelector("title").textContent = value;

  const results = await getResponse(value);
  document.getElementById("search-value").textContent = value;
  const cardBox = document.getElementsByClassName("caixa-de-cards")[0];
  const resultsTable = document.getElementById("results-table");

  console.log(results);
  results.forEach((result) => {
    console.log(result);

    if (result._score.frequencia > 0) {
      const card = createCard(result);
      cardBox.appendChild(card);
    }
  });

  results.forEach((result) => {
    const row = createRow(result);
    resultsTable.appendChild(row);
  });

  document
    .getElementById("tabelaButton")
    .addEventListener("click", mostrarOcultarTabela);

  // response.forEach(element => {
  //     console.log(element)
  // });

  // if (response) {
  //     const h1 = document.querySelector('h1');

  //     h1.innerHTML = `Resultados da Pesquisa por ${searched_term}`
  // }
}

async function getResponse(value) {
  const response = await fetch(`http://localhost:3000/search/${value}`);
  const data = await response.json();

  return data;
}

function mostrarOcultarTabela(event) {
  event.preventDefault();
  const buttonEscondedor = document.getElementById("tabelaButton");
  const tabelaAEsconder = document.getElementById("results-table");
  if (
    tabelaAEsconder.style.display == "" ||
    tabelaAEsconder.style.display == "none"
  ) {
    tabelaAEsconder.style.display = "block";
    buttonEscondedor.textContent = "Ocultar scores";
  } else {
    buttonEscondedor.textContent = "Mostrar scores";
    tabelaAEsconder.style.display = "none";
  }
}

function createCard(data) {
  const cardTemplate = document.getElementById("cardTemplate");

  const card = document.importNode(cardTemplate.content, true);

  const a = card.querySelector("a");
  a.href = "../../../sites/"+data._pagina._link

  const h2 = card.querySelector("h2");
  h2.innerText = data._pagina._title;

  const p = card.querySelector("p");
  p.innerText = data._pagina._description;

  return card;
}

function calcularPontosTotais(score) {
  const somaPontuacao =
    score.a +
    score.autoreferencia +
    score.autoridade +
    score.fresco +
    score.h1 +
    score.h2 +
    score.p +
    score.frequencia;
  return somaPontuacao;
}

function createRow(result) {
  console.log(result);
  const rowTemplate = document.getElementById("tableRowTemplate");

  const row = document.importNode(rowTemplate.content, true);

  const atributes = row.querySelectorAll("td");

  atributes[0].innerHTML = result._pagina._title;
  atributes[1].innerHTML = result._score.frequencia;
  atributes[2].innerHTML = result._score.h1;
  atributes[3].innerHTML = result._score.h2;
  atributes[4].innerHTML = result._score.p;
  atributes[5].innerHTML = result._score.a;
  atributes[6].innerHTML = result._score.autoridade;
  atributes[7].innerHTML = result._score.autoreferencia;
  atributes[8].innerHTML = result._score.fresco;
  atributes[9].innerHTML = calcularPontosTotais(result._score);
  atributes[10].innerHTML = result._score.frequencia > 0 ? "Yesn't" : "Not not";

  return row;
}