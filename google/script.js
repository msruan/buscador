document.addEventListener("DOMContentLoaded", main);


async function main() {
  sincronizarFormulario();
  
  const submitElement = document.getElementById("submit-btn");
  const resetElement = document.getElementById("reset-btn");
  const botaoocultarElement = document.getElementById("botao-ocultar");
  
  const inputElement = document.getElementsByClassName("search");
  const buttonElement = document.getElementById("searchButton");

  buttonElement.addEventListener("click", () => {
    const valor = inputElement[0].value;
    if (valor != null && valor != "") searchByInput(valor);
  });

  resetElement.addEventListener("click", resetarFormulario);

  submitElement.addEventListener("click", (e) =>{ atualizarJson(e)
     sincronizarFormulario();});

  botaoocultarElement.addEventListener("click", (e) =>
    mostrarOcultarFormulario(e)
  );
}

/**
     * Recebe o input do local storage e abre uma página de resultados.
     * @function
     */
async function searchByInput(value) {
  createStorage(value)
  window.open('./modules/showResults/index.html')
}

function createStorage(value) {
  window.localStorage.setItem('@data', value)
}

function handleEnterDown(e) {
  if (e.key === "Enter") {
    const buttonElement = document.getElementById("searchButton");
    buttonElement.click();
  }
}

function mostrarOcultarFormulario(event) {
  const botaoocultar = document.getElementById("botao-ocultar");
  const form1 = document.getElementById("form1");

  if (form1.style.display == "" || form1.style.display == "none") {
    botaoocultar.textContent = "Ocultar painel";

    form1.style.display = "block";

  } else {
    botaoocultar.textContent = "Mostrar painel";

    form1.style.display = "none";
  }
  return false;
}

async function atualizarJson(event) {
  event.preventDefault();

  let score = {
  
    frequencia: parseInt(document.getElementById("i-frequencia").value),
    h1: parseInt(document.getElementById("i-h1").value),
    h2: parseInt(document.getElementById("i-h2").value),
    a: parseInt(document.getElementById("i-a").value),
    p: parseInt(document.getElementById("i-p").value),
    autoridade: parseInt(document.getElementById("i-autoridade").value),
    autoreferencia: parseInt(document.getElementById("i-autoreferencia").value),
    fresco: parseInt(document.getElementById("i-fresco").value),
    velho: parseInt(document.getElementById("i-velho").value),
  };

  const jsonData = JSON.stringify(score);
  console.table(jsonData);

  const response = await fetch(`https://thebuscador.onrender.com/atualizar-json`, {
    method: "POST",
    body: jsonData,
    headers: {
      "content-type": "application/json",
    },
  })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
  console.log(response);
}

function atualizarCampo(novoValor, id) {
  if (novoValor < 10 && novoValor >= 0) {
    document.getElementById(id).innerHTML = 0 + novoValor;
  } else {
    document.getElementById(id).innerHTML = novoValor;
  }
}

async function resetarFormulario(){
  try {
    const response = await fetch(`https://thebuscador.onrender.com/resetar-scores`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter os scores');
    }

  const score = await response.json();
  atualizarCamposFormulario(score);
} catch (error) {
  console.error(error);
  
}
}


async function sincronizarFormulario(){
  try {
    const response = await fetch(`https://thebuscador.onrender.com/atualizar-scores`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter os scores');
    }

  const score = await response.json();
  atualizarCamposFormulario(score);
} catch (error) {
  console.error(error);
}
}

function atualizarCamposFormulario(score) {

  // Atualize os campos do formulário com os dados recebidos
  document.getElementById("f-frequencia").textContent = score.frequencia;
  document.getElementById("f-h1").textContent = score.h1;
  document.getElementById("f-h2").textContent = score.h2;
  document.getElementById("f-p").textContent = score.p;
  document.getElementById("f-a").textContent = score.a;
  document.getElementById("f-autoridade").textContent = score.autoridade;
  document.getElementById("f-autoreferencia").textContent = score.autoreferencia;
  document.getElementById("f-fresco").textContent = score.fresco;
  document.getElementById("f-velho").textContent = score.velho;

  document.getElementById("i-frequencia").value = score.frequencia;
  document.getElementById("i-h1").value = score.h1;
  document.getElementById("i-h2").value = score.h2;
  document.getElementById("i-p").value = score.p;
  document.getElementById("i-a").value = score.a;
  document.getElementById("i-autoridade").value = score.autoridade;
  document.getElementById("i-autoreferencia").value = score.autoreferencia;
  document.getElementById("i-fresco").value = score.fresco;
  document.getElementById("i-velho").value = score.velho;
};