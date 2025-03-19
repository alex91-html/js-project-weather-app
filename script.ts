const API_KEY: string = "f70fe821b1e9718ced63c3a6bf1070e4";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchCity") as HTMLInputElement;
  const searchButton = document.getElementById("searchButton") as HTMLButtonElement;

  // Mapping OpenWeather conditions to local images
  const weatherIcons: { [key: string]: string } = {
    "Clear": "./assets/Sun.svg",
    "Clouds": "./assets/bad_weather.svg",
    "Broken Clouds": "./assets/cloud.svg",
    "Night": "./assets/night.svg",
  };

  // Interface for the current weather data
  interface WeatherData {
    main: {
      temp: number;
    };
    name: string;
    weather: {
      main: string;
      description: string;
    }[];
    sys: {
      sunrise: number;
      sunset: number;
    };
  }

  // Interface for forecast data
  interface ForecastEntry {
    dt_txt: string;
    main: {
      temp_max: number;
      temp_min: number;
    };
    weather: {
      main: string;
    }[];
  }

  interface ForecastData {
    list: ForecastEntry[];
  }

  const getWeather = async (city: string = "Stockholm"): Promise<void> => {
    try {
      console.log(`Fetching weather data for ${city}...`);

      const currentWeatherURL: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      const forecastURL: string = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

      const weatherResponse: Response = await fetch(currentWeatherURL);
      if (!weatherResponse.ok) throw new Error(`Weather data not available (${weatherResponse.status})`);
      const weatherData: WeatherData = await weatherResponse.json();

      const forecastResponse: Response = await fetch(forecastURL);
      if (!forecastResponse.ok) throw new Error(`Forecast data not available (${forecastResponse.status})`);
      const forecastData: ForecastData = await forecastResponse.json();

      document.getElementById("temperature")!.textContent = `${weatherData.main.temp}°C`;
      document.getElementById("city")!.textContent = weatherData.name;
      document.getElementById("weather-condition")!.textContent = weatherData.weather[0].description;

      // Update sunrise and sunset times
      document.getElementById("sunrise-time")!.textContent = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      document.getElementById("sunset-time")!.textContent = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      document.getElementById("sunrise-time")!.textContent = sunrise;
      document.getElementById("sunset-time")!.textContent = sunset;

      updateForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather:", error);
      document.getElementById("city")!.textContent = "Unable to fetch weather!";
    }
  };

  const updateForecast = (forecastData: ForecastData): void => {
    const forecastDays = document.getElementById("forecast-days")!;
    const forecastIcons = document.getElementById("forecast-icons")!;
    const forecastTemps = document.getElementById("forecast-temps")!;

    forecastDays.innerHTML = "";
    forecastIcons.innerHTML = "";
    forecastTemps.innerHTML = "";

    const dailyForecast: ForecastEntry[] = forecastData.list.filter((entry: ForecastEntry) =>
      entry.dt_txt.includes("12:00:00")
    );

    dailyForecast.slice(0, 4).forEach((day: ForecastEntry) => {
      const date: string = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "long" });

      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = date;
      forecastDays.appendChild(dayElement);

      const iconElement = document.createElement("img");
      iconElement.className = "week-icon";
      iconElement.src = weatherIcons[day.weather[0].main] || "./assets/Sun.svg"; // Default icon
      forecastIcons.appendChild(iconElement);

      const tempElement = document.createElement("div");
      tempElement.className = "temp";
      tempElement.textContent = `${Math.round(day.main.temp_max)}°C / ${Math.round(day.main.temp_min)}°C`;
      forecastTemps.appendChild(tempElement);
    });

    console.log("Forecast updated successfully.");
  };

  searchButton.addEventListener("click", () => {
    const city: string = searchInput.value.trim();
    if (city) getWeather(city);
  });

  getWeather();
});
