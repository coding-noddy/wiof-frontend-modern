/**
 * Firestore collection names constants
 */
export const COLLECTIONS = {
  NEWS: 'news',
  BLOGS: 'blogs',
  VIDEOS: 'videos',
  FOCUS: 'focus',
  QUIZZES: 'quizzes',
  ACTIONS: 'actions',
  CALENDAR: 'calendar',
  USERS: 'users',
  ADMINS: 'admins'
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
