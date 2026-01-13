const apiKey = "3539de83d76b199b6881cec6e8193f35";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherBox = document.getElementById("weatherBox");
const errorMsg = document.getElementById("errorMsg");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    errorMsg.innerText = "Please enter a city name.";
    weatherBox.style.display = "none";
    return;
  }

  getWeather(city);
});

/* Enter key support */
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;

  errorMsg.innerText = "";
  weatherBox.style.display = "block";
  weatherBox.innerHTML = "<p>Loading weather...</p>";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        weatherBox.style.display = "none";
        errorMsg.innerText = "Location not found. Try nearest town or district.";
        return;
      }

      /* Restore structure */
      weatherBox.innerHTML = `
        <img id="weatherIcon" />
        <h2 id="cityName"></h2>
        <p id="temperature"></p>
        <p id="tempRange"></p>
        <p id="condition"></p>
        <p id="humidity"></p>
        <p id="wind"></p>
        <p id="lastUpdated"></p>
      `;

      document.getElementById("cityName").innerText = data.name;

      document.getElementById("temperature").innerText =
        `🌡 Current: ${data.main.temp} °C`;

      document.getElementById("tempRange").innerText =
        `⬆ High: ${data.main.temp_max} °C | ⬇ Low: ${data.main.temp_min} °C`;

      document.getElementById("condition").innerText =
        `🌤 Condition: ${data.weather[0].main}`;

      document.getElementById("humidity").innerText =
        `💧 Humidity: ${data.main.humidity}%`;

      document.getElementById("wind").innerText =
        `🌬 Wind Speed: ${data.wind.speed} m/s`;

      const iconCode = data.weather[0].icon;
      document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      const now = new Date();
      document.getElementById("lastUpdated").innerText =
        `Last updated: ${now.toLocaleTimeString()}`;

      /* Dynamic background */
      const condition = data.weather[0].main.toLowerCase();

      if (condition.includes("cloud")) {
        document.body.style.background =
          "linear-gradient(to right, #bdc3c7, #2c3e50)";
      } else if (condition.includes("rain")) {
        document.body.style.background =
          "linear-gradient(to right, #4b79a1, #283e51)";
      } else {
        document.body.style.background =
          "linear-gradient(to right, #4facfe, #00f2fe)";
      }
    })
    .catch(() => {
      weatherBox.style.display = "none";
      errorMsg.innerText = "Something went wrong. Please try again.";
    });
}
