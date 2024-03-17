
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
    submitElement.addEventListener('click', (e) => atualizarJson(e)) 
}

// function atualizarCampo(novoValor, id) {
//     console.log("valor do id: ",id )
//     document.getElementById(`campo${id}`).innerText = novoValor;
// }

async function atualizarJson(event) {
    event.preventDefault();

    console.log("Chamei a atualizar score eba"+document.getElementById("0").value);

    let score = {
        "frequencia" : document.getElementById("0").value,
        "h1" : document.getElementById("1").value,
        "h2" : document.getElementById("2").value,
        "a" : document.getElementById("3").value,
        "p" : document.getElementById("4").value,
        "autoridade" : document.getElementById("5").value,
        "autoreferencia" : document.getElementById("6").value,
        "frescor" : document.getElementById("7").value,
        "velho" : document.getElementById("8").value
    }
    // console.table(score)"3 "
    const jsonData = JSON.stringify(score)
    console.log("Eu mandei...")
    console.table(jsonData);
    
    const response = await fetch(`http://localhost:3000/atualizar-json`, {
        method: 'POST',
        body: jsonData,
        headers: {
            'content-type':'application/json'
        }
    })
    .then((data) => { 
        console.log("OIEEEE");
       console.log(data);
    }) 
    .catch((err) => console.log(err));
    console.log(response);
}