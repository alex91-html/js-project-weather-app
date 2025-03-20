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

      // Update the UI with the received weather data
      document.getElementById("temperature")!.innerHTML = `${Math.round(weatherData.main.temp)}<span class="degree-symbol">°C</span>`;
      document.getElementById("city")!.textContent = weatherData.name;
      document.getElementById("weather-condition")!.textContent = weatherData.weather[0].description;


      // Display Weather Icon
      const weatherCondition = weatherData.weather[0].main; // Get main weather condition
      const weatherImage = weatherIcons[weatherCondition] || "./assets/Sun.svg"; // Default to Sun.svg

      const weatherImgElement = document.createElement("img"); // Create image element
      weatherImgElement.src = weatherImage;
      weatherImgElement.alt = weatherCondition;
      weatherImgElement.className = "weather-icon"; // Add a class for styling

      const currentWeatherDiv = document.getElementById("current-weather")!;
      currentWeatherDiv.innerHTML = ""; // Clear existing content
      currentWeatherDiv.appendChild(weatherImgElement);



      // Update sunrise and sunset times
      document.getElementById("sunrise-time")!.textContent = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      document.getElementById("sunset-time")!.textContent = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

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

    dailyForecast.slice(0, 7).forEach((day: ForecastEntry) => { //gathers data for seven days
      const date: string = new Date(day.dt_txt).toLocaleDateString("en-GB", { weekday: "long" });

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

        // Update the UI with the received weather data
        document.getElementById("temperature")!.innerHTML = `${Math.round(weatherData.main.temp)}<span class="degree-symbol">°C</span>`;
        document.getElementById("city")!.textContent = weatherData.name;
        document.getElementById("weather-condition")!.textContent = weatherData.weather[0].description;

        const weatherCondition = weatherData.weather[0].main;
        const weatherImage = weatherIcons[weatherCondition] || "./assets/Sun.svg";

        const weatherImgElement = document.createElement("img");
        weatherImgElement.src = weatherImage;
        weatherImgElement.alt = weatherCondition;
        weatherImgElement.className = "weather-icon";

        const currentWeatherDiv = document.getElementById("current-weather")!;
        currentWeatherDiv.innerHTML = "";
        currentWeatherDiv.appendChild(weatherImgElement);

        // Update sunrise and sunset times
        document.getElementById("sunrise-time")!.textContent = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        document.getElementById("sunset-time")!.textContent = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        updateForecast(forecastData);
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
