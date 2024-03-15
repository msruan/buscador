document.addEventListener('DOMContentLoaded', main)


function main () {
    const inputElement = document.getElementsByClassName('search')
    const buttonElement = document.getElementById('searchButton')

    console.log(inputElement)
    buttonElement.addEventListener('click', async () => {
        const value = inputElement[0].value
        // console.log(value)
        // const response = await fetch(`http://localhost:3000/search/inputValue=${value}`)
        const response = await fetch(`http://localhost:3000/search`)

        console.log(await response.json())
    }) 
}