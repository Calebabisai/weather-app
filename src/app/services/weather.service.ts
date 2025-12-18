import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherData, WeatherModel } from '../models/weather.model';
import { map, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  //Inyectamos HttpClient
  private readonly http = inject(HttpClient);
  //API Key y URL
  private readonly apiKey = environment.apiKey;
  //URL base del API
  private readonly apiUrl = environment.apiUrl;
  //Clave para el almacenamiento local
  private readonly history_key = 'weather-history';

  //Obtener datos del clima
  getWeather(city: string): Observable<WeatherData | null> {

    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=es`;

    return this.http.get<WeatherModel>(url).pipe(
      map(response => this.transformWeatherData(response))
    )
  }
  //Transformar datos del API a WeatherData
  private transformWeatherData(response: WeatherModel): WeatherData {
    return {
      city: response.name,
      country: response.sys.country,
      temp: Math.round(response.main.temp),
      feelsLike: Math.round(response.main.feels_like),
      description: response.weather[0].description,
      icon: response.weather[0].icon,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
      timestamp: new Date()
    };
  }

  saveToHistory(weather: WeatherData): void {
    //Obtenemos
    const historyString = localStorage.getItem(this.history_key);
    //Parseamos
    const history: WeatherData[] = historyString ? JSON.parse(historyString) : [];
    //Agregamos al inicio
    history.unshift(weather);
    //Limitamos a 5 elementos
    const limitedHistory = history.slice(0, 5);
    //Guardamos
    localStorage.setItem(this.history_key, JSON.stringify(limitedHistory));
  }

  getHistory(): WeatherData[] { 
    //Obtenemos
    const historyString = localStorage.getItem(this.history_key);

    if (!historyString) {
      return [];
    }
    //Si hay historial
    const history: WeatherData[] = JSON.parse(historyString);
    
    return history.map( item => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }))
    
  }

  clearHistory() : void {
    localStorage.removeItem(this.history_key);
  }
}


