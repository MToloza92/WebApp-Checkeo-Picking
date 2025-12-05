import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    RouterModule
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .content {
      padding: 24px;
    }
  `]
})
export class AppComponent {}
