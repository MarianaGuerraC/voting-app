import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true, //para q no necesite modulo intermediario
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'voting-frontend';
}