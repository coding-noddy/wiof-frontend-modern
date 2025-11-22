import { TestBed } from '@angular/core/testing';
import { FirebaseBlogService } from './blog.service';
import { environment } from '../../../../environments/environment';

describe('FirebaseBlogService (mock)', () => {
  let service: FirebaseBlogService;
  const originalMock = environment.mockBackend;

  beforeEach(() => {
    environment.mockBackend = true; // enable mock
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseBlogService);
  });

  afterEach(() => {
    environment.mockBackend = originalMock;
  });

  it('should return paginated mock blog posts', (done) => {
    service.getBlogPosts(1, 5).subscribe(result => {
      expect(result.posts.length).toBeGreaterThan(0);
      expect(typeof result.hasMore).toBe('boolean');
      done();
    }, err => {
      done.fail(err);
    });
  });

  it('should return a post by slug from mocks', (done) => {
    service.getBlogPostBySlug('understanding-earth-element-1').subscribe(post => {
      expect(post).toBeTruthy();
      expect(post.slug).toContain('earth');
      done();
    }, err => done.fail(err));
  });
});
