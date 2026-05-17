import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h1>HR Leave Management</h1>

    <nav>
      <a routerLink="/">Dashboard</a> |
      <a routerLink="/apply">Apply Leave</a> |
      <a routerLink="/approval">Approval</a>
    </nav>

    <hr>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {}