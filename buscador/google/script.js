const fs = require('fs');

document.addEventListener('DOMContentLoaded', main);

async function searchByInput(value) {
    const response = await fetch(`http://localhost:3000/search/${value}`);
    const html = await response.text();
    const newWindow = window.open(); // Abrir uma nova janela do navegador
    newWindow.document.write(html); // Escrever o HTML na nova janela
}

function handleEnterDown(e) {
    if (e.key === "Enter") {
        const buttonElement = document.getElementById('searchButton')
        buttonElement.click()
    }
}

function main () {
    const inputElement = document.getElementsByClassName('search')
    const buttonElement = document.getElementById('searchButton')
    const submitElement = document.getElementById('submit')

    buttonElement.addEventListener('click', () => searchByInput(inputElement[0].value)) 
    submitElement.addEventListener('click', () => atualizarJson()) 
}

// function atualizarCampo(novoValor, id) {
//     console.log("valor do id: ",id )
//     document.getElementById(`campo${id}`).innerText = novoValor;
// }

function atualizarJson() {
    let frequencia = document.getElementById("0").value
    console.log(frequencia)
    let h1 = document.getElementById("1").value
    let h2 = document.getElementById("2").value
    let a = document.getElementById("3").value
    let p = document.getElementById("4").value
    let autoridade = document.getElementById("5").value
    let autoreferencia = document.getElementById("6").value
    let frescor = document.getElementById("7").value
    let velho = document.getElementById("8").value

    let jsonData

    // fetch('scores.json')
    // .then(response => response.text())
    // .then(text => {
    // const array = text.split("\n");
    // // console.log(array);
//   })

    // let jsonData = JSON.parse(fs.readFileSync("../scores.json"))
    // console.log("Valores padrões")
    // console.table(jsonData);
    // jsonData.frequencia = frequencia
    // fs.writeFileSync("../scores.json",JSON.stringify(jsonData,null,2))

    // fetch('path/to/your/file.json') 
    // .then(response => response.json()) 
    // .then(jsonData => { 
    //     // Edit or Add Data jsonData.someProperty = 'new value'; jsonData.newProperty = 'new data'; // Write back to the file (Note: This is not directly possible in the browser due to security reasons) }); 
    //     } )
}