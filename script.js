var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var API_KEY = "f70fe821b1e9718ced63c3a6bf1070e4";
document.addEventListener("DOMContentLoaded", function () {
    var searchInput = document.getElementById("searchCity");
    var searchButton = document.getElementById("searchButton");
    // Mapping OpenWeather conditions to local images
    var weatherIcons = {
        "Clear": "./assets/Sun.svg",
        "Clouds": "./assets/bad_weather.svg",
        "Broken Clouds": "./assets/cloud.svg",
        "Night": "./assets/night.svg",
    };
    var getWeather = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([], args_1, true), void 0, function (city) {
            var currentWeatherURL, forecastURL, weatherResponse, weatherData, forecastResponse, forecastData, error_1;
            if (city === void 0) { city = "Stockholm"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        console.log("Fetching weather data for ".concat(city, "..."));
                        currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=".concat(city, "&units=metric&appid=").concat(API_KEY);
                        forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=".concat(city, "&units=metric&appid=").concat(API_KEY);
                        return [4 /*yield*/, fetch(currentWeatherURL)];
                    case 1:
                        weatherResponse = _a.sent();
                        if (!weatherResponse.ok)
                            throw new Error("Weather data not available (".concat(weatherResponse.status, ")"));
                        return [4 /*yield*/, weatherResponse.json()];
                    case 2:
                        weatherData = _a.sent();
                        return [4 /*yield*/, fetch(forecastURL)];
                    case 3:
                        forecastResponse = _a.sent();
                        if (!forecastResponse.ok)
                            throw new Error("Forecast data not available (".concat(forecastResponse.status, ")"));
                        return [4 /*yield*/, forecastResponse.json()];
                    case 4:
                        forecastData = _a.sent();
                        document.getElementById("temperature").textContent = "".concat(weatherData.main.temp, "\u00B0C");
                        document.getElementById("city").textContent = weatherData.name;
                        document.getElementById("weather-condition").textContent = weatherData.weather[0].description;
                        updateForecast(forecastData);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        console.error("Error fetching weather:", error_1);
                        document.getElementById("city").textContent = "Unable to fetch weather!";
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    var updateForecast = function (forecastData) {
        var forecastDays = document.getElementById("forecast-days");
        var forecastIcons = document.getElementById("forecast-icons");
        var forecastTemps = document.getElementById("forecast-temps");
        forecastDays.innerHTML = "";
        forecastIcons.innerHTML = "";
        forecastTemps.innerHTML = "";
        var dailyForecast = forecastData.list.filter(function (entry) {
            return entry.dt_txt.includes("12:00:00");
        });
        dailyForecast.slice(0, 4).forEach(function (day) {
            var date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "long" });
            var dayElement = document.createElement("div");
            dayElement.className = "day";
            dayElement.textContent = date;
            forecastDays.appendChild(dayElement);
            var iconElement = document.createElement("img");
            iconElement.className = "week-icon";
            iconElement.src = weatherIcons[day.weather[0].main] || "./assets/Sun.svg"; // Default icon
            forecastIcons.appendChild(iconElement);
            var tempElement = document.createElement("div");
            tempElement.className = "temp";
            tempElement.textContent = "".concat(Math.round(day.main.temp_max), "\u00B0C / ").concat(Math.round(day.main.temp_min), "\u00B0C");
            forecastTemps.appendChild(tempElement);
        });
        console.log("Forecast updated successfully.");
    };
    searchButton.addEventListener("click", function () {
        var city = searchInput.value.trim();
        if (city)
            getWeather(city);
    });
    getWeather();
});
