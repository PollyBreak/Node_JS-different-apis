document.addEventListener('DOMContentLoaded', function () {
    const cityForm = document.getElementById("city-form");
    const formArray = Array.from(cityForm); //array of inputs
    const validFormArray = [];


});

async function findLocation(lat, lon){
    let url = 'http://localhost:3000/geo?lat=$lat&lon=$lon';
    let response = await fetch(url);

}