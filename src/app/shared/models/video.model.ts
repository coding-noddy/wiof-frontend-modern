export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  element?: 'earth' | 'water' | 'fire' | 'air' | 'space';
  views: number;
  publishedAt: string;
  speaker: {
    name: string;
    title: string;
  };
  featured: boolean;
  tags: string[];
}

export interface VideoFilter {
  element?: string;
  featured?: boolean;
}