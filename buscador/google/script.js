document.addEventListener("DOMContentLoaded", main);

function main() {
  const inputElement = document.getElementsByClassName("search");
  const buttonElement = document.getElementById("searchButton");
  const submitElement = document.getElementById("submit");
  const botaoocultarElement = document.getElementById('botao-ocultar');

  buttonElement.addEventListener("click", () =>{
    const valor = inputElement[0].value;
    if(valor != null && valor != "")
        searchByInput(valor)}
  );
  submitElement.addEventListener("click", (e) => atualizarJson(e));
  botaoocultarElement.addEventListener("click", (e) => mostrarOcultarFormulario(e))
  // atualizarCamposFormulario(e);
}

async function atualizarCamposFormulario(event) {
  event.preventDefault();
  console.log("Aconteceu alguma coisa?");
  
  const response = await fetch(`http://localhost:3000/atualizar-scores`);
  const score = await response.json();

  let campos = Object.keys(score)
  for (campo in campos){ 
      document.getElementById(campo).innerText = score[campo];
  }
};

async function searchByInput(value) {
  const response = await fetch(`http://localhost:3000/search/${value}`);
  const html = await response.text();
  const newWindow = window.open();
  newWindow.document.write(html);
}

function handleEnterDown(e) {
  if (e.key === "Enter") {
    const buttonElement = document.getElementById("searchButton");
    buttonElement.click();
  }
}

function mostrarOcultarFormulario(event){

  const botaoocultar = document.getElementById("botao-ocultar");
  const form1 = document.getElementById("form1");
  if(form1.style.display == "" || form1.style.display == "none"){
      botaoocultar.textContent = "Ocultar painel"
      // const fonte = document.getElementById("fonte");
      // fonte.focus();
      // botaoocultar.removeAttribute("href");
      form1.style.display = "block";
  }else {
      botaoocultar.textContent = "Mostrar painel"
      // botaoocultar.setAttribute('href', '#form1');
      form1.style.display = "none";
  }
  return false;
}

function main() {
  const inputElement = document.getElementsByClassName("search");
  const buttonElement = document.getElementById("searchButton");
  const submitElement = document.getElementById("submit");
  const botaoocultarElement = document.getElementById('botao-ocultar');

  buttonElement.addEventListener("click", () =>{
    const valor = inputElement[0].value;
    if(valor != null && valor != "")
        searchByInput(valor)}
  );
  submitElement.addEventListener("click", (e) => atualizarJson(e));
  botaoocultarElement.addEventListener("click", (e) => mostrarOcultarFormulario(e))
  // atualizarCamposFormulario(e);
}

// async function atualizarCamposFormulario(event) {
//   event.preventDefault();
  
//   const response = await fetch(`http://localhost:3000/atualizar-scores`);
//   const score = await response.json();

//   let campos = Object.keys(score)
//   for (campo in campos){ 
//       document.getElementById(campo).innerText = score.campo;
//   }
// }

async function atualizarJson(event) {
  event.preventDefault();

  console.log(
    "Chamei a atualizar score eba" + document.getElementById("0").value
  );

  let score = {
    // "fonte": document.getElementById("fonte").value,
    frequencia: parseInt(document.getElementById("0").value),
    h1: parseInt(document.getElementById("1").value),
    h2: parseInt(document.getElementById("2").value),
    a: parseInt(document.getElementById("3").value),
    p: parseInt(document.getElementById("4").value),
    autoridade: parseInt(document.getElementById("5").value),
    autoreferencia: parseInt(document.getElementById("6").value),
    fresco: parseInt(document.getElementById("7").value),
    velho: parseInt(document.getElementById("8").value),
  };

  const jsonData = JSON.stringify(score);
  console.log("Eu mandei...");
  console.table(jsonData);

  const response = await fetch(`http://localhost:3000/atualizar-json`, {
    method: "POST",
    body: jsonData,
    headers: {
      "content-type": "application/json",
    },
  })
    .then((data) => {
      console.log("OIEEEE");
      console.log(data);
    })
    .catch((err) => console.log(err));
  console.log(response);
}

function atualizarCampo(novoValor,id) {
  if(novoValor < 10 && novoValor >= 0){
      document.getElementById(id).innerHTML = 0+novoValor;
  }
  else 
  {document.getElementById(id).innerHTML = novoValor;}
}