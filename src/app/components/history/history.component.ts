import { Component, effect, inject, signal } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { WeatherData } from '../../models/weather.model';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe, TitleCasePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class History {
  private weatherService = inject(WeatherService);

  //Signal para el historial
  history = signal<WeatherData[]>(this.weatherService.getHistory());

  historyEffect = effect(() => {

    const interval = setInterval(() => {
      this.history.set(this.weatherService.getHistory());
    }, 1000);

    return () => clearInterval(interval);
  })

  clearHistory() {
   this.weatherService.clearHistory();
    this.history.set([]);
  }

} 
