const API_KEY = "f70fe821b1e9718ced63c3a6bf1070e4";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchCity") as HTMLInputElement;
  const searchButton = document.getElementById("searchButton") as HTMLButtonElement;

  const getWeather = async (city: string = "Stockholm"): Promise<void> => {
    try {
      console.log(`Fetching weather data for ${city}...`);

      const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

      const weatherResponse = await fetch(currentWeatherURL);
      if (!weatherResponse.ok) throw new Error(`Weather data not available (${weatherResponse.status})`);
      const weatherData = await weatherResponse.json();

      const forecastResponse = await fetch(forecastURL);
      if (!forecastResponse.ok) throw new Error(`Forecast data not available (${forecastResponse.status})`);
      const forecastData = await forecastResponse.json();

      document.getElementById("temperature")!.textContent = `${weatherData.main.temp}°C`;
      document.getElementById("city")!.textContent = weatherData.name;
      document.getElementById("weather-condition")!.textContent = weatherData.weather[0].description;

      const iconCode = weatherData.weather[0].icon;
      document.getElementById("weather-icon")!.setAttribute("src", `https://openweathermap.org/img/wn/${iconCode}.png`);

      updateForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const updateForecast = (forecastData: any): void => {
    // Implementation here...
  };

  searchButton.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) getWeather(city);
  });

  getWeather();
});
