import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { StoryListComponent } from './story-list.component';
import { StoryService } from '../../services/story.service';
import { PaginatedStories, Story } from '../../models/story.model';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let storyService: jasmine.SpyObj<StoryService>;

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

  beforeEach(async () => {
    const storyServiceSpy = jasmine.createSpyObj('StoryService', [
      'getNewestStories',
      'searchStories',
      'clearError'
    ], {
      loading$: of(false),
      error$: of(null)
    });

    await TestBed.configureTestingModule({
      imports: [StoryListComponent, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: StoryService, useValue: storyServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    storyService = TestBed.inject(StoryService) as jasmine.SpyObj<StoryService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stories on init', () => {
    storyService.getNewestStories.and.returnValue(of(mockPaginatedStories));

    component.ngOnInit();

    expect(storyService.getNewestStories).toHaveBeenCalledWith({
      query: '',
      page: 1,
      pageSize: 20
    });
  });

  it('should handle search input with debouncing', fakeAsync(() => {
    storyService.getNewestStories.and.returnValue(of(mockPaginatedStories));
    storyService.searchStories.and.returnValue(of(mockPaginatedStories));

    component.ngOnInit();
    component.searchQuery = 'angular';
    component.onSearchInput();

    // Should not trigger immediately
    expect(storyService.searchStories).not.toHaveBeenCalled();

    // Should trigger after debounce time
    tick(300);
    expect(storyService.getNewestStories).toHaveBeenCalled();
  }));

  it('should clear search', () => {
    storyService.getNewestStories.and.returnValue(of(mockPaginatedStories));

    component.searchQuery = 'test';
    component.clearSearch();

    expect(component.searchQuery).toBe('');
    expect(component.currentPage).toBe(1);
    expect(storyService.getNewestStories).toHaveBeenCalled();
  });

  it('should handle page change', () => {
    storyService.getNewestStories.and.returnValue(of(mockPaginatedStories));
    spyOn(component, 'scrollToTop');

    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(storyService.getNewestStories).toHaveBeenCalled();
    expect(component.scrollToTop).toHaveBeenCalled();
  });

  it('should handle page size change', () => {
    storyService.getNewestStories.and.returnValue(of(mockPaginatedStories));

    component.onPageSizeChange(50);

    expect(component.pageSize).toBe(50);
    expect(component.currentPage).toBe(1);
    expect(storyService.getNewestStories).toHaveBeenCalled();
  });

  it('should retry loading on error', () => {
    storyService.getNewestStories.and.returnValue(of(mockPaginatedStories));

    component.retryLoad();

    expect(storyService.clearError).toHaveBeenCalled();
    expect(storyService.getNewestStories).toHaveBeenCalled();
  });

  it('should track stories by ID', () => {
    const trackingId = component.trackByStoryId(0, mockStory);
    expect(trackingId).toBe(mockStory.id);
  });

  it('should handle service errors', () => {
    storyService.getNewestStories.and.returnValue(throwError('Service error'));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading stories:', 'Service error');
  });
});
