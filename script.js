"use strict";
const API_KEY = "f70fe821b1e9718ced63c3a6bf1070e4";
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchCity");
    const searchButton = document.getElementById("searchButton");
    // Defining Weather Icons
    const weatherIcons = {
        "Clear": "./assets/Sun.svg",
        "Clouds": "./assets/bad_weather.svg",
        "Broken Clouds": "./assets/cloud.svg",
        "Night": "./assets/night.svg",
    }; //local  asssets
    // Fetching and Displaying Weather Data
    const getWeather = async (city = "Stockholm") => {
        try {
            console.log(`Fetching weather data for ${city}...`);
            // Fetching Current  and forecast Weather Data
            const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
            const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
            const weatherResponse = await fetch(currentWeatherURL);
            if (!weatherResponse.ok)
                throw new Error(`Weather data not available (${weatherResponse.status})`);
            const weatherData = await weatherResponse.json();
            const forecastResponse = await fetch(forecastURL);
            if (!forecastResponse.ok)
                throw new Error(`Forecast data not available (${forecastResponse.status})`);
            const forecastData = await forecastResponse.json();
            // Update the UI with the received weather data
            document.getElementById("temperature").innerHTML = `${Math.round(weatherData.main.temp)}<span class="degree-symbol">°C</span>`;
            document.getElementById("city").textContent = weatherData.name;
            document.getElementById("weather-condition").textContent = weatherData.weather[0].description;
            // Display Weather Icon
            const weatherCondition = weatherData.weather[0].main; // Get main weather condition
            let weatherImage = weatherIcons[weatherCondition] || "./assets/Sun.svg"; // Default to Sun.svg
            const currentTime = new Date().getTime() / 1000; // Convert to seconds
            if (currentTime < weatherData.sys.sunrise || currentTime > weatherData.sys.sunset) {
                weatherImage = weatherIcons["Night"] || weatherImage;
            }
            const weatherImgElement = document.createElement("img"); // Create image element
            weatherImgElement.src = weatherImage;
            weatherImgElement.alt = weatherCondition;
            weatherImgElement.className = "weather-icon"; // Add a class for styling
            const currentWeatherDiv = document.getElementById("current-weather");
            currentWeatherDiv.innerHTML = ""; // Clear existing content
            currentWeatherDiv.appendChild(weatherImgElement);
            const timezoneOffset = weatherData.timezone; // Offset in seconds from UTC
            const sunriseTime = new Date((weatherData.sys.sunrise + timezoneOffset) * 1000);
            const sunsetTime = new Date((weatherData.sys.sunset + timezoneOffset) * 1000);
            document.getElementById("sunrise-time").textContent = sunriseTime.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
            document.getElementById("sunset-time").textContent = sunsetTime.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
            // Update sunrise and sunset times
            updateForecast(forecastData);
        }
        catch (error) {
            console.error("Error fetching weather:", error);
            document.getElementById("city").textContent = "Unable to fetch weather!";
        }
    };
    const updateForecast = (forecastData) => {
        const forecastDays = document.getElementById("forecast-days");
        const forecastIcons = document.getElementById("forecast-icons");
        const forecastTemps = document.getElementById("forecast-temps");
        forecastDays.innerHTML = "";
        forecastIcons.innerHTML = "";
        forecastTemps.innerHTML = "";
        const dailyForecast = forecastData.list.filter((entry) => entry.dt_txt.includes("12:00:00"));
        dailyForecast.slice(0, 7).forEach((day) => {
            const date = new Date(day.dt_txt).toLocaleDateString("en-GB", { weekday: "long" });
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
        const city = searchInput.value.trim();
        if (city)
            getWeather(city);
    });
    getWeather();
    //functions for getting current coordinates and displaying according weather and forecast
    const getWeatherByCoordinates = async () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            document.getElementById("city").textContent = "Geolocation not supported!";
            return;
        }
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                console.log(`Fetching weather for coordinates: ${latitude}, ${longitude}...`);
                const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
                const weatherResponse = await fetch(currentWeatherURL);
                if (!weatherResponse.ok)
                    throw new Error(`Weather data not available (${weatherResponse.status})`);
                const weatherData = await weatherResponse.json();
                const forecastResponse = await fetch(forecastURL);
                if (!forecastResponse.ok)
                    throw new Error(`Forecast data not available (${forecastResponse.status})`);
                const forecastData = await forecastResponse.json();
                // Update the UI with the received weather data
                document.getElementById("temperature").innerHTML = `${Math.round(weatherData.main.temp)}<span class="degree-symbol">°C</span>`;
                //<h1 class="big-temp">${Math.round(weatherData.main.temp)}<sup class="big-temp-degrees">°C</sup></h1>
                document.getElementById("city").textContent = weatherData.name;
                document.getElementById("weather-condition").textContent = weatherData.weather[0].description;
                const weatherCondition = weatherData.weather[0].main;
                const weatherImage = weatherIcons[weatherCondition] || "./assets/Sun.svg";
                const weatherImgElement = document.createElement("img");
                weatherImgElement.src = weatherImage;
                weatherImgElement.alt = weatherCondition;
                weatherImgElement.className = "weather-icon";
                const currentWeatherDiv = document.getElementById("current-weather");
                currentWeatherDiv.innerHTML = "";
                currentWeatherDiv.appendChild(weatherImgElement);
                const timezoneOffset = weatherData.timezone; // Offset in seconds from UTC
                const sunriseTime = new Date((weatherData.sys.sunrise + timezoneOffset) * 1000);
                const sunsetTime = new Date((weatherData.sys.sunset + timezoneOffset) * 1000);
                document.getElementById("sunrise-time").textContent = sunriseTime.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
                document.getElementById("sunset-time").textContent = sunsetTime.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
                // Update sunrise and sunset times
                // Update sunrise and sunset times
                updateForecast(forecastData);
            }
            catch (error) {
                console.error("Error fetching weather:", error);
                document.getElementById("city").textContent = "Unable to fetch weather!";
            }
        }, (error) => {
            console.error("Error getting location:", error);
            document.getElementById("city").textContent = "Location permission denied!";
        });
    };
    const coordinatesButton = document.getElementById("coordinates");
    coordinatesButton.addEventListener("click", getWeatherByCoordinates);
});
