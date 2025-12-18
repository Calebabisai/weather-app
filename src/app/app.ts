import { Component, signal } from '@angular/core';
import { Search } from "./components/search/search.component";
import { WeatherDisplay } from "./components/weather-display/weather-display.component";
import { History } from './components/history/history.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Search, WeatherDisplay, History],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app-clima');
  cityForDisplay = signal<string | undefined>(undefined);
}
