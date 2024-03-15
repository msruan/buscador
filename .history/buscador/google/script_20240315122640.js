document.addEventListener('DOMContentLoaded', main)

async function searchByInput(value) {

        // console.log(value)
        // const response = await fetch(`http://localhost:3000/search/inputValue=${value}`)
        const response = await fetch(`http://localhost:3000/search/${value}`)

        console.log(await response.json())
}

function main () {
    const inputElement = document.getElementsByClassName('search')
    const buttonElement = document.getElementById('searchButton')

    buttonElement.addEventListener('click', () => searchByInput(inputElement[0].value)) 
    inputElement.addEventListener
}