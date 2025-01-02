import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number; 
  lon: number;
}
// TODO: Define a class for the Weather object

class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: string;
  windSpeed: string;
  humidity: string;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: string, windSpeed: string, humidity: string) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseUrl: string = process.env.API_BASE_URL || "https://api.openweathermap.org";
  private apiKey: string = process.env.API_KEY || "";
  private cityName: string = "";

  constructor() {
    this.baseUrl = 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {

    const response = await fetch(
      `${this.baseUrl}/geo/1.0/direct?${query}&appid=${this.apiKey}`);
      if (!response.ok) throw new Error(`Failed to fetch location data: ${response.statusText}`);
    
    const data = await response.json();
    if (data.length === 0) {
      throw new Error(`No location found for query: ${query}`);
    }
    return { lat: data[0].lat, lon: data[0].lon };
  }
  
//TODO's simplified in this code to not be redundant and was super confusing!
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  
  // TODO: Create fetchWeatherData method
   private async fetchWeatherData(coordinates: Coordinates) {
    let query = `lat=${coordinates.lat}&lon=${coordinates.lon}`;

    const response = await fetch(
      `${this.baseUrl}/data/2.5/forecast?${query}&units=imperial&appid=${this.apiKey}`);
      if (!response.ok) {
        console.log('Error fetching weather data');
          throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }
    
    const data = await response.json();
    if (data.length === 0) {
      throw new Error(`No weather found for query: ${query}`);
    }

    return data;
  }
  
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {

    if (!response || !response.list || response.list.length ==0) {
      throw new Error("No weather data returned")
    }

    const todaysDate = new Date();
    
    const currentWeather: Weather = {
      city: this.cityName,
      date: todaysDate.toLocaleDateString("en-US"), // MM/DD/YYYY
      icon:response.list[0].weather[0]?.icon || "",
      iconDescription: response.list[0].weather[0]?.description || "",
      tempF:response.list[0].main.temp,
      windSpeed: response.list[0].wind.speed,
      humidity: response.list[0].main.humidity
    }

    return currentWeather;
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastData: Weather[] = [];
    console.log(weatherData);
    forecastData.push(currentWeather);

    //let tomorrowsDate = 
    // put 5 day forecast weather into forecastData
    for (let i=4; i< weatherData.length; i=i+8) {
      let aWeatherData = weatherData[i];

      const [year, month, day] = aWeatherData.dt_txt.split(" ")[0].split("-");
      const dateFormatted = `${month}/${day}/${year}`;

      const futureWeather: Weather = {
        city: this.cityName,
        date: dateFormatted, // MM/DD/YYYY
        icon: aWeatherData.weather[0]?.icon || "",
        iconDescription: aWeatherData.weather[0]?.description || "",
        tempF:aWeatherData.main.temp,
        windSpeed: aWeatherData.wind.speed,
        humidity: aWeatherData.main.humidity
      }

      forecastData.push(futureWeather)
    }
    return forecastData;
  }
  
  // TODO: Complete getWeatherForCity method
   async getWeatherForCity(cityname: string) {
      this.cityName = cityname;
      console.log('Finding weather for city ' + this.cityName);
      let query = `q=${cityname}`;
      let location = await this.fetchLocationData(query);
      console.log(`Coordinates for the city: ${location.lat} ${location.lon}`);
      let weatherData = await this.fetchWeatherData (location);
      let currentWeather = this.parseCurrentWeather(weatherData);
      let forecastData = this.buildForecastArray (currentWeather, weatherData.list);

      return forecastData;
   }

  }
export default new WeatherService();
