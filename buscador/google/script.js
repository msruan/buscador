document.addEventListener("DOMContentLoaded", main);

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

function main() {
  const inputElement = document.getElementsByClassName("search");
  const buttonElement = document.getElementById("searchButton");
  const submitElement = document.getElementById("submit");

  buttonElement.addEventListener("click", () =>
    searchByInput(inputElement[0].value)
  );
  submitElement.addEventListener("click", (e) => atualizarJson(e));
}

// function atualizarCampo(novoValor, id) {
//     console.log("valor do id: ",id )
//     document.getElementById(`campo${id}`).innerText = novoValor;
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
