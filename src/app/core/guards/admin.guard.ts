import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  private auth = inject(AuthService);
  private firestore = inject(Firestore);
  private router = inject(Router);

  /**
   * Check if the current user is an admin by checking the `admins` collection
   */
  async isAdmin(): Promise<boolean> {
    const uid = this.auth.getCurrentUserUid();
    if (!uid) return false;

    try {
      const adminDocRef = doc(this.firestore, 'admins', uid);
      const adminDoc = await getDoc(adminDocRef);
      return adminDoc.exists();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}

export const adminGuard: CanActivateFn = async (route, state) => {
  const guard = inject(AdminGuard);
  const router = inject(Router);
  const auth = inject(AuthService);

  // Check if user is authenticated
  if (!auth.isAuthenticated()) {
    console.warn('User not authenticated, redirecting to admin signin');
    return router.createUrlTree(['/admin/signin']);
  }

  // Check if user is admin
  const isAdmin = await guard.isAdmin();
  if (!isAdmin) {
    console.warn('User is not an admin, access denied');
    return router.createUrlTree(['/']);
  }

  return true;
};
