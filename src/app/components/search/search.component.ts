import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  //signals
  city = signal('');
  citySearch = output<string>();

  onSearch() {
    const cityValue = this.city();

    if(cityValue.trim()) {
      this.citySearch.emit(cityValue.trim());
      this.city.set('');
    }
  }
}
