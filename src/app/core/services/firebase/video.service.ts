import { inject, Injectable } from '@angular/core';
import { Firestore, collection, query, where, orderBy, limit, getDocs, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { BaseService } from '../base.service';
import { IVideoService } from '../interfaces/video.service.interface';
import { Video, VideoFilter } from '../../../shared/models/video.model';

// Mock Data
const MOCK_SPEAKERS = [
  { name: 'Dr. Sarah Waters', title: 'Marine Biologist' },
  { name: 'Prof. Alex Storm', title: 'Climate Scientist' },
  { name: 'Maria Earth', title: 'Environmental Activist' },
  { name: 'James Wind', title: 'Renewable Energy Expert' }
];

const MOCK_VIDEOS: Video[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `video-${i + 1}`,
  title: `${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} Element: ${['Conservation', 'Innovation', 'Community Action', 'Education'][i % 4]}`,
  description: `Learn about ${['Earth', 'Water', 'Fire', 'Air', 'Space'][i % 5]} element and its impact on our environment.`,
  thumbnailUrl: `https://picsum.photos/seed/video${i}/800/450`,
  videoUrl: 'https://www.youtube.com/embed/sample',
  duration: `${Math.floor(Math.random() * 10) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  element: ['earth', 'water', 'fire', 'air', 'space'][i % 5] as any,
  views: Math.floor(Math.random() * 10000) + 1000,
  publishedAt: new Date(2025, Math.floor(i / 3), (i % 28) + 1).toISOString(),
  speaker: MOCK_SPEAKERS[i % MOCK_SPEAKERS.length],
  featured: i < 5,
  tags: ['environment', 'sustainability', ['earth', 'water', 'fire', 'air', 'space'][i % 5]]
}));

@Injectable({
  providedIn: 'root'
})
export class FirebaseVideoService extends BaseService implements IVideoService {
  private db = inject(Firestore);

  getVideos(
    page: number,
    pageSize: number,
    filter?: VideoFilter
  ): Observable<{ videos: Video[]; hasMore: boolean }> {
    if (this.isMockBackend) {
      let filteredVideos = [...MOCK_VIDEOS];

      if (filter?.element) {
        filteredVideos = filteredVideos.filter(v => v.element === filter.element);
      }
      if (filter?.featured) {
        filteredVideos = filteredVideos.filter(v => v.featured);
      }

      const { items, hasMore } = this.paginateResponse(filteredVideos, page, pageSize);
      return this.withMockDelay({ videos: items, hasMore });
    }

    const videoCollection = collection(this.db, 'videos');
    let videoQuery = query(videoCollection, orderBy('publishedAt', 'desc'));

    if (filter?.element) {
      videoQuery = query(videoQuery, where('element', '==', filter.element));
    }
    if (filter?.featured) {
      videoQuery = query(videoQuery, where('featured', '==', true));
    }

    videoQuery = query(videoQuery, limit(pageSize + 1));

    return from(getDocs(videoQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Video))
      ),
      map(data => this.convertTimestamps<Video[]>(data)),
      map(items => ({
        videos: items.slice(0, pageSize),
        hasMore: items.length > pageSize
      }))
    );
  }

  getVideoById(id: string): Observable<Video> {
    if (this.isMockBackend) {
      const video = MOCK_VIDEOS.find(v => v.id === id);
      if (!video) {
        return this.handleError(new Error('Video not found'));
      }
      return this.withMockDelay(video);
    }

    const videoCollection = collection(this.db, 'videos');
    const videoQuery = query(videoCollection, where('id', '==', id), limit(1));

    return from(getDocs(videoQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) => {
        if (snapshot.empty) {
          throw new Error('Video not found');
        }
        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        } as Video;
      }),
      map(data => this.convertTimestamps<Video>(data))
    );
  }

  getFeaturedVideos(limitCount: number): Observable<Video[]> {
    if (this.isMockBackend) {
      const featured = MOCK_VIDEOS.filter(v => v.featured).slice(0, limitCount);
      return this.withMockDelay(featured);
    }

    const videoCollection = collection(this.db, 'videos');
    const videoQuery = query(
      videoCollection,
      where('featured', '==', true),
      limit(limitCount)
    );

    return from(getDocs(videoQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Video))
      ),
      map(data => this.convertTimestamps<Video[]>(data))
    );
  }

  getVideosByElement(element: string, limitCount: number): Observable<Video[]> {
    if (this.isMockBackend) {
      const elementVideos = MOCK_VIDEOS
        .filter(v => v.element === element)
        .slice(0, limitCount);
      return this.withMockDelay(elementVideos);
    }

    const videoCollection = collection(this.db, 'videos');
    const videoQuery = query(
      videoCollection,
      where('element', '==', element),
      limit(limitCount)
    );

    return from(getDocs(videoQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Video))
      ),
      map(data => this.convertTimestamps<Video[]>(data))
    );
  }

  getRelatedVideos(videoId: string, limitCount: number): Observable<Video[]> {
    if (this.isMockBackend) {
      const currentVideo = MOCK_VIDEOS.find(v => v.id === videoId);
      if (!currentVideo) {
        return this.withMockDelay([]);
      }

      const related = MOCK_VIDEOS
        .filter(v => v.id !== videoId && v.element === currentVideo.element)
        .slice(0, limitCount);
      return this.withMockDelay(related);
    }

    const videoCollection = collection(this.db, 'videos');
    const videoQuery = query(
      videoCollection,
      where('id', '!=', videoId),
      limit(limitCount)
    );

    return from(getDocs(videoQuery)).pipe(
      map((snapshot: QuerySnapshot<DocumentData>) =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Video))
      ),
      map(data => this.convertTimestamps<Video[]>(data))
    );
  }
}