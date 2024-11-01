const form = document.querySelector("#form");
const weatherDetails = document.querySelector(".weather-details");
const input = document.querySelector("#city-input");
const apiKey = "fa4f1798f728d7b948d4c9303dec4a5e";

async function fetchCityWeather(city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response =await fetch(apiUrl)
    if(!response.ok){
        throw new Error('Unable to fetch weather details ')
    }
    return response.json()
}

function displayWeatherDetails(data){
    const{name:name, main:{temp,humidity}, weather:[{id,description}]}=data
    
    weatherDetails.textContent='';
    weatherDetails.style.display='flex';

    const cityDisplay=document.createElement('h1')
    const tempDisplay=document.createElement('p')
    const humidityDisplay=document.createElement('p')
    const descDisplay=document.createElement('p')
    const weatherEmoji=document.createElement('p')

    cityDisplay.textContent=name
    tempDisplay.textContent=`${(temp-273.15).toFixed(2)}°C`
    humidityDisplay.textContent=`${humidity}% Humidity`
    descDisplay.textContent=description
    weatherEmoji.textContent= fetchWeatherEmoji(id)

    weatherDetails.appendChild(cityDisplay).classList.add('city')
    weatherDetails.appendChild(tempDisplay).classList.add('temp')
    weatherDetails.appendChild(humidityDisplay).classList.add('humidity')
    weatherDetails.appendChild(descDisplay).classList.add('description')
    weatherDetails.appendChild(weatherEmoji).classList.add('emoji')
}

function fetchWeatherEmoji(id){
    switch(true){
        case(id >= 200 && id < 300):
            return '⛈️'
        case(id >= 300 && id < 400):
            return '🌦️'
        case(id >= 500 && id < 600):
            return '🌧️'
        case(id >= 600 && id < 700):
            return '❄️'
        case(id >= 700 && id < 800):
            return '🌫️'
        case(id === 800):
            return '☀️'
        case(id >= 801 && id < 810):
            return '☁️'
        default:
            return '❓';
    }
}

function catchError(message){
    const errorMssg=document.createElement('p')
    errorMssg.textContent=message
    errorMssg.classList.add('error')

    weatherDetails.textContent=''
    weatherDetails.style.display='flex'
    weatherDetails.appendChild(errorMssg)
}

form.addEventListener('submit', async event=>{
    event.preventDefault()
    const city = input.value
    if (city){
        try{
            const weatherData = await fetchCityWeather(city)
            displayWeatherDetails(weatherData)
        }
        catch(error){
            catchError(`Error fetching weather data: ${error.message}`);
        }
    }else{
        catchError('Please enter a valid city')
    }
    input.value=''
})