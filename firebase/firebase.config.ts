/**
 * Firebase configuration for different environments
 */

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

/**
 * Staging environment configuration
 */
/**
 * NOTE: This file intentionally contains ONLY the staging Firebase configuration.
 * Production configuration has been removed from the repository to prevent
 * accidental production deployments. To deploy to production, inject production
 * credentials from a secure secret manager in CI and do NOT commit them to the repo.
 */
export const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCOobQBJglpbTsngWfJg2vktAKLrzH__MA",
  authDomain: "wiof-modern-staging.firebaseapp.com",
  databaseURL: "https://wiof-modern-staging.firebaseio.com",
  projectId: "wiof-modern-staging",
  storageBucket: "wiof-modern-staging.firebasestorage.app",
  messagingSenderId: "725094157992",
  appId: "1:725094157992:web:914d93b2b590c4f4c6bc9d",
  measurementId: "G-15RSEBTQ3P"
};

/**
 * Collection names constants to prevent typos and enable easy renaming
 */
export const COLLECTIONS = {
  NEWS: 'news',
  BLOGS: 'blogs',
  VIDEOS: 'videos',
  FOCUS: 'focus',
  QUIZZES: 'quizzes',
  ACTIONS: 'actions',
  CALENDAR: 'calendar',
  USERS: 'users'
} as const;

/**
 * Storage bucket paths constants
 */
export const STORAGE_PATHS = {
  NEWS_IMAGES: 'news-images',
  BLOG_IMAGES: 'blog-images',
  VIDEO_THUMBNAILS: 'video-thumbnails',
  FOCUS_IMAGES: 'focus-images',
  USER_AVATARS: 'user-avatars'
} as const;

/**
 * Element types used across collections
 */
export const ELEMENTS = ['earth', 'water', 'fire', 'air', 'space'] as const;

/**
 * Helper type for element strings
 */
export type ElementType = typeof ELEMENTS[number];
