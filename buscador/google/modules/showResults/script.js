document.addEventListener('DOMContentLoaded', main);

function main() {
    
    const response = window.localStorage.getItem('@values');

    if (response) {
        const h1 = document.querySelector('h1');

        h1.innerHTML = `Resultados da Pesquisa por ${searched_term}`
    }
}   