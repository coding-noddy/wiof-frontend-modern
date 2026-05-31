import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Firestore, doc } from '@angular/fire/firestore';
import { getDocFromServer } from 'firebase/firestore';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  private auth = inject(AuthService);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private injector = inject(Injector);

  /**
   * Check if the current user is an admin by checking the `admins` collection
   */
  async isAdmin(uid?: string): Promise<boolean> {
    const effectiveUid = uid || this.auth.getCurrentUserUid();
    console.log(`🔍 Checking admin status for UID: ${effectiveUid}`);

    if (!effectiveUid) {
      console.error('❌ No UID provided or found in auth service');
      return false;
    }

    try {
      const adminDocRef = doc(this.firestore, 'admins', effectiveUid);
      console.log(`📍 Looking for document at: admins/${effectiveUid}`);

      const adminDoc = await runInInjectionContext(this.injector, () => getDocFromServer(adminDocRef));

      if (adminDoc.exists()) {
        console.log('✅ Admin document found:', adminDoc.data());
        return true;
      } else {
        console.warn('⚠️ Admin document does NOT exist for UID:', uid);
        return false;
      }
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
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
