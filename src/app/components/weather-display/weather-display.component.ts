import { Component, effect, inject, input, signal } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { TitleCasePipe, DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, DatePipe],
  templateUrl: './weather-display.html',
  styleUrl: './weather-display.scss',
})
export class WeatherDisplay {
  private weatherService = inject(WeatherService);

  cityInput = input<string | undefined>();

  //Signals
  isLoading = signal(false);
  error = signal<string | null>(null);
  city = signal('');

  constructor() {
    effect(() => {
      this.city.set(this.cityInput() ?? '');
    })
  }

  weatherData = toSignal(
    toObservable(this.city).pipe(

      tap(() => {
        this.isLoading.set(true);
        this.error.set(null);
      }),

      switchMap(city => {
        if (!city) {
          this.isLoading.set(false);
          return of(null);
        }

        return this.weatherService.getWeather(city);
      }),

      tap(() => this.isLoading.set(false)),

      catchError(err => {
        this.error.set('Error al obtener el clima');
        this.isLoading.set(false);
        return of(null);
      })

    ),
    { initialValue: null }
  );
  
}
