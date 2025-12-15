import { Component, inject, signal } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { WeatherData } from '../../models/weather.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [],
  templateUrl: './weather-display.html',
  styleUrl: './weather-display.scss',
})
export class WeatherDisplay {
  private weatherService = inject(WeatherService);
  
  //Signals
  isLoading = signal(false);
  error = signal<string | null>(null);
  weatherData = signal<WeatherData | null>(null);
  city = signal('');


  onCitySearch(citys: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.city.set(citys);
  }
  
} 
