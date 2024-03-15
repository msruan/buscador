document.addEventListener('DOMContentLoaded', main)


function main () {
    const inputElement = document.getElementsByClassName('search')
    const buttonElement = document.getElementById('searchButton')

    console.log(inputElement)
    buttonElement.addEventListener('click', () => {
        console.log()
    })
}