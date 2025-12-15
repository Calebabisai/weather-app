import { Component, signal } from '@angular/core';
import { Search } from "./components/search/search.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Search],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('app-clima');
}
