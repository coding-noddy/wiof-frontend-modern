import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminBlogService } from '../../core/services/admin-blog.service';
import { ELEMENTS } from '../../shared/models/firebase.constants';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-blog-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="blog-edit-container">
      <div class="blog-edit-header">
        <h2>{{ isEditMode ? 'Edit Blog Post' : 'Create New Blog Post' }}</h2>
        <a routerLink="/admin/blog" class="back-link">← Back to Blog List</a>
      </div>

      <form [formGroup]="blogForm" (ngSubmit)="onSubmit()" class="blog-form">
        <div class="form-section">
          <div class="form-group">
            <label for="title">Title *</label>
            <input type="text" id="title" formControlName="title" placeholder="Enter blog title" />
            <small *ngIf="blogForm.get('title')?.invalid && blogForm.get('title')?.touched" class="error">Title is required</small>
          </div>

          <div class="form-group">
            <label for="slug">Slug *</label>
            <input type="text" id="slug" formControlName="slug" placeholder="blog-post-slug" />
            <small *ngIf="blogForm.get('slug')?.invalid && blogForm.get('slug')?.touched" class="error">Slug is required</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="element">Element *</label>
              <select id="element" formControlName="element">
                <option value="">Select an element</option>
                <option *ngFor="let elem of elements" [value]="elem">{{ elem | titlecase }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Status *</label>
              <select id="status" formControlName="status">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div class="form-group">
              <label for="featured">
                <input type="checkbox" id="featured" formControlName="featured" />
                Featured Post
              </label>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="excerpt">Excerpt *</label>
            <textarea id="excerpt" formControlName="excerpt" rows="3" placeholder="Brief description of the blog post"></textarea>
            <small *ngIf="blogForm.get('excerpt')?.invalid && blogForm.get('excerpt')?.touched" class="error">Excerpt is required</small>
          </div>

          <div class="form-group">
            <label for="body">Body / Content *</label>
            <textarea id="body" formControlName="body" rows="10" placeholder="Full blog post content (supports HTML)"></textarea>
            <small *ngIf="blogForm.get('body')?.invalid && blogForm.get('body')?.touched" class="error">Content is required</small>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="author">Author *</label>
            <input type="text" id="author" formControlName="author" placeholder="Author name" />
            <small *ngIf="blogForm.get('author')?.invalid && blogForm.get('author')?.touched" class="error">Author is required</small>
          </div>

          <div class="form-group">
            <label for="tags">Tags (comma-separated)</label>
            <input type="text" id="tags" formControlName="tagsString" placeholder="tag1, tag2, tag3" />
          </div>

          <div class="form-group">
            <label for="publishedAt">Published Date *</label>
            <input type="datetime-local" id="publishedAt" formControlName="publishedAt" />
            <small *ngIf="blogForm.get('publishedAt')?.invalid && blogForm.get('publishedAt')?.touched" class="error">Published date is required</small>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="heroImage">Hero Image</label>
            <input type="file" id="heroImage" accept="image/*" (change)="onImageSelect($event)" />
            <small>Supported formats: JPG, PNG, GIF (max 5MB)</small>
            <div *ngIf="selectedImage" class="image-preview">
              <img [src]="imagePreviewUrl" alt="Preview" />
              <button type="button" (click)="clearImage()" class="clear-image-btn">× Clear</button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="isSubmitting || !blogForm.valid" class="submit-btn">
            {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Blog' : 'Create Blog') }}
          </button>
          <a routerLink="/admin/blog" class="cancel-btn">Cancel</a>
        </div>

        <div *ngIf="error" class="error-message">{{ error }}</div>
        <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
      </form>
    </div>
  `,
  styles: [`
    .blog-edit-container {
      max-width: 900px;
    }

    .blog-edit-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h2 {
      margin: 0;
      color: #2c3e50;
    }

    .back-link {
      color: #3498db;
      text-decoration: none;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .blog-form {
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 2rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .form-section:last-of-type {
      border-bottom: none;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
    }

    input[type="text"],
    input[type="email"],
    input[type="datetime-local"],
    input[type="file"],
    select,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }

    textarea {
      resize: vertical;
      font-family: monospace;
    }

    input[type="checkbox"] {
      margin-right: 0.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1.5rem;
    }

    small {
      display: block;
      margin-top: 0.25rem;
      color: #7f8c8d;
      font-size: 0.85rem;
    }

    .error {
      color: #e74c3c;
    }

    .image-preview {
      margin-top: 1rem;
      position: relative;
      display: inline-block;
    }

    .image-preview img {
      max-width: 200px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .clear-image-btn {
      position: absolute;
      top: -10px;
      right: -10px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .submit-btn, .cancel-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s;
    }

    .submit-btn {
      background-color: #27ae60;
      color: white;
    }

    .submit-btn:hover:not(:disabled) {
      background-color: #229954;
    }

    .submit-btn:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .cancel-btn {
      background-color: #95a5a6;
      color: white;
    }

    .cancel-btn:hover {
      background-color: #7f8c8d;
    }

    .error-message, .success-message {
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 4px;
    }

    .error-message {
      background-color: #fadbd8;
      border: 1px solid #f5b7b1;
      color: #c0392b;
    }

    .success-message {
      background-color: #d5f4e6;
      border: 1px solid #a9dfbf;
      color: #27ae60;
    }
  `]
})
export class AdminBlogEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminBlogService = inject(AdminBlogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  blogForm!: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  error: string | null = null;
  successMessage: string | null = null;

  selectedImage: File | null = null;
  imagePreviewUrl: string | null = null;

  elements = ELEMENTS;
  private blogId: string | null = null;

  ngOnInit() {
    this.initializeForm();
    this.checkIfEditMode();
  }

  private initializeForm() {
    const now = new Date().toISOString().slice(0, 16);
    this.blogForm = this.fb.group({
      title: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      excerpt: ['', [Validators.required]],
      body: ['', [Validators.required]],
      author: ['', [Validators.required]],
      tagsString: [''],
      publishedAt: [now, [Validators.required]],
      element: ['', [Validators.required]],
      status: ['draft'],
      featured: [false]
    });
  }

  private checkIfEditMode() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'create') {
        this.isEditMode = true;
        this.blogId = id;
        this.loadBlogData(id);
      }
    });
  }

  private async loadBlogData(blogId: string) {
    try {
      const blog = await this.adminBlogService.getBlogPostById(blogId);
      if (blog) {
        const publishedAtDate = new Date(blog.publishedAt.toDate()).toISOString().slice(0, 16);
        this.blogForm.patchValue({
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt,
          body: blog.body,
          author: blog.author,
          tagsString: blog.tags?.join(', ') || '',
          publishedAt: publishedAtDate,
          element: blog.element,
          status: blog.status,
          featured: blog.featured
        });
      }
    } catch (error) {
      this.error = 'Failed to load blog post';
      console.error('Load error:', error);
    }
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image file is too large. Maximum size is 5MB.';
        return;
      }

      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.selectedImage = null;
    this.imagePreviewUrl = null;
  }

  async onSubmit() {
    if (!this.blogForm.valid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.successMessage = null;

    try {
      const formValue = this.blogForm.value;
      const blogData = {
        title: formValue.title,
        slug: formValue.slug,
        excerpt: formValue.excerpt,
        body: formValue.body,
        author: formValue.author,
        tags: formValue.tagsString ? formValue.tagsString.split(',').map((t: string) => t.trim()) : [],
        publishedAt: Timestamp.fromDate(new Date(formValue.publishedAt)),
        element: formValue.element,
        status: formValue.status,
        featured: formValue.featured
      };

      if (this.isEditMode && this.blogId) {
        await this.adminBlogService.updateBlogPost(this.blogId, blogData, this.selectedImage || undefined);
        this.successMessage = 'Blog post updated successfully!';
      } else {
        const newId = await this.adminBlogService.createBlogPost(blogData, this.selectedImage || undefined);
        this.successMessage = `Blog post created successfully! (ID: ${newId})`;
      }

      setTimeout(() => {
        this.router.navigate(['/admin/blog']);
      }, 1500);
    } catch (error: any) {
      this.error = error?.message || 'Failed to save blog post. Please try again.';
      console.error('Submit error:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
