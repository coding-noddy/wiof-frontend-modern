import { Observable } from 'rxjs';
import { BlogPost } from '../../../shared/models/blog.model';

export interface IBlogService {
  getBlogPosts(page: number, pageSize: number, element?: string): Observable<{ posts: BlogPost[]; hasMore: boolean }>;
  getBlogPostBySlug(slug: string): Observable<BlogPost>;
  getRecentPosts(limit: number): Observable<BlogPost[]>;
  getRelatedPosts(postId: string, limit: number): Observable<BlogPost[]>;
}
