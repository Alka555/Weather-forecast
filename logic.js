const setBgVideo = (main, isDay) => {
    const bgVideo = document.getElementById('bg-video');
    let videoUrl = '';
    console.log("Weather:",main);

    if (main.includes('Clear')) {
        videoUrl = isDay ? './videos/clear_day.mp4' : './videos/clear_night.mp4'; // Replace with your clear weather video URLs
    } else if (main.includes('Clouds')) {
        videoUrl = isDay ? './videos/cloud_day.mp4' : './videos/cloud_night.mp4'; // Replace with your cloudy weather video URLs
    } else if (main.includes('Rain')) {
        videoUrl = isDay ? './videos/rain_day.mp4' : './videos/rain_night.mp4'; // Replace with your rainy weather video URLs
    } else if (main.includes('Snow')) {
        videoUrl = isDay ? './videos/snow_day.mp4' : './videos/snow_night.mp4'; // Replace with your snowy weather video URLs
    } else if (main.includes('Mist')) {
        videoUrl = isDay ? './videos/mist_day.mp4' : './videos/snow_night.mp4';
    }
    else {
        videoUrl = isDay ? 'https://th.bing.com/th/id/OIP.lkbKJeM-2wMsC-crXwdzxgHaEo?pid=ImgDet&w=205&h=128&c=7&dpr=1.5' : 'https://th.bing.com/th/id/OIP.csvL_ES3PV4Zc1DAlmXaPgAAAA?pid=ImgDet&w=198&h=163&c=7&dpr=1.5'; // Replace with your default video URLs
    }

    bgVideo.src = videoUrl;
    bgVideo.style.display = 'block';
    bgd0.style.backgroundColor = 'transparent';
    document.querySelector('.bgd').style.backgroundImage = 'none';
};

const search = async () => {
    
    const val = document.getElementById('val').value;
    console.log(val);



    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${val}&appid=5fe36b192ffd1c36dffb6752bc1722b2`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const weather = await response.json();
        console.log(weather);
        const { name, main: { feels_like, humidity, pressure, temp }, wind: { speed }, sys: { country, sunrise, sunset }, timezone, weather: [details] } = weather;

        // Calculate local time, sunrise, and sunset based on the timezone offset
        const localTime = new Date((new Date().getTime()) + (timezone * 1000) - (new Date().getTimezoneOffset() * -60000));
        const localSunrise = new Date((sunrise * 1000) + (timezone * 1000) - (new Date().getTimezoneOffset() * -60000));
        const localSunset = new Date((sunset * 1000) + (timezone * 1000) - (new Date().getTimezoneOffset() * -60000));

        const isDay = localTime >= localSunrise && localTime < localSunset;
        setBgVideo(details.main, isDay);

        document.getElementById('result').innerHTML = `
            <div class="bgd2 text-light p-3">
                <h3>Current Weather</h3>
                <div class="d-flex justify-content-between"><span>City: ${name}</span><span>Country: ${country}</span></div>
                <span>Time: ${localTime.toLocaleTimeString()}</span><br>
                <span class="fs-1 fw-5">${(temp - 273.15).toFixed(2)} °C</span><br>
                <span>Feels Like: ${(feels_like - 273.15).toFixed(2)} °C</span><br>
                <img src="http://openweathermap.org/img/wn/${details.icon}.png" alt="${details.description}"><br>
                <span>Weather: ${details.main}</span><br>
                <span>Description: ${details.description}</span><br>
                <br>
                <div class="row">
                <div class="col-md-3 text-center"><span>Humidity: ${humidity}%</span></div>
                <div class="col-md-4 text-center"><span>Pressure: ${pressure} hPa</span></div>
                <div class="col-md-5 text-center"><span>Wind Speed: ${speed} m/s</span></div>
                </div>

               
            </div>
        `;
    } catch (error) {
        document.getElementById('result').innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
    }
    document.querySelector('.bgd').style.backgroundImage = 'none';
};

const refreshPage = () => {
    document.getElementById('val').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('bg-video').style.display = 'none';
    document.querySelector('.bgd').style.backgroundImage = "url('https://img.freepik.com/premium-vector/four-clouds-sky-icons_24908-71237.jpg')";
};