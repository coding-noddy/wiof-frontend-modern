import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminGuard } from '../../core/guards/admin.guard';

@Component({
  selector: 'app-admin-signin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="signin-container">
      <div class="signin-card">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Sign in to manage your content</p>

        <button (click)="onSignInWithGoogle()" [disabled]="isSigningIn" class="signin-btn">
          {{ isSigningIn ? 'Signing in...' : '🔐 Sign in with Google' }}
        </button>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>

        <div *ngIf="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <p class="info">
          Only authorized administrators can access this area.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .signin-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .signin-card {
      background: white;
      padding: 3rem 2rem;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      text-align: center;
    }

    h1 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 1.8rem;
    }

    .subtitle {
      color: #7f8c8d;
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    .signin-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-bottom: 1.5rem;
    }

    .signin-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .signin-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-message, .success-message {
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .error-message {
      background-color: #fadbd8;
      color: #c0392b;
    }

    .success-message {
      background-color: #d4edda;
      color: #155724;
    }

    .info {
      color: #95a5a6;
      font-size: 0.85rem;
      margin: 0;
    }
  `]
})
export class AdminSignInComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private adminGuard = inject(AdminGuard);

  isSigningIn = false;
  error: string | null = null;
  successMessage: string | null = null;

  async onSignInWithGoogle() {
    this.isSigningIn = true;
    this.error = null;
    this.successMessage = null;

    try {
      const user = await this.auth.signInWithGoogle();
      console.log('✅ Signed in successfully. User:', user?.email, 'UID:', user?.uid);

      // Check if user is admin
      const isAdmin = await this.adminGuard.isAdmin();

      if (isAdmin) {
        console.log('✅ User is authorized admin. Redirecting to dashboard...');
        this.successMessage = 'Welcome! Redirecting to dashboard...';
        setTimeout(() => {
          this.router.navigate(['/admin/blog']);
        }, 500);
      } else {
        console.error('❌ User is NOT authorized. UID:', user?.uid);
        this.error = `Not authorized. Your UID (${user?.uid}) must be added to the admins collection in Firestore. Contact your administrator.`;
      }
    } catch (error: any) {
      this.error = error?.message || 'Failed to sign in. Please try again.';
      console.error('❌ Sign-in error:', error);
    } finally {
      this.isSigningIn = false;
    }
  }
}

