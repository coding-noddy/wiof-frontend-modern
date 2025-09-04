import { Observable } from 'rxjs';
import { Blog } from '../../../shared/models/blog.model';

export interface IBlogService {
  getBlogPosts(page: number, pageSize: number, element?: string): Observable<{ posts: Blog[]; hasMore: boolean }>;
  getBlogPostBySlug(slug: string): Observable<Blog>;
  getRecentPosts(limit: number): Observable<Blog[]>;
  getRelatedPosts(postId: string, limit: number): Observable<Blog[]>;
}