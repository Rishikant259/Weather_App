// Weather API object
const weatherApi = {
  key: '4eb3703790b356562054106543b748b2',
  baseUrl: 'https://api.openweathermap.org/data/2.5/weather'
};

// Elements
let searchInputBox = document.getElementById('input-box');
let searchBtn = document.getElementById('search-btn');
let weatherCard = document.querySelector('.weather-card');

// --- Events ---
searchInputBox.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    getWeatherReport(searchInputBox.value.trim());
  }
});
searchBtn.addEventListener('click', () => {
  getWeatherReport(searchInputBox.value.trim());
});

// --- Fetch Weather Report ---
function getWeatherReport(city) {
  if (!city) {
    swal("Empty Input", "Please enter a city name", "error");
    reset();
    return;
  }

  fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then(res => res.json())
    .then(data => showWeatherReport(data))
    .catch(() => {
      swal("Error", "Unable to fetch data. Please try again later.", "error");
    });
}

// --- Show Weather Report ---
function showWeatherReport(weather) {
  if (weather.cod === "404") {
    swal("Not Found", "City not found. Please check spelling!", "warning");
    reset();
    return;
  }

  if (weather.cod !== 200) {
    swal("Error", "Something went wrong!", "error");
    reset();
    return;
  }

  // Update Weather Card
  document.getElementById('city-name').textContent = `${weather.name}, ${weather.sys.country}`;
  document.getElementById('date').textContent = dateManage(new Date());
  document.getElementById('temperature').textContent = `${Math.round(weather.main.temp)}°C`;
  document.getElementById('description').textContent = weather.weather[0].description;
  document.getElementById('humidity').textContent = `${weather.main.humidity}%`;
  document.getElementById('wind').textContent = `${weather.wind.speed} km/h`;
  document.getElementById('weather-icon').src = getWeatherIcon(weather.weather[0].main);

  // Show card with animation
  weatherCard.style.display = 'block';
  weatherCard.classList.add('fade-in');

  // Background change
  changeBg(weather.weather[0].main);

  reset();
}

// --- Get Time ---
function getTime(todayDate) {
  let hour = addZero(todayDate.getHours());
  let minute = addZero(todayDate.getMinutes());
  return `${hour}:${minute}`;
}

// --- Format Date ---
function dateManage(dateArg) {
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let year = dateArg.getFullYear();
  let month = months[dateArg.getMonth()];
  let date = dateArg.getDate();
  let day = days[dateArg.getDay()];

  return `${date} ${month} (${day}), ${year}`;
}

// --- Change Background by Weather ---
function changeBg(status) {
  let backgrounds = {
    Clouds: 'img/clouds.jpg',
    Rain: 'img/rainy.jpg',
    Clear: 'img/clear.jpg',
    Snow: 'img/snow.jpg',
    Sunny: 'img/sunny.jpg',
    Thunderstorm: 'img/thunderstrom.jpg',
    Drizzle: 'img/drizzle.jpg',
    Mist: 'img/mist.jpg',
    Haze: 'img/mist.jpg',
    Fog: 'img/mist.jpg'
  };

  document.body.style.backgroundImage = `url(${backgrounds[status] || 'img/bg.jpg'})`;
}

// --- Get Weather Icon ---
function getWeatherIcon(status) {
  let icons = {
    Rain: 'img/icons/rain.png',
    Clouds: 'img/icons/cloud.png',
    Clear: 'img/icons/sun.png',
    Snow: 'img/icons/snow.png',
    Sunny: 'img/icons/sun.png',
    Mist: 'img/icons/mist.png',
    Thunderstorm: 'img/icons/storm.png',
    Drizzle: 'img/icons/drizzle.png'
  };

  return icons[status] || 'img/icons/default.png';
}

// --- Reset Input ---
function reset() {
  searchInputBox.value = "";
}

// --- Add Zero ---
function addZero(i) {
  return (i < 10 ? "0" : "") + i;
}
