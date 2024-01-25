document.addEventListener('DOMContentLoaded', ()=> {
    /////////////////  MAP  ///////////////////
    // osm layer
    var map = L.map('map').setView([51.1282205, 71.4306682],12);
    var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    osm.addTo(map);

    //layers
    var temp = L.tileLayer('http://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=38cd6323fab63e18234d6697723943cc', {
            maxZoom: 18
        }),
        precipitation = L.tileLayer('http://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=38cd6323fab63e18234d6697723943cc', {
            maxZoom: 18
        }),
        wind = L.tileLayer('http://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=38cd6323fab63e18234d6697723943cc', {
            maxZoom: 18
        }),
        pressure = L.tileLayer('http://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=38cd6323fab63e18234d6697723943cc', {
            maxZoom: 18
        }),
        clouds = L.tileLayer('http://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=38cd6323fab63e18234d6697723943cc', {
            maxZoom: 18
        });


    var overlays = {"Temperature": temp, "Precipitation": precipitation, "Clouds": clouds, "Pressure": pressure, "Wind": wind};
    L.control.layers(overlays, null, {collapsed:false}).addTo(map);

    //markers
    // var singleMarker = L.marker([51.1282205, 71.4306682]).addTo(map);
    // var popup = singleMarker.bindPopup('me');
    // popup.addTo(map);
    //
    //
    // (async function() {
    //     try {
    //         const cities = await getJson();
    //         await addMarkers(map, cities);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // })();


    /////   VALIDATION ///////////
    const cityForm = document.getElementById("city-form");
    const formArray = Array.from(cityForm); //array of inputs
    const validFormArray = [];
    const latForm = document.getElementById("lat");
    const lonForm = document.getElementById("lon");

    formArray.forEach((el) => { //initialization of the array
        el.setAttribute("is-valid", "0");
        validFormArray.push(el);
    });
    validFormArray.at(validFormArray.length-1).setAttribute("is-valid", "1")

    cityForm.addEventListener("input", inputHandler);

    function inputHandler({target}){
        if (target.hasAttributes("data-reg")) {
            inputCheck(target);
        }
    }

    function inputCheck(el) {
        const inputValue = el.value;
        const inputReg = el.getAttribute("data-reg");
        const reg = new RegExp(inputReg);
        let error;
        if (el.id==="lat") {
            error = document.querySelector("#latError");
        }
        if (el.id==="lon") {
            error = document.querySelector("#lonError");
        }

        if (reg.test(inputValue)) {
            el.setAttribute("is-valid", "1");
            el.style.border = "3px solid rgb(0, 196, 0)";
            error.style.color = "green";

        } else {
            el.setAttribute("is-valid", "0");
            el.style.border = "3px solid red";
            error.style.color = "red";
        }
    }

    cityForm.addEventListener('submit', submitButtonHandler);

    function submitButtonHandler(e) {
        e.preventDefault();
        // const isAllValid = [];
        let allValid = true;
        validFormArray.forEach((el) => {
            let isValid = el.getAttribute("is-valid");
            console.log(isValid);
            // isAllValid.push(isValid);
            if (allValid) {
                if (isValid==0) {
                    allValid=false;
                }
            }
        });
        if (allValid) {
            let lat = latForm.value;
            let lon = lonForm.value;
            console.log(lat);
            console.log(lon);
            findLocation(lat, lon);
        }
    }

    //////////// VALIDATION END////////////
    let city;
    let mapLat;
    let mapLon;
    let weather;
    let popupHtml;

    function findLocation(lat, lon){
        let url = `http://localhost:3000/geo?lat=${lat}&lon=${lon}`;
        let city;
        console.log(url);
            fetch(url, {method:"GET"})
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.length === 0) { //if there is no city or region
                        console.log("no city");
                    } else {
                        city = data[0];
                        mapLat = city.lat;
                        mapLon = city.lon;

                        url = `http://localhost:3000/weather?lat=${lat}&lon=${lon}`;
                        fetch(url, {method:"GET"})
                            .then(response => response.json())
                            .then(data => {
                                weather = data;

                                let imageId = weather.weather[0].icon;
                                let temp = Math.floor(weather.main.temp - 273.15);
                                let feelsLike = Math.floor(weather.main.feels_like - 273.15) ;
                                let rain3h;
                                let rain1h;
                                if (weather.rain) {
                                    if (weather.rain['1h']){
                                        rain1h = `<br> Rain volume for the last hour: ${weather.rain['1h']}`;
                                    } else {rain1h = ""}
                                    if (weather.rain['3h']) {
                                        rain3h = `<br> Rain volume for the last 3 hours: ${weather.rain['3h']}`;
                                    } else { rain3h = ""; }
                                } else { rain3h = ""; rain1h = "";}

                                popupHtml = `
                                                <div style="width: 100%; display: flex; justify-content: center">
                                                <img src=\"http://openweathermap.org/img/w/${imageId}.png\" alt=\"Weather Icon\">
                                            </div>
                                            <div> 
                                                <p style=\"\" >Country code:${weather.sys.country} <br> ${weather.weather[0].main} <br>
                                                    Temperature: ${temp}°<br> Feels like: ${feelsLike}° 
                                                    <br> Humidity: ${weather.main.humidity} <br> Pressure: ${weather.main.pressure} <br> 
                                                    Wind speed: ${weather.wind.speed} ${rain3h} ${rain1h} </p> 
                                            </div>`



                                //// add info to map ////
                                map.setView([mapLat, mapLon], 12);
                                let newMarker = L.marker([mapLat, mapLon]).addTo(map);
                                let popup = newMarker.bindPopup(popupHtml);
                                newMarker.openPopup();
                                popup.addTo(map);

                            })
                            .catch(err => console.error(err.message));




                    }

                }).catch(err => console.error(err.message));

            // then(response => {
            // let city = response.json();
            // console.log(city)
        };



});
