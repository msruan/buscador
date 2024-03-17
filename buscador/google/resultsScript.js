document.addEventListener('DOMContentLoaded', main);

function main() {
    const button = document.getElementById('showResultsButton');

    button.addEventListener('click', () => {
        const results = document.getElementById('results');
        results.style.display = 'block';
    });
}