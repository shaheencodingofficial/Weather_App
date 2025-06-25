// script.js
const apiKey = 'f81bfbf9333cfc4b7ebb63d1fafe7a02'; // Get from https://openweathermap.org/api

document.getElementById('search-btn').addEventListener('click', () => {
  const city = document.getElementById('city-input').value;
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL),
    ]);
    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod !== 200) throw new Error(weatherData.message);

    displayWeather(weatherData, forecastData);
  } catch (error) {
    document.getElementById('weather-info').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayWeather(weather, forecast) {
  const weatherInfo = document.getElementById('weather-info');
  const current = `
    <h2>${weather.name}, ${weather.sys.country}</h2>
    <p><strong>Temperature:</strong> ${weather.main.temp} °C</p>
    <p><strong>Condition:</strong> ${weather.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
  `;

  const forecastList = forecast.list.filter((entry) =>
    entry.dt_txt.includes("12:00:00")
  );

  const forecastHTML = `
    <h3>5-Day Forecast</h3>
    <ul>
      ${forecastList
        .map(
          (day) => `
        <li>
          ${new Date(day.dt_txt).toDateString()} - ${day.main.temp} °C, ${day.weather[0].main}
        </li>`
        )
        .join('')}
    </ul>
  `;

  weatherInfo.innerHTML = current + forecastHTML;
}
