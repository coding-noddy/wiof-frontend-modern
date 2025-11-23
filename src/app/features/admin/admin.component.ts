import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <div class="admin-header-content">
          <h1>Admin Dashboard</h1>
          <button (click)="onLogout()" class="logout-btn">Logout</button>
        </div>
      </header>

      <nav class="admin-nav">
        <ul>
          <li><a routerLink="/admin/blog" routerLinkActive="active">Blog Management</a></li>
          <!-- Add more admin sections here as needed -->
        </ul>
      </nav>

      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .admin-header {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .admin-header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .admin-header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;

      &:hover {
        background-color: #c0392b;
      }
    }

    .admin-nav {
      background-color: white;
      border-bottom: 1px solid #ddd;
      padding: 0;
      margin: 0;

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        gap: 2rem;
      }

      li {
        margin: 0;
      }

      a {
        display: block;
        padding: 1rem;
        color: #2c3e50;
        text-decoration: none;
        border-bottom: 3px solid transparent;
        transition: all 0.3s;

        &:hover {
          background-color: #f5f5f5;
        }

        &.active {
          color: #3498db;
          border-bottom-color: #3498db;
        }
      }
    }

    .admin-main {
      flex: 1;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
  `]
})
export class AdminComponent {
  private auth: AuthService = inject(AuthService);

  async onLogout() {
    try {
      await this.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}
