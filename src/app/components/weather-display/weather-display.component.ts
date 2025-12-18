import { Component, effect, inject, input, signal } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
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

      this.error.set(null);
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

        return this.weatherService.getWeather(city).pipe(
          tap(data => {
            if (data) {
              this.weatherService.saveToHistory(data); //Guardamos en el historial
            }
          }),
          catchError(error => {
            this.error.set('El nombre de la ciudad no existe, por favor intenta de nuevo');
            return of(null);
          }),
          finalize(() => {
            this.isLoading.set(false);
          })
        )
      }),
    ),
    { initialValue: null }
  );
}
