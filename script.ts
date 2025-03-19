//oscar was here12131
// hello :D
document.addEventListener("DOMContentLoaded", () => {




  // APIT URL:
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm&units=metric&APPID=f70fe821b1e9718ced63c3a6bf1070e4`;

  async function getWeather(): Promise<void> {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("coudnt fetch weather data");
      }
      //const data: weatherData = await response.json();
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }

  getWeather();


});


/*
async function getData() {
  const url = "https://example.org/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
  */