const apiKey = '4edc362a68c205ff8623a258dfd5ca74';
const submitWeather = document.getElementById('btn_weather');
const input =  document.getElementById('city_weather');
const displayWeather = document.querySelector('.display-weather');

submitWeather.addEventListener('click', getWeather);
input.addEventListener('keyup', e => {
    if(e.key === "Enter"){
        getWeather()
    }
})

const createIcon = (iconPath) => {
    const icon = document.createElement('span');
    icon.innerHTML = iconPath;
    return icon;
};

const createElement = (tag, className, textContent = '') => {
    const element = document.createElement(tag);
    if (className) {
        element.classList.add(className);
    }
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

function getWeather(){
    const cityInput = input.value; //to have the info when clicked
    const geoCall =  `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`
    const unplashURL = `https://api.unsplash.com/search/photos?page=1&query=${cityInput}&client_id=QamvDmYlvPU_cPDzXQb_zbyDZmBgNKc8wVZPVQi_16g`

    fetch(geoCall)
    .then((response) => response.json())
    .then((responseData) => { 
        const { lat, lon } = responseData[0];
        const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        return fetch(apiURL);
    })
    .then((response) => response.json())
    .then((responseData) => {
        const weatherResultsDiv = createElement('div', 'weather-card-result');
        const weatherResultsH2 = createElement('h2', '', `The weather in ${cityInput}:`);
        const weatherInfo = createElement('div', 'weather-info');

        for (let i = 0; i < responseData.list.length; i+= 8) { // 5 days, 5*8=40
            const weatherIconTemp = createElement('div', 'weather-icon-temp')
            const day = responseData.list[i];
            const date = new Date(day.dt * 1000); // convert timestamp to date
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = date.toLocaleDateString('en-US', options); // to get the full date with day of the week
            const forecastDate = createElement('p', '', `${formattedDate}`);
            const weatherTemp = createElement('p', '', `${day.main.temp} °C`);
            
            const icon = day.weather[0].main === 'Clouds' ? createIcon(`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M13.002 7.009c3.168 0 4.966 2.097 5.227 4.63h.08a3.687 3.687 0 0 1 3.692 3.683a3.687 3.687 0 0 1-3.692 3.682H7.694a3.687 3.687 0 0 1-3.692-3.682a3.687 3.687 0 0 1 3.692-3.683h.08c.263-2.55 2.06-4.63 5.228-4.63M10 4c1.617 0 3.05.815 3.9 2.062a7.496 7.496 0 0 0-.898-.053c-2.994 0-5.171 1.677-5.937 4.213l-.068.24l-.058.238l-.206.039a4.681 4.681 0 0 0-3.449 3.045a3.282 3.282 0 0 1 1.812-5.881l.257-.006A4.72 4.72 0 0 1 10 4"/></svg>`) :
                         day.weather[0].main === 'Clear' ? createIcon(`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><path fill="currentColor" d="M16 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1m7 14a7 7 0 1 1-14 0a7 7 0 0 1 14 0m6 1a1 1 0 0 0 0-2h-2a1 1 0 1 0 0 2zm-13 9a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1M5 17a1 1 0 1 0 0-2H3a1 1 0 1 0 0 2zm.294-11.706a1 1 0 0 1 1.414 0l2 2a1 1 0 1 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414m1.414 21.414a1 1 0 0 1-1.414-1.414l2-2a1 1 0 1 1 1.414 1.414zm20-21.414a1 1 0 0 0-1.414 0l-2 2a1 1 0 0 0 1.414 1.414l2-2a1 1 0 0 0 0-1.414m-1.414 21.414a1 1 0 0 0 1.414-1.414l-2-2a1 1 0 1 0-1.414 1.414z"/></svg>`) :
                         day.weather[0].main === 'Rain' ? createIcon(`<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.001c3.169 0 4.966 2.097 5.227 4.63h.08A3.687 3.687 0 0 1 21 12.314a3.687 3.687 0 0 1-3.692 3.682h-.582l-1.583 2.637a.75.75 0 0 1-1.344-.659l.045-.091l1.15-1.887h-2.136l-1.583 2.637a.75.75 0 0 1-1.344-.659l.045-.091l1.15-1.887H8.987l-1.581 2.637a.75.75 0 0 1-1.344-.659l.045-.091l1.148-1.887h-.562A3.687 3.687 0 0 1 3 12.314A3.687 3.687 0 0 1 6.693 8.63h.08C7.035 6.08 8.831 4 12 4"/></svg>`) :
                         createIcon('Default SVG Path');

            weatherIconTemp.appendChild(forecastDate);
            weatherIconTemp.appendChild(weatherTemp);
            weatherIconTemp.appendChild(icon);   
            weatherInfo.appendChild(weatherIconTemp)        
        }

        weatherResultsDiv.appendChild(weatherResultsH2);
        weatherResultsDiv.appendChild(weatherInfo);
        
        if (displayWeather.querySelectorAll('.weather-card-result').length >= 2) {
            displayWeather.querySelector('.weather-card-result').remove()
        }

        displayWeather.appendChild(weatherResultsDiv);
        //wut
    })
    .then(() => {
        return fetch(unplashURL);
    })
    .then((response) => response.json())
    .then((responseData) => {
        const backgroundPhoto = responseData.results[0].urls.regular;
        displayWeather.style.background = `url(${backgroundPhoto})`;

    })

    .catch((error) => { 
        console.log(error);
    });
}
