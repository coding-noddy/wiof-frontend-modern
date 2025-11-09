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
export const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyBru9kG2e19cnaeRwnGIp0zT9Op1DOcvWM",
  authDomain: "wiof-staging.firebaseapp.com",
  databaseURL: "https://wiof-staging.firebaseio.com",
  projectId: "wiof-staging",
  storageBucket: "wiof-staging.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-ABC123DEF4"
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
