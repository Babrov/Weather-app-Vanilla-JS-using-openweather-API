
let getMonthDay = (dt) => {
    let date = new Date(dt*1000)
    let monthArray = [
        "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    let month = date.getMonth();
    let day = date.getDate();
    return  monthArray[month] + " " + day;
}

let windSpeed = (speed) => {
    if (speed<=7) {
        return "Light Breeze"
    } else if(speed<=12 && speed > 7){
        return "Gentle Breeze";
    } else {
        return "Moderate";
    }
}

let windDirection = (degree) =>{
    if (degree == 0 || degree ==360) {
        return "North";
    } else if (degree < 90 && degree > 0) {
        return "North-East"
    } else if (degree == 90) {
        return "East";
    } else if (degree > 90 && degree < 180){
        return "South-East"
    } else if (degree == 180){
        return "South"
    } else if (degree > 180 && degree < 270) {
        return "South-West"
    } else if (degree == 270) {
        return "West"
    } else {
        return "North-West"
    }
}

let sunTime = (time) => {
    let timeFormat = new Date(time *1000);
    let timeHour = "0" + timeFormat.getHours();
    let timeMin  = "0" + timeFormat.getMinutes();
    return timeHour.substr(-2) + ":" + timeMin.substr(-2); 
}

let wrapper = document.getElementById("wrapper");

function currentWeatherDisplay(data) {

    const {main,name,sys,weather,dt,wind,coord} = data;

    let icon = `http://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
    let time = new Date(dt * 1000);
    let hours = "0" + time.getHours();
    let minutes = "0" + time.getMinutes();

    const block = document.createElement("div");
    block.classList.add("current_block");
    const markup = `
        <div class="current_block__city">
            <h2>Weather in <span class="city" data-name="${name}_${sys["country"]}">${name}, 
            ${sys["country"]}</span>
        </div>
        <div class="current_block__icon_temperature">
            <img  class="icon" src="${icon}" alt="${weather[0]["description"]}">
            <span  class="temperature">${Math.round(main.temp)}°C</span>
        </div>
        <div class="current_block__weather_date">
            <p class="weather_condition">${weather[0]["main"].charAt(0).toUpperCase() + weather[0]["main"].slice(1)}</p>
            <span class="date">${hours.substr(-2)}:${minutes.substr(-2)} ${getMonthDay(dt)}</span>
            <span><a href="">Wrong data?</a></span>
        </div>
        <table class="current_block__info">
            <tr>
                <td>Wind</td>
                <td class="wind">${windSpeed(wind["speed"])}, ${wind["speed"]} m/s,
                 ${windDirection(wind["deg"])} (${wind["deg"]})</td>
            </tr>
            <tr>
                <td class="cloud">Cloudiness</td>
                <td>${weather[0]["description"].charAt(0).toUpperCase() + weather[0]["description"].slice(1)}</td>
            </tr>
            <tr>
                <td class="pressure">Pressure</td>
                <td>${main["pressure"]} hpa</td>
            </tr>
            <tr>
                <td class="humidity">Humidity</td>
                <td>${main["humidity"]} %</td>
            </tr>
            <tr>
                <td class="sunrise">Sunrise</td>
                <td>${sunTime(sys["sunrise"])}</td>
            </tr>
            <tr>
                <td class="sunset">Sunset</td>
                <td>${sunTime(sys["sunset"])}</td>
            </tr>
            <tr>
                <td class="geo">Geo cords</td>
                <td>
            <a target="_blank" href="https://www.google.com/maps/@${coord["lat"]},${coord["lon"]},13z?hl=ru">
                [${[coord["lon"],coord["lat"]]}]</a></td>
            </tr>
        </table>
        `
    block.innerHTML = markup;
    wrapper.appendChild(block);
}

function forecastDisplay(data){

    const {city,list} = data;
    
    const heading = document.createElement("h2");
    heading.classList.add("heading");
    const headingMark = `Hourly weather and forecast in ${city["name"]},${city["country"]}`;
    heading.innerHTML = headingMark;
    wrapper.appendChild(heading);

    let dayOne;
    let dayTwo;
    let dayThree;
    let dayFour;
    let dayFive;
    let count = 0;
    let nextDateSwitch = new Date();

    // создаются обьекты с информацией для 5 дней

    while(count<5){
        switch(count){
            case 0:
                dayOne = ( list.filter(data =>((new Date(data.dt_txt).toDateString() === nextDateSwitch.toDateString())?data:"")))
                break;
            case 1:
                dayTwo = ( list.filter(data =>((new Date(data.dt_txt).toDateString() === nextDateSwitch.toDateString())?data:"")))
                break;
            case 2:
                dayThree= ( list.filter(data =>((new Date(data.dt_txt).toDateString() === nextDateSwitch.toDateString())?data:"")))
            break;
            case 3:
                dayFour= ( list.filter(data =>((new Date(data.dt_txt).toDateString() === nextDateSwitch.toDateString())?data:"")))
                break;
            case 4:
                dayFive= ( list.filter(data =>((new Date(data.dt_txt).toDateString() === nextDateSwitch.toDateString())?data:"")))
            break;
            default: 
            return;
        }
        nextDateSwitch.setDate(nextDateSwitch.getDate()+1)
        count++;
    }

    function daysDisplay(dayNum){

        const block = document.createElement("div");
        block.classList.add("days_block");
        if (dayNum === dayOne){
           
        const markupHead =`
            <div class="days_block__header">
                <span class="date">${new Date(dayNum[0]["dt_txt"]).toDateString()} Today</span>
            </div>
            `;
            block.innerHTML = markupHead;
            wrapper.appendChild(block);
        } else {
        const markupHead =`
            <div class="days_block__header">
                <span class="date">${new Date(dayNum[0]["dt_txt"]).toDateString()}</span>
            </div>
            `;
            block.innerHTML = markupHead;
            wrapper.appendChild(block);
        }
    
        for (let i = 0; i<dayNum.length; i++) {
    
            let time = new Date(dayNum[i]["dt_txt"]);
            let hours =  "0" + time.getHours();
            let mins =  "0" +  time.getMinutes();
            let icon = `http://openweathermap.org/img/wn/${dayNum[i]["weather"][0]["icon"]}@2x.png`;

            const blockMain = document.createElement("div");
            blockMain.classList.add("days_block__main");
            const markup =`
                    <div class="time_icon">
                        <span class="time">${hours.substr(-2)}:${mins.substr(-2)}</span>
                        <img class="icon" src="${icon}" alt="${dayNum[i]["weather"][0]["description"]}">
                    </div>
                    <div class="info">
                        <p class="temperature_weather">
                            <span class="temperature">${dayNum[i]["main"]["temp"]}°C</span>
                            <span class="weather">${dayNum[i]["weather"][0]["description"]}</span>
                        </p>
                        <p class="wind_clouds_pressure">
                            <span>${dayNum[i]["wind"]["speed"]}, m/s</span>
                            <span>clouds: <span>${dayNum[i]["clouds"]["all"]}%</span></span>
                            <span>${dayNum[i]["main"]["pressure"]} hpa</span>
                        </p>
                    </div>
                `
            blockMain.innerHTML = markup;
            block.appendChild(blockMain);
        }
    }; 
    daysDisplay(dayOne);
    daysDisplay(dayTwo);
    daysDisplay(dayThree);
    daysDisplay(dayFour);
    ddaysDisplay(dayFive);
}

let form = document.getElementById("form");
let error = document.getElementById("error");

// при потверждении на submit, enter не перезагружается страница
form.addEventListener("submit",e => {
    e.preventDefault();
});

function getLocation() {

    let block = document.getElementById("current_block");

    if (wrapper.contains(block)){
        error.innerHTML = "Weather for your location already displayed."
    } else {
        navigator.geolocation.getCurrentPosition((position)=>{
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }  
            const apiKey = "05f7911bd80b989d6f1878b5b3f72620";
            const urlCurrent = `
            https://api.openweathermap.org/data/2.5/weather?lat=${pos["lat"]}&lon=${pos["lng"]}&appid=${apiKey}&units=metric`;
            const urlDays = `
            https://api.openweathermap.org/data/2.5/forecast?lat=${pos["lat"]}&lon=${pos["lng"]}&appid=${apiKey}&units=metric`;

            (async() => {
                try {
                    const [current, forecast] = await Promise.all([
                        fetch(urlCurrent),
                        fetch(urlDays)
                    ]);
                    const currentResp = await current.json();
                    const forecastResp = await forecast.json();

                    currentWeatherDisplay(currentResp);
                    forecastDisplay(forecastResp);
                } catch(e){
                    console.log("error",e);
                }
            })();
        })
    }
}
