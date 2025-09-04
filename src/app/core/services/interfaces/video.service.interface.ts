import { Observable } from 'rxjs';
import { Video, VideoFilter } from '../../../shared/models/video.model';

export interface IVideoService {
  getVideos(
    page: number,
    pageSize: number,
    filter?: VideoFilter
  ): Observable<{ videos: Video[]; hasMore: boolean }>;
  
  getVideoById(id: string): Observable<Video>;
  
  getFeaturedVideos(limit: number): Observable<Video[]>;
  
  getVideosByElement(element: string, limit: number): Observable<Video[]>;
  
  getRelatedVideos(videoId: string, limit: number): Observable<Video[]>;
}