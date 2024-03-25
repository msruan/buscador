document.addEventListener("DOMContentLoaded", main);

async function main() {
  
  await createHTML();

  document
    .getElementById("tabelaButton")
    .addEventListener("click", changeVisibilityOfTable);
    
  makeNewSearch();
  changeVisibilityOfBoxShadowOnSearchBox();
  changeIconOfSearchButton()
}

function reescreverPagina(value){

  updateStorage(value)
  document.getElementById("head").innerHTML = null;
  document.getElementById("body").innerHTML = null;
  window.location.reload();
  main();
}

async function createHTML(){
  
  const value = window.localStorage.getItem("@data");

  document.querySelector("title").textContent = value + " - Pesquisa Google";
  document.getElementById("value").value = value

  const results = await getResponse(value);
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
}

function handleEnterDown(e) {
  if (e.key === "Enter") {
    const buttonElement = document.getElementById("searchButton");
    buttonElement.click();
  }
}

function updateStorage(value) {
window.localStorage.setItem('@data', value)
}


async function getResponse(value) {
  const response = await fetch(`http://localhost:3000/search/${value}`);
  const data = await response.json();

  return data;
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

function makeNewSearch(){

  const inputElement = document.getElementsByClassName("search");
  const searchButtonElement = document.getElementById("searchButton");

  searchButtonElement.addEventListener("click", () => {
    const valor = inputElement[0].value;
    if (valor != null && valor != "") reescreverPagina(valor);
  });
}

/* -------------------------------------------------------------------------- */
/*                               STYLE FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function changeVisibilityOfTable(event) {

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

function changeVisibilityOfBoxShadowOnSearchBox(){

  const searchBox = document.getElementById("search-box")
  const searchInput = document.getElementById("value");

  searchBox.addEventListener('mouseenter',() => {
    searchBox.classList.add("hovered");
  });

  searchBox.addEventListener('mouseleave',() => {
      if(! searchInput.matches(":focus")){
        searchBox.classList.remove("hovered");
      }
  });

  searchInput.addEventListener('focus', () => {
    searchBox.classList.add("hovered");
    // searchBox.style.boxShadow = "inset 3px 3px #1f1f1f, 3px 3px #1f1f1f";
    
});

searchInput.addEventListener('blur', () => {
    searchBox.classList.remove("hovered");
    // searchBox.style.boxShadow = "none";

});
}

function changeIconOfSearchButton(){

  console.log("Mudando icone de search!");

  const searchButtonElement = document.getElementById("searchButton");
  const img = searchButtonElement.querySelector("img");

    searchButtonElement.addEventListener('mouseenter', () => {//Trocar por img.addE... se quiser q fique roxo só quando encostar na lupa
      // buttonElement.classList.add('hover');
      // const img = buttonElement.querySelector("img");
      img.src = "img/lupa-hover.png";
      console.log("Eba, mouse entrou!")
      
  });

  searchButtonElement.addEventListener('mouseleave', () => {
      // buttonElement.classList.remove('hover');
      // const img = buttonElement.querySelector("img");
      img.src = "img/lupa.png";
      console.log("Aff, mouse saiu!")

  });
}