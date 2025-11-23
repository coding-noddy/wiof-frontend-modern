import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where, getDocs, Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { COLLECTIONS, STORAGE_PATHS } from '../../shared/models/firebase.constants';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  publishedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  heroImage?: string;
  tags?: string[];
  element: string;
  featured: boolean;
  status: 'published' | 'draft';
}

@Injectable({
  providedIn: 'root'
})
export class AdminBlogService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  /**
   * Create a new blog post with optional image upload
   */
  async createBlogPost(data: Partial<BlogPost>, imageFile?: File): Promise<string> {
    try {
      let heroImageUrl: string | undefined;

      // Upload image if provided
      if (imageFile) {
        heroImageUrl = await this.uploadBlogImage(imageFile);
      }

      // Validate slug uniqueness
      await this.validateSlugUnique(data.slug!);

      const now = Timestamp.now();
      const blogDoc: BlogPost = {
        slug: data.slug!,
        title: data.title!,
        excerpt: data.excerpt!,
        body: data.body!,
        author: data.author!,
        publishedAt: data.publishedAt || now,
        createdAt: now,
        updatedAt: now,
        heroImage: heroImageUrl,
        tags: data.tags || [],
        element: data.element!,
        featured: data.featured || false,
        status: data.status || 'draft'
      };

      const blogsRef = collection(this.firestore, COLLECTIONS.BLOGS);
      const docRef = await addDoc(blogsRef, blogDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  /**
   * Update an existing blog post
   */
  async updateBlogPost(docId: string, data: Partial<BlogPost>, imageFile?: File): Promise<void> {
    try {
      let heroImageUrl = data.heroImage;

      // Upload new image if provided
      if (imageFile) {
        heroImageUrl = await this.uploadBlogImage(imageFile);
      }

      const updateData: Partial<BlogPost> = {
        ...data,
        updatedAt: Timestamp.now()
      };

      if (heroImageUrl) {
        updateData.heroImage = heroImageUrl;
      }

      const blogRef = doc(this.firestore, COLLECTIONS.BLOGS, docId);
      await updateDoc(blogRef, updateData);
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  /**
   * Delete a blog post
   */
  async deleteBlogPost(docId: string): Promise<void> {
    try {
      const blogRef = doc(this.firestore, COLLECTIONS.BLOGS, docId);
      await deleteDoc(blogRef);
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  /**
   * Get a blog post by ID
   */
  async getBlogPostById(docId: string): Promise<(BlogPost & { id: string }) | null> {
    try {
      const blogRef = doc(this.firestore, COLLECTIONS.BLOGS, docId);
      const snapshot = await getDoc(blogRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() as BlogPost };
      }
      return null;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

  /**
   * Upload an image to Storage
   */
  private async uploadBlogImage(file: File): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(this.storage, `${STORAGE_PATHS.BLOG_IMAGES}/${fileName}`);

      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Validate that a slug is unique
   */
  private async validateSlugUnique(slug: string): Promise<void> {
    try {
      const blogsRef = collection(this.firestore, COLLECTIONS.BLOGS);
      const q = query(blogsRef, where('slug', '==', slug));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        throw new Error(`Slug "${slug}" is already in use. Please choose a different slug.`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('already in use')) {
        throw error;
      }
      console.error('Error validating slug:', error);
      throw error;
    }
  }
}
