import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/upload" routerLinkActive="active">📦 Cargar Factura</a> |
      <a routerLink="/checklist" routerLinkActive="active">✅ Checklist</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styles: [`
    nav {
      background: #f8f8f8;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      display: flex;
      gap: 1rem;
    }
    a.active {
      font-weight: bold;
      color: #2b7a2b;
    }
  `]
})
export class AppComponent {}
