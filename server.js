const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const https = require('https');
const apiKey = require(__dirname + '/apiKey.js');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

var city, temp, longitude, latitude, temp, clouds;

app.get('/', (req,res) => {
    res.render('index', {
        city: city,
        longitude: longitude,
        latitude: latitude,
        temp: temp,
        clouds: clouds
    });
});

app.post('/', (req,res) => {
    const cep = req.body.cep;
    const url = 'https://viacep.com.br/ws/' + cep +'/json/';
    let urlWeather;

    https.get(url, response => {
        response.on('data', d => {
            city = JSON.parse(d).localidade;
    
            urlWeather = 'https://api.openweathermap.org/data/2.5/weather?q=' + city +'&units=metric&appid=' + apiKey;

            https.get(urlWeather, response =>{
                response.on('data', d => {
                    const weather = JSON.parse(d);
                    
                    longitude = weather.coord.lon;
                    latitude = weather.coord.lat;
                    temp = weather.main.temp + 'º';
                    clouds = 'http://openweathermap.org/img/wn/' + weather.weather[0].icon +'@2x.png';
            
                    res.redirect('/');
                });
            });
        })
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});