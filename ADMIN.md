# Admin Panel Setup Guide

## Overview

This guide explains how to set up the admin panel for managing blog posts and other content in the WIOF Modern application.

## Prerequisites

- Google account (for Firebase authentication)
- Admin access to the Firebase project "wiof-modern-staging"
- Node.js and npm installed locally

## Step 1: Enable Admin Panel

The admin panel is disabled by default. To enable it:

1. Open `src/environments/environment.ts`
2. Set `enableAdmin: true`:

```typescript
export const environment = {
  production: false,
  youtube_api_key: "...",
  aqi_api_key: "...",
  mockBackend: false,
  firebaseConfig: firebaseConfig,
  enableAdmin: true  // ← Change this to true
};
```

3. Save the file and restart the dev server:
```bash
npm start
```

## Step 2: Create Admin User in Firestore

After enabling the admin panel and signing in via Google, you need to create an admin record in Firestore to authorize your account:

### Option A: Manual Creation via Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select the project: `wiof-modern-staging`
3. Navigate to **Firestore Database** → **Data**
4. Click **Start collection**
5. Create a new collection named: **`admins`**
6. For the first document:
   - Set Document ID to your **Firebase Auth UID** (see below for how to find it)
   - Add the following fields:
     - `email` (string): your email address
     - `name` (string): your display name
     - `addedAt` (timestamp): current date/time
     - `role` (string): "admin"

### Finding Your Firebase Auth UID

1. Go to [Firebase Console](https://console.firebase.google.com/) → `wiof-modern-staging` project
2. Navigate to **Authentication** → **Users**
3. Find your user account (signed in via Google)
4. Click on it to see the **User UID**
5. Copy this UID and use it as the Document ID in the `admins` collection

### Option B: Programmatic Creation (Advanced)

If you prefer, you can create the admin doc via a script. Contact the development team for assistance.

## Step 3: Access the Admin Panel

1. Ensure the dev server is running:
```bash
npm start
```

2. Navigate to: `http://localhost:4200/admin`

3. Click **"Sign in with Google"**

4. Complete the Google sign-in flow

5. If your account is authorized in the `admins` collection, you'll be redirected to the admin dashboard

6. Navigate to **Blog Management** to create, edit, or delete blog posts

## Step 4: Creating Blog Posts

1. In the Admin Dashboard, click **Blog Management** → **Create New Blog**
2. Fill in the form fields:
   - **Title**: Blog post title
   - **Slug**: URL-friendly identifier (e.g., `why-water-matters`). Must be unique.
   - **Element**: Select one of: earth, water, fire, air, space
   - **Status**: Draft or Published
   - **Featured**: Check to feature the post on the home page
   - **Excerpt**: Short summary (2-3 sentences)
   - **Body**: Full content (supports HTML)
   - **Author**: Author name
   - **Tags**: Comma-separated keywords
   - **Published Date**: When the post goes live
   - **Hero Image**: Optional featured image (max 5MB)

3. Click **Create Blog** to save

## Step 5: Disabling Admin Panel (Production)

Before deploying to production or when you're done with admin tasks:

1. Open `src/environments/environment.ts` and `src/environments/environment.prod.ts`
2. Set `enableAdmin: false`:

```typescript
enableAdmin: false
```

3. Commit and push the changes
4. The `/admin` route will no longer be accessible

## Security Notes

- **Never commit `enableAdmin: true` to the main branch** — always disable before merging
- Admin access is controlled by the `admins` collection in Firestore
- Only users with a document in `/admins/{uid}` can access the admin panel
- Firestore security rules enforce that only authenticated admins can write to content collections
- Blog image uploads are stored in `gs://wiof-modern-staging.appspot.com/blog-images/`

## Firestore Security Rules

The security rules for the admin panel are defined in `firebase/rules/firestore.rules`. Key rules:

```firestore
function isAdmin() {
  return isAuthenticated() &&
    exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}

match /blogs/{document=**} {
  allow read: if true;  // Public read
  allow write: if isAdmin();  // Admin-only write
}
```

## Troubleshooting

### "Access Denied" after signing in

- **Cause**: Your user account is not in the `admins` collection
- **Solution**: Add your Firebase Auth UID to the `admins` collection (see Step 2)

### "Unable to upload image"

- **Cause**: Image file is too large or network error
- **Solution**: Ensure image is under 5MB and try again

### Admin panel route not found (`/admin` gives 404)

- **Cause**: `enableAdmin` is set to `false` in environment
- **Solution**: Set `enableAdmin: true` in `src/environments/environment.ts` and restart dev server

## Next Steps

- Once you've created sample blog posts, test the blog display on the public site at `/blog`
- Review blog posts by viewing `/blog/:slug` to ensure they display correctly
- Consider adding more admin sections (videos, quizzes, news) following the same pattern

## Support

For issues or questions, reach out to the development team.
