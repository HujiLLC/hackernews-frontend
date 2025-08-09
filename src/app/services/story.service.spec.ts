import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoryService } from './story.service';
import { environment } from '../../environments/environment';
import { PaginatedStories, Story } from '../models/story.model';
import { SearchParams, ApiResponse } from '../models/search-params.model';

describe('StoryService', () => {
  let service: StoryService;
  let httpMock: HttpTestingController;

  const mockStory: Story = {
    id: 1,
    title: 'Test Story',
    url: 'https://example.com',
    score: 100,
    by: 'testuser',
    time: Date.now() / 1000,
    descendants: 50,
    type: 'story'
  };

  const mockPaginatedStories: PaginatedStories = {
    stories: [mockStory],
    totalCount: 1,
    page: 1,
    pageSize: 20,
    totalPages: 1
  };

  const mockApiResponse: ApiResponse<PaginatedStories> = {
    data: mockPaginatedStories,
    success: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StoryService]
    });
    service = TestBed.inject(StoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNewestStories', () => {
    it('should fetch newest stories without search query', () => {
      const searchParams: SearchParams = {
        page: 1,
        pageSize: 20
      };

      service.getNewestStories(searchParams).subscribe(response => {
        expect(response).toEqual(mockPaginatedStories);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/stories/newest?page=1&pageSize=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should fetch newest stories with search query', () => {
      const searchParams: SearchParams = {
        query: 'angular',
        page: 1,
        pageSize: 20
      };

      service.getNewestStories(searchParams).subscribe(response => {
        expect(response).toEqual(mockPaginatedStories);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/stories/newest?page=1&pageSize=20&search=angular`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should handle loading state', () => {
      const searchParams: SearchParams = { page: 1, pageSize: 20 };
      let loadingStates: boolean[] = [];

      service.loading$.subscribe(loading => {
        loadingStates.push(loading);
      });

      service.getNewestStories(searchParams).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/stories/newest?page=1&pageSize=20`);
      req.flush(mockApiResponse);

      expect(loadingStates).toEqual([false, true, false]);
    });

    it('should handle errors', () => {
      const searchParams: SearchParams = { page: 1, pageSize: 20 };
      let errorMessage: string | null = null;

      service.error$.subscribe(error => {
        errorMessage = error;
      });

      service.getNewestStories(searchParams).subscribe({
        error: () => {
          // Expected error
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/stories/newest?page=1&pageSize=20`);
      req.error(new ErrorEvent('Network error'));

      expect(errorMessage).toBe('Failed to load stories. Please try again.');
    });
  });

  describe('searchStories', () => {
    it('should search stories with query', () => {
      const searchParams: SearchParams = {
        query: 'angular',
        page: 1,
        pageSize: 20
      };

      service.searchStories(searchParams).subscribe(response => {
        expect(response).toEqual(mockPaginatedStories);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/stories/search?page=1&pageSize=20&query=angular`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should search stories without query', () => {
      const searchParams: SearchParams = {
        page: 1,
        pageSize: 20
      };

      service.searchStories(searchParams).subscribe(response => {
        expect(response).toEqual(mockPaginatedStories);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/stories/search?page=1&pageSize=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      let errorMessage: string | null = 'Some error';

      service.error$.subscribe(error => {
        errorMessage = error;
      });

      service.clearError();

      expect(errorMessage).toBeNull();
    });
  });
});
