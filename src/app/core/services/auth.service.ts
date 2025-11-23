import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, user } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();

  /**
   * Signal that tracks the current authenticated user
   */
  currentUser = toSignal(user(this.auth));

  /**
   * Sign in with Google using a popup
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in failed:', error);
      throw error;
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  /**
   * Get the current user's UID
   */
  getCurrentUserUid(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  /**
   * Get the current user's email
   */
  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}
