interface WeatherData {
  cityName: string; // Stadens namn
  temperature: number; // Temperatur i Celsius
  forecast: string; // Väderbeskrivning
  sunrise: string; // Soluppgångstid
  sunset: string; // Solnedgångstid
}


// API URL:
const tsURL: string = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm&units=metric&APPID=f70fe821b1e9718ced63c3a6bf1070e4`;

document.addEventListener("DOMContentLoaded", () => {
  const getWeather = async (): Promise<WeatherData | null> => {
    try {
      const response = await fetch(tsURL);
      if (!response.ok) {
        throw new Error("Couldn't fetch weather data");
      }
      const json = await response.json();
      const weatherData: WeatherData = {
        cityName: json.name,
        temperature: json.main.temp,
        forecast: json.weather[0].description,
        sunrise: new Date(json.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(json.sys.sunset * 1000).toLocaleTimeString(),
      };
      return weatherData;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unknown error occurred");
      }
      return null;
    }
  };

  getWeather();
});





