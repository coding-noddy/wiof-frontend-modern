import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminGuard } from '../../core/guards/admin.guard';

@Component({
  selector: 'app-admin-signin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="signin-container">
      <div class="signin-card">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Sign in to manage your content</p>

        <button (click)="onSignInWithGoogle()" [disabled]="isSigningIn" class="signin-btn">
          {{ isSigningIn ? 'Signing in...' : '🔐 Sign in with Google' }}
        </button>

        <div class="divider">or</div>

        <form (submit)="onSignInWithEmail($event)" class="email-login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" [(ngModel)]="email" required placeholder="you@example.com" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" [(ngModel)]="password" required placeholder="Password" />
          </div>
          <button type="submit" [disabled]="isSigningIn" class="signin-btn email-signin-btn">
            {{ isSigningIn ? 'Signing in...' : 'Sign in with Email' }}
          </button>
        </form>

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

    .divider {
      text-align: center;
      margin: 1rem 0;
      color: #7f8c8d;
      font-size: 0.95rem;
    }

    .email-login-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      text-align: left;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #2c3e50;
    }

    .form-group input {
      width: 100%;
      padding: 0.85rem;
      border: 1px solid #dfe3ea;
      border-radius: 6px;
      font-size: 0.95rem;
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
  email = '';
  password = '';

  async onSignInWithGoogle() {
    this.isSigningIn = true;
    this.error = null;
    this.successMessage = null;

    try {
      const user = await this.auth.signInWithGoogle();
      await this.handleSignInResult(user);
    } catch (error: any) {
      this.error = error?.message || 'Failed to sign in with Google. Please try again.';
      console.error('❌ Sign-in error:', error);
    } finally {
      this.isSigningIn = false;
    }
  }

  async onSignInWithEmail(event: Event) {
    event.preventDefault();
    this.isSigningIn = true;
    this.error = null;
    this.successMessage = null;

    try {
      const user = await this.auth.signInWithEmailPassword(this.email, this.password);
      await this.handleSignInResult(user);
    } catch (error: any) {
      this.error = error?.message || 'Failed to sign in with email and password. Please try again.';
      console.error('❌ Email sign-in error:', error);
    } finally {
      this.isSigningIn = false;
    }
  }

  private async handleSignInResult(user: any) {
    console.log('✅ Signed in successfully. User:', user?.email, 'UID:', user?.uid);

    let isAdmin = false;
    const uid = user?.uid || null;
    for (let attempt = 0; attempt < 3; attempt++) {
      isAdmin = await this.adminGuard.isAdmin(uid || undefined);
      if (isAdmin) {
        console.log(`✅ Admin status confirmed on attempt ${attempt + 1}`);
        break;
      }
      if (attempt < 2) {
        console.log(`⏳ Admin status not yet visible, retrying in 1s... (attempt ${attempt + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

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
  }
}

