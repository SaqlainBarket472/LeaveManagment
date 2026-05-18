import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // ✅ ADD THIS

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // ✅ ADD THIS
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Leave Management');
}