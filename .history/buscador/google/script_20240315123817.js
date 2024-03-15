document.addEventListener('DOMContentLoaded', main)

function handleEnterDown(e) {
    window.KeyboardEvent()
    const buttonElement = document.getElementById('search')

    buttonElement.click()
}

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
    // inputElement[0].addEventListener('keypress', (e) => {
    //     if (e.keycode === 13) {searchByInput(inputElement[0].value)} 
    // })
}