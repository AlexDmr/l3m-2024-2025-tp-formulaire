import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormAdressComponent } from './components/form-adress/form-adress.component';

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet,
    FormAdressComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
