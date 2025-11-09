import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { BaseService } from '../base.service';
import { IBlogService } from '../interfaces/blog.service.interface';
import { BlogPost } from '../../../shared/models/blog.model';

// Mock data
const MOCK_AUTHORS = [
  { name: 'Dr. Emma Rivers', avatar: 'https://i.pravatar.cc/150?u=emma', bio: 'Environmental Scientist' },
  { name: 'Alex Forest', avatar: 'https://i.pravatar.cc/150?u=alex', bio: 'Climate Researcher' },
  { name: 'Maria Wind', avatar: 'https://i.pravatar.cc/150?u=maria', bio: 'Sustainability Expert' },
];

const MOCK_BLOGS: BlogPost[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `blog-${i + 1}`,
  title: `Understanding the ${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} Element: A Deep Dive`,
  slug: `understanding-${['earth', 'water', 'fire', 'air', 'space'][i % 5]}-element-${i + 1}`,
  excerpt: 'Discover the profound connections between nature and our daily lives in this comprehensive exploration.',
  content: 'Full article content would go here...',
  heroUrl: `https://picsum.photos/seed/blog${i}/800/400`,
  publishedAt: new Date(2025, 0, i + 1).toISOString(),
  author: MOCK_AUTHORS[i % MOCK_AUTHORS.length],
  tags: ['environment', 'sustainability', ['earth', 'water', 'fire', 'air', 'space'][i % 5]],
  element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as any,
  readTime: 5 + (i % 10)
}));

@Injectable({
  providedIn: 'root'
})
export class FirebaseBlogService extends BaseService implements IBlogService {
  private db = inject(Firestore);

  getBlogPosts(
    page: number,
    pageSize: number,
    element?: string
  ): Observable<{ posts: BlogPost[]; hasMore: boolean }> {
    if (this.isMockBackend) {
      const filteredBlogs = element
        ? MOCK_BLOGS.filter(blog => blog.element === element)
        : MOCK_BLOGS;

      const { items, hasMore } = this.paginateResponse(filteredBlogs, page, pageSize);
      return this.withMockDelay({ posts: items, hasMore });
    }

    const blogCollection = collection(this.db, 'blogs');
    const blogQuery = element
      ? query(
          blogCollection,
          where('element', '==', element),
          orderBy('publishedAt', 'desc'),
          limit(pageSize + 1)
        )
      : query(
          blogCollection,
          orderBy('publishedAt', 'desc'),
          limit(pageSize + 1)
        );

    const query$ = from(getDocs(blogQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BlogPost))
      ),
      map(data => this.convertTimestamps<BlogPost[]>(data)),
      map(items => ({
        posts: items.slice(0, pageSize),
        hasMore: items.length > pageSize
      }))
    );

    return query$;
  }

  getBlogPostBySlug(slug: string): Observable<BlogPost> {
    if (this.isMockBackend) {
      const blog = MOCK_BLOGS.find(b => b.slug === slug);
      if (!blog) {
        return this.handleError(new Error('Blog post not found'));
      }
      return this.withMockDelay(blog);
    }

    const blogCollection = collection(this.db, 'blogs');
    const blogQuery = query(
      blogCollection,
      where('slug', '==', slug),
      limit(1)
    );

    return from(getDocs(blogQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          throw new Error('Blog post not found');
        }
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as BlogPost;
      }),
      map(data => this.convertTimestamps<BlogPost>(data))
    );
  }

  getRecentPosts(limitCount: number): Observable<BlogPost[]> {
    if (this.isMockBackend) {
      const recentPosts = MOCK_BLOGS
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, limitCount);
      return this.withMockDelay(recentPosts);
    }

    const blogCollection = collection(this.db, 'blogs');
    const blogQuery = query(
      blogCollection,
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    return from(getDocs(blogQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BlogPost))
      ),
      map(data => this.convertTimestamps<BlogPost[]>(data))
    );
  }

  getRelatedPosts(postId: string, limitCount: number): Observable<BlogPost[]> {
    if (this.isMockBackend) {
      const currentPost = MOCK_BLOGS.find(b => b.id === postId);
      if (!currentPost) {
        return this.withMockDelay([]);
      }

      const relatedPosts = MOCK_BLOGS
        .filter(b => b.id !== postId && b.element === currentPost.element)
        .slice(0, limitCount);
      return this.withMockDelay(relatedPosts);
    }

    const blogCollection = collection(this.db, 'blogs');
    const blogQuery = query(
      blogCollection,
      where('id', '!=', postId),
      orderBy('id'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    );

    return from(getDocs(blogQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as BlogPost))
      ),
      map(data => this.convertTimestamps<BlogPost[]>(data))
    );
  }
}
