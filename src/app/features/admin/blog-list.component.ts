import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminBlogService } from '../../core/services/admin-blog.service';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { COLLECTIONS } from '../../shared/models/firebase.constants';

@Component({
  selector: 'app-admin-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="blog-list-container">
      <div class="blog-list-header">
        <h2>Blog Management</h2>
        <a routerLink="/admin/blog/create" class="create-btn">+ Create New Blog</a>
      </div>

      <div *ngIf="isLoading" class="loading">Loading blog posts...</div>

      <div *ngIf="!isLoading && blogs.length === 0" class="empty-state">
        <p>No blog posts yet.</p>
        <a routerLink="/admin/blog/create" class="link-btn">Create your first blog post</a>
      </div>

      <div *ngIf="!isLoading && blogs.length > 0" class="blogs-table-wrapper">
        <table class="blogs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Element</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let blog of blogs; trackBy: trackByBlogId">
              <td>{{ blog.title }}</td>
              <td><code>{{ blog.slug }}</code></td>
              <td>{{ blog.element }}</td>
              <td>
                <span [class]="'status-badge status-' + blog.status">
                  {{ blog.status }}
                </span>
              </td>
              <td>{{ blog.createdAt | date: 'short' }}</td>
              <td>
                <a [routerLink]="['/admin/blog', blog.id, 'edit']" class="action-btn edit">Edit</a>
                <button (click)="onDelete(blog.id)" class="action-btn delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="error" class="error-message">{{ error }}</div>
    </div>
  `,
  styles: [`
    .blog-list-container {
      padding: 2rem 0;
    }

    .blog-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #2c3e50;
    }

    .create-btn {
      padding: 0.75rem 1.5rem;
      background-color: #27ae60;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .create-btn:hover {
      background-color: #229954;
    }

    .loading, .empty-state, .error-message {
      padding: 2rem;
      text-align: center;
      background-color: white;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .empty-state {
      color: #7f8c8d;
    }

    .empty-state p {
      margin: 0 0 1rem 0;
    }

    .error-message {
      background-color: #fff3cd;
      border-color: #ffc107;
      color: #856404;
    }

    .blogs-table-wrapper {
      background-color: white;
      border-radius: 4px;
      border: 1px solid #ddd;
      overflow-x: auto;
    }

    .blogs-table {
      width: 100%;
      border-collapse: collapse;
    }

    .blogs-table th {
      background-color: #ecf0f1;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #bdc3c7;
    }

    .blogs-table td {
      padding: 1rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .blogs-table tr:hover {
      background-color: #f9f9f9;
    }

    code {
      background-color: #f4f4f4;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.9rem;
      color: #e74c3c;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .status-badge.status-published {
      background-color: #d4edda;
      color: #155724;
    }

    .status-badge.status-draft {
      background-color: #fff3cd;
      color: #856404;
    }

    .action-btn {
      padding: 0.5rem 1rem;
      margin-right: 0.5rem;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 0.85rem;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s;
    }

    .action-btn.edit {
      background-color: #3498db;
      color: white;
    }

    .action-btn.edit:hover {
      background-color: #2980b9;
    }

    .action-btn.delete {
      background-color: #e74c3c;
      color: white;
    }

    .action-btn.delete:hover {
      background-color: #c0392b;
    }
  `]
})
export class AdminBlogListComponent implements OnInit {
  private adminBlogService = inject(AdminBlogService);
  private firestore = inject(Firestore);

  blogs: any[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadBlogs();
  }

  private async loadBlogs() {
    try {
      this.isLoading = true;
      this.error = null;

      // Fetch all blogs from Firestore
      const blogsRef = collection(this.firestore, COLLECTIONS.BLOGS);
      const snapshot = await getDocs(blogsRef);

      // Convert Firestore documents to blog objects with IDs
      this.blogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by createdAt descending (newest first)
      this.blogs.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error: any) {
      this.error = error?.message || 'Failed to load blog posts. Please try again.';
      console.error('Load blogs error:', error);
      this.blogs = [];
    } finally {
      this.isLoading = false;
    }
  }

  async onDelete(blogId: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await this.adminBlogService.deleteBlogPost(blogId);
        this.blogs = this.blogs.filter(b => b.id !== blogId);
      } catch (error) {
        this.error = 'Failed to delete blog post. Please try again.';
        console.error('Delete error:', error);
      }
    }
  }

  trackByBlogId(_index: number, blog: any) {
    return blog.id;
  }
}
