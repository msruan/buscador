document.addEventListener('DOMContentLoaded', main)


function main () {
    const inputElement = document.getElementsByClassName('search')
    const buttonElement = document.getElementById('searchButton')

    console.log(inputElement)
    buttonElement.addEventListener('click', async () => {
        const value = inputElement[0].value

        const response = fetch('localhos')
    })
}