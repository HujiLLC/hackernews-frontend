import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { PaginatedStories } from '../models/story.model';
import { SearchParams, ApiResponse } from '../models/search-params.model';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private readonly apiUrl = environment.apiUrl;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNewestStories(searchParams: SearchParams): Observable<PaginatedStories> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams()
      .set('page', searchParams.page.toString())
      .set('pageSize', searchParams.pageSize.toString());

    if (searchParams.query && searchParams.query.trim()) {
      params = params.set('search', searchParams.query.trim());
    }

    return this.http.get<ApiResponse<PaginatedStories>>(`${this.apiUrl}/stories/newest`, { params })
      .pipe(
        map(response => response.data),
        tap(() => this.loadingSubject.next(false)),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next('Failed to load stories. Please try again.');
          throw error;
        })
      );
  }

  searchStories(searchParams: SearchParams): Observable<PaginatedStories> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    let params = new HttpParams()
      .set('page', searchParams.page.toString())
      .set('pageSize', searchParams.pageSize.toString());

    if (searchParams.query && searchParams.query.trim()) {
      params = params.set('query', searchParams.query.trim());
    }

    return this.http.get<ApiResponse<PaginatedStories>>(`${this.apiUrl}/stories/search`, { params })
      .pipe(
        map(response => response.data),
        tap(() => this.loadingSubject.next(false)),
        catchError(error => {
          this.loadingSubject.next(false);
          this.errorSubject.next('Failed to search stories. Please try again.');
          throw error;
        })
      );
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}
