# Firestore Collection Schemas

This document outlines the schema structure for all collections in the WIOF Firebase database.

## News Collection (`news`)

```typescript
interface NewsItem {
  id: string;            // Document ID
  title: string;         // Title of the news article
  content: string;       // Full article content in HTML
  summary: string;       // Brief summary for previews
  imageUrl: string;      // URL to the news image
  publishedAt: string;   // ISO date string
  element?: 'earth' | 'water' | 'fire' | 'air' | 'space';  // Optional element category
  isBreaking: boolean;   // Whether this is breaking news
  source?: {            // Optional source attribution
    name: string;       // Name of the source
    url: string;        // URL of the source
  };
}
```

## Blog Collection (`blogs`)

```typescript
interface Blog {
  id: string;            // Document ID
  title: string;         // Blog post title
  content: string;       // Full blog content in HTML
  summary: string;       // Brief summary for previews
  slug: string;          // URL-friendly version of title
  imageUrl: string;      // Featured image URL
  publishedAt: string;   // ISO date string
  element?: string;      // Element category
  author: {
    name: string;        // Author's name
    avatar: string;      // Author's avatar URL
    bio: string;        // Author's bio
  };
  tags: string[];        // Array of related tags
  readTime: number;      // Estimated read time in minutes
}
```

## Videos Collection (`videos`)

```typescript
interface Video {
  id: string;            // Document ID
  title: string;         // Video title
  description: string;   // Video description
  thumbnailUrl: string;  // Thumbnail image URL
  videoUrl: string;      // Video URL (YouTube, etc.)
  publishedAt: string;   // ISO date string
  element?: string;      // Element category
  speaker: {
    name: string;        // Speaker's name
    avatar: string;      // Speaker's avatar URL
    bio: string;        // Speaker's bio
  };
  featured: boolean;     // Whether video is featured
  tags: string[];        // Array of related tags
}
```

## Focus Collection (`focus`)

```typescript
interface FocusItem {
  id: string;            // Document ID
  title: string;         // Focus item title
  description: string;   // Brief description
  content: string;       // Full content in HTML
  imageUrl: string;      // Featured image URL
  publishedAt: string;   // ISO date string
  element?: string;      // Element category
  featured: boolean;     // Whether item is featured
  stats: Array<{
    label: string;       // Statistic label
    value: string;       // Statistic value
  }>;
  actions: string[];     // List of actions taken
}
```

## Quiz Collection (`quizzes`)

```typescript
interface Quiz {
  id: string;            // Document ID
  title: string;         // Quiz title
  description: string;   // Quiz description
  element: string;       // Element category
  questions: Array<{
    id: string;         // Question ID
    question: string;   // Question text
    element: string;    // Element category
    options: string[];  // Answer options
    correctAnswer: number; // Index of correct answer
    explanation?: string; // Explanation of correct answer
  }>;
}
```

## Actions Collection (`actions`)

```typescript
interface ActionItem {
  id: string;            // Document ID
  title: string;         // Action title
  description: string;   // Action description
  element: string;       // Element category
  imageUrl: string;      // Action image URL
  startDate: string;     // ISO date string
  endDate: string;       // ISO date string
  type: string;         // Type of action (challenge, event, etc.)
  progress: {
    participants: number; // Number of participants
    actions: number;     // Number of actions taken
  };
}
```

## Calendar Collection (`calendar`)

```typescript
interface CalendarEvent {
  id: string;            // Document ID
  title: string;         // Event title
  description: string;   // Event description
  startDate: string;     // ISO date string
  endDate: string;       // ISO date string
  imageUrl?: string;     // Optional event image URL
  element?: string;      // Optional element category
  type: 'event' | 'observance' | 'action'; // Type of calendar item
  location?: {
    name: string;        // Location name
    address: string;     // Full address
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}
```

## Users Collection (`users`)

```typescript
interface User {
  id: string;            // Document ID (auth UID)
  email: string;         // User's email
  displayName: string;   // Display name
  photoURL?: string;     // Profile photo URL
  role: 'user' | 'admin'; // User role
  createdAt: string;     // ISO date string
  preferences: {
    elements: string[];  // Preferred elements
    notifications: boolean; // Notification settings
  };
}
```
