export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  heroUrl?: string;
  publishedAt: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  element?: 'earth' | 'water' | 'fire' | 'air' | 'space';
  readTime: number;
  featured?: boolean;
}

export interface BlogFilter {
  tag?: string;
  element?: string;
  search?: string;
  featured?: boolean;
}
