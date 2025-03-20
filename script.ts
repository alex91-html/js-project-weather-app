const API_KEY: string = "f70fe821b1e9718ced63c3a6bf1070e4";

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchCity") as HTMLInputElement;
  const searchButton = document.getElementById("searchButton") as HTMLButtonElement;

  // Defining Weather Icons
  const weatherIcons: { [key: string]: string } = {
    "Clear": "./assets/Sun.svg",
    "Clouds": "./assets/bad_weather.svg",
    "Broken Clouds": "./assets/cloud.svg",
    "Night": "./assets/night.svg",
  }; //local  asssets

  // Defining Data Interfaces
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
    timezone: number;
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

  const updateWeatherUI = (weatherData: WeatherData, forecastData: ForecastData) => {
    document.getElementById("temperature")!.innerHTML = `${Math.round(weatherData.main.temp)}<span class="degree-symbol">°C</span>`;
    document.getElementById("city")!.textContent = weatherData.name;
    document.getElementById("weather-condition")!.textContent = weatherData.weather[0].description;

    const weatherCondition = weatherData.weather[0].main;
    let weatherImage = weatherIcons[weatherCondition] || "./assets/Sun.svg";

    const currentTime = new Date().getTime() / 1000;
    if (currentTime < weatherData.sys.sunrise || currentTime > weatherData.sys.sunset) {
      weatherImage = weatherIcons["Night"] || weatherImage;
    }

    const weatherImgElement = document.createElement("img");
    weatherImgElement.src = weatherImage;
    weatherImgElement.alt = weatherCondition;
    weatherImgElement.className = "weather-icon";

    const currentWeatherDiv = document.getElementById("current-weather")!;
    currentWeatherDiv.innerHTML = "";
    currentWeatherDiv.appendChild(weatherImgElement);

    const timezoneOffset = weatherData.timezone;
    document.getElementById("sunrise-time")!.textContent = new Date((weatherData.sys.sunrise + timezoneOffset) * 1000)
      .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

    document.getElementById("sunset-time")!.textContent = new Date((weatherData.sys.sunset + timezoneOffset) * 1000)
      .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

    updateForecast(forecastData);
  };

  // Fetching and Displaying Weather Data
  const getWeather = async (city: string = "Stockholm"): Promise<void> => { //all promise types through errors, typescript upset that function doesn't return anything
    try {
      console.log(`Fetching weather data for ${city}...`);

      // Fetching Current  and forecast Weather Data
      const currentWeatherURL: string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      const forecastURL: string = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

      const weatherResponse: Response = await fetch(currentWeatherURL);
      if (!weatherResponse.ok) throw new Error(`Weather data not available (${weatherResponse.status})`);
      const weatherData: WeatherData = await weatherResponse.json();

      const forecastResponse: Response = await fetch(forecastURL);
      if (!forecastResponse.ok) throw new Error(`Forecast data not available (${forecastResponse.status})`);
      const forecastData: ForecastData = await forecastResponse.json();

      updateWeatherUI(weatherData, forecastData);
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

    // Group forecast entries by date
    const dailyForecast: { [date: string]: { high: number, low: number, icon: string } } = {};

    forecastData.list.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0]; // Extract YYYY-MM-DD

      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          high: entry.main.temp_max,
          low: entry.main.temp_min,
          icon: entry.weather[0].main,
        };
      } else {
        dailyForecast[date].high = Math.max(dailyForecast[date].high, entry.main.temp_max);
        dailyForecast[date].low = Math.min(dailyForecast[date].low, entry.main.temp_min);
      }
    });

    // Display forecast for the next 7 days
    Object.entries(dailyForecast).slice(0, 7).forEach(([date, data]) => {
      const dayName = new Date(date).toLocaleDateString("en-GB", { weekday: "long" });

      const dayElement = document.createElement("div");
      dayElement.className = "day";
      dayElement.textContent = dayName;
      forecastDays.appendChild(dayElement);

      const iconElement = document.createElement("img");
      iconElement.className = "week-icon";
      iconElement.src = weatherIcons[data.icon] || "./assets/Sun.svg"; // Default icon
      forecastIcons.appendChild(iconElement);

      const tempElement = document.createElement("div");
      tempElement.className = "temp";
      tempElement.textContent = `${Math.round(data.high)}°C / ${Math.round(data.low)}°C`;
      forecastTemps.appendChild(tempElement);
    });

    console.log("Forecast updated successfully.");
  };

  searchButton.addEventListener("click", () => {
    const city: string = searchInput.value.trim();
    if (city) getWeather(city);
  });

  getWeather();




  //functions for getting current coordinates and displaying according weather and forecast
  const getWeatherByCoordinates = async (): Promise<void> => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      document.getElementById("city")!.textContent = "Geolocation not supported!";
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}...`);

        const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

        const weatherResponse: Response = await fetch(currentWeatherURL);
        if (!weatherResponse.ok) throw new Error(`Weather data not available (${weatherResponse.status})`);
        const weatherData: WeatherData = await weatherResponse.json();

        const forecastResponse: Response = await fetch(forecastURL);
        if (!forecastResponse.ok) throw new Error(`Forecast data not available (${forecastResponse.status})`);
        const forecastData: ForecastData = await forecastResponse.json();

        updateWeatherUI(weatherData, forecastData);

      } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById("city")!.textContent = "Unable to fetch weather!";
      }
    }, (error) => {
      console.error("Error getting location:", error);
      document.getElementById("city")!.textContent = "Location permission denied!";
    });
  };


  const coordinatesButton = document.getElementById("coordinates") as HTMLButtonElement;
  coordinatesButton.addEventListener("click", getWeatherByCoordinates);



});
