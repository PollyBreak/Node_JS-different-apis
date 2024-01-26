var express = require('express');
const path = require('path');
const app = express();
const axios = require("axios");
const ejs = require('ejs');
const {response} = require("express");




let weather;

const openWeatherApiKey = "38cd6323fab63e18234d6697723943cc";
const newsApiKey = "23a71424284d4bedbe4e470123cdf63f";

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.listen(3000, function () {
  console.log('Server is listening on port 3000!');
});

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/index', function (req, res) {
  res.render('main', {city_name:city_name, weather:weather});
})


// app.get('weather/layer/temp'){
//
// }

// axios.get(geoApiUrl)
//     .then(response => {
//
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error.message);
//     });


app.get('/geo', function (req, res) {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if (lat && lon) {
        const reverseGeoApi = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWeatherApiKey}`;
        axios.get(reverseGeoApi).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.error('Error fetching data:', error.message);
        })
    } else {
        res.status(400);
    }
});

app.get('/weather', function (req, res) {
    const lat = req.query.lat;
    const lon = req.query.lon;

    if(lat && lon) {
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}`;
        axios.get(weatherApiUrl).then( response => {
            res.send(response.data);
        }). catch(error => {
            console.error(error.message);
        })
    }
})

app.get("/dictionary", function (req, res) {
    const word = req.query.word;
    if(word) {
        const dictionaryUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; //FreeDictionaryApi
        axios.get(dictionaryUrl).then( response => {
            res.send(response.data);
        }). catch(error => {
            res.send({doesnt_exist: "true"});
        })
    }
})

app.get("/news", function (req, res) {
    const title = req.query.title;
    const sortBy = req.query.sortBy;
    const from = req.query.from;
    const language = req.query.language;
    let page = req.query.page;
    if (!page) {
        page = 1;
    }

    if (title) {
        const url = "https://newsapi.org/v2/everything";
        axios.get(url, {params: {q:title,
                                        apiKey:newsApiKey,
                                        pageSize:4,
                                        page:page,
                                        sortBy:sortBy,
                                        from:from,
                                        language:language
                            }}).then( response => {
            res.send(response.data);
        }). catch(error => {
            res.send(error.message);
        })
    }

})



const city_name="Astana";
const limit = 1;
const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=${limit}&appid=${openWeatherApiKey}`;

var cityLat;
var cityLon;


// axios.get(geoApiUrl)
//     .then(response => {
//         const geoData = response.data;
//         var city = geoData[0];
//         cityLat = city.lat;
//         cityLon = city.lon;
//         console.log(city.lat);
//         console.log(city.lon);
//
//         const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${openWeatherApiKey}`;
//         return axios.get(weatherApiUrl);
//     })
//     .then(response => {
//         const weatherData = response.data;
//         console.log(weatherData);
//         weather = weatherData;
//         var weatherMain = weatherData.weather[0].main;
//         var weatherTemp = weatherData.main.temp;
//         var feelsLike = weatherData.main.feels_like;
//         var humidity = weatherData.main.humidity;
//         console.log(weatherMain);
//         console.log(weatherTemp);
//         console.log(feelsLike);
//         console.log(humidity);
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error.message);
//     });



// setInterval(updateWeatherData, 600000);