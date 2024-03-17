document.addEventListener('DOMContentLoaded', main);

async function searchByInput(value) {
    const response = await fetch(`http://localhost:3000/search/${value}`);
    const html = await response.text();
    const newWindow = window.open(); // Abrir uma nova janela do navegador
    newWindow.document.write(html); // Escrever o HTML na nova janela
    newWindow.document.title = `${value}`;
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

    buttonElement.addEventListener('click', () => searchByInput(inputElement[0].value)) 
}