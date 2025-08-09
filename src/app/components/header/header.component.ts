import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1 routerLink="/stories" class="logo-text">
            <span class="logo-icon">📰</span>
            Hacker News
          </h1>
        </div>
        <nav class="navigation">
          <a routerLink="/stories" routerLinkActive="active" class="nav-link">Latest Stories</a>
        </nav>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {}
