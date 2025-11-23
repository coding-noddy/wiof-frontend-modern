# Admin Panel Troubleshooting Guide

## Issue: Redirecting back to home page

### Root Causes & Solutions

#### Cause 1: Not Signed In
**Symptoms**: Navigating to `/admin` immediately sends you to home

**Fix**: You should first be redirected to `/admin/signin`
- If this isn't happening, check browser console for JavaScript errors
- Verify `enableAdmin: true` in `src/environments/environment.ts`
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

#### Cause 2: Not in `admins` Collection
**Symptoms**: Signed in successfully, but still getting redirected to home

**Root Cause**: Your Firebase user is not authorized in Firestore

**Solution**: Add your Firebase User UID to the `admins` collection:

1. **Find your User UID**:
   - Open [Firebase Console](https://console.firebase.google.com/)
   - Select `wiof-modern-staging` project
   - Go to **Authentication** → **Users**
   - Find your user (the one created earlier)
   - Click on it and copy the **User UID**

2. **Create admin record in Firestore**:
   - In Firebase Console, go to **Firestore Database** → **Data**
   - If `admins` collection doesn't exist, click **Start collection**
   - Collection ID: `admins`
   - First document:
     - **Document ID**: Paste your User UID exactly (this is CRITICAL)
     - Fields to add:
       - `email` (string): your email
       - `name` (string): your display name
       - `addedAt` (timestamp): today
       - `role` (string): `admin`
   - Click **Save**

3. **Test again**:
   - Sign out from Firebase Console
   - Go back to `http://localhost:4200/admin`
   - You should be redirected to `/admin/signin`
   - Sign in again
   - You should now see the admin dashboard!

---

#### Cause 3: Browser Cache
**Symptoms**: Made changes but still seeing old behavior

**Solution**:
```bash
# Full browser cache clear
Ctrl+Shift+Delete  # Windows
Cmd+Shift+Delete   # Mac

# Or restart dev server
npm start
```

---

### Debugging Steps

#### Step 1: Check Browser Console
1. Open browser DevTools: `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Look for any red error messages
4. Report any errors you see

#### Step 2: Check if Admin Routes are Loaded
1. In Console, type: `localStorage.clear()` and press Enter
2. Refresh the page: `F5`
3. Try to navigate to `/admin` again
4. Check Console for messages like:
   - "User not authenticated, redirecting to admin signin" ← Good, go to signin page
   - "User is not an admin, access denied" ← Go create admin record in Firestore
   - Any other errors ← Report them

#### Step 3: Verify Firestore Permissions
1. Go to Firebase Console → `wiof-modern-staging`
2. **Firestore Database** → **Rules**
3. Check that rules are deployed correctly (should see the admin check)

#### Step 4: Check User Authentication
After you sign in:
1. Open DevTools Console
2. Type: `firebase.auth().currentUser`
3. You should see your user object with `uid`, `email`, etc.
4. Copy the `uid` value
5. Verify this exact UID exists as a document in Firestore `/admins/{uid}`

---

### Quick Checklist

- [ ] `enableAdmin: true` in `src/environments/environment.ts`
- [ ] Navigating to `/admin` redirects to `/admin/signin` (not home)
- [ ] Can sign in with Google without errors
- [ ] Your User UID is added to `/admins` collection in Firestore
- [ ] Document ID in `/admins` matches your exact Firebase User UID
- [ ] After signing in, you see the Blog Management dashboard

---

### Still Not Working?

Please share:
1. **Browser Console errors** (screenshot or paste)
2. **Your Firebase User UID** (from Authentication tab)
3. **Firestore `/admins` collection** (screenshot showing the document)
4. **Steps you followed** to set up

---

### Expected User Flow

```
1. Navigate to http://localhost:4200/admin
   ↓ (If not authenticated)
2. Redirected to http://localhost:4200/admin/signin
   ↓
3. Click "Sign in with Google"
   ↓
4. Google OAuth popup opens
   ↓
5. Complete sign-in
   ↓ (If user is in /admins collection)
6. Redirected to http://localhost:4200/admin/blog
   ↓
7. See "Blog Management" dashboard with "Create New Blog" button
   ✅ Success!
```

If you get stuck at any step, let me know which step!
