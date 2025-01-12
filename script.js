const CityInput = document.querySelector('.city-input')
const searchButten = document.querySelector('.search-butten')

const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city') 

const countryTxt = document.querySelector('.country-text')
const tempTxt = document.querySelector('.temp-text')
const conditionTxt = document.querySelector('.condition-text')
const humidityValueTxt = document.querySelector('.humidity-value-text')
const windValueTxt= document.querySelector('.wind-value-text')
const weatherSummeryImage = document.querySelector('.weather-summery-image')
const currentDateTxt = document.querySelector('.current-date-text')

const forcastItemsContainer = document.querySelector('.forcast-main')

const apiKey = `039bcd5619907e0693d8ee2222b788be`

searchButten.addEventListener('click', () => {
    if (CityInput.value.trim() != ""){
        updateWeatherinfo(CityInput.value)
        CityInput.value = ""
        CityInput.blur()
    }
})

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday : 'short',
        day : '2-digit', 
        month : 'short' 
    }

    return currentDate.toLocaleDateString('en-GB' , options)
    console.log(currentDate)
}

CityInput.addEventListener('keydown', (event)=> {
    if(event.key == 'Enter' && 
        CityInput.value.trim() != ''
     ){
        updateWeatherinfo(CityInput.value)
        CityInput.value = ""
        CityInput.blur()
     }
    // console.log(event)
})

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}%20&appid=${apiKey}&units=metric`

    const respone = await fetch(apiUrl)

    return respone.json()
}

function getweathericon(id){
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'drizzle.svg'
    if (id <= 321) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'   
}

async function updateWeatherinfo(city){
    const weatherDate = await getFetchData('weather', city)
    if(weatherDate.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: country,
        main : {temp, humidity},
        weather: [{id, main}],
        wind: {speed}
    } = weatherDate

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity+ '%'
    windValueTxt.textContent = speed + 'M/s'

    currentDateTxt.textContent = getCurrentDate()

    weatherSummeryImage.src= `assets/weather/${getweathericon(id)}`

    await updateForecastsInfo(city)    
    showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
    const forecastsDate = await getFetchData('forecast', city )

    const timeTake = '12:00:00'
    const todyDate = new Date().toISOString().split('T')[0]

    forcastItemsContainer.innerHTML = ' '
    forecastsDate.list.forEach(forecastWeather => {
        
        if (forecastWeather.dt_txt.includes(timeTake) &&
            !forecastWeather.dt_txt.includes(todyDate)){
            updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(weatherDate){
    console.log(weatherDate)
    const  {
        dt_txt: date,
        weather: [{
             id
        }],
        main: {temp}
    } = weatherDate

    const dateTaken = new Date(date)
    const dateOption = {
        day : '2-digit',
        month : 'short', 
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forcastItem = `
        <div class="forcast-items-container">
            <div class="forcast-item">
                <h5 class="forcast-item-dater regular-text">${dateResult}</h5>
                <img src="assets/weather/${getweathericon(id)}" alt="" class="forcast-item-img">
                <h5 class="forcast-item-temp">${Math.round(temp)} °C</h5>
            </div>
        </div>
    `

    forcastItemsContainer.insertAdjacentHTML('beforeend', forcastItem)
}

function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}