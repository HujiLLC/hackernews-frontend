import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { StoryService } from '../../services/story.service';
import { Story, PaginatedStories } from '../../models/story.model';
import { SearchParams } from '../../models/search-params.model';
import { StoryItemComponent } from '../story-item/story-item.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    StoryItemComponent, 
    PaginationComponent, 
    LoadingSpinnerComponent
  ],
  template: `
    <div class="story-list-container">
      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="onSearchInput()"
            placeholder="Search stories..." 
            class="search-input"
            [disabled]="loading"
          >
          <button 
            (click)="clearSearch()" 
            *ngIf="searchQuery" 
            class="clear-button"
            type="button"
            [disabled]="loading"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="error-message" *ngIf="error">
        <p>{{ error }}</p>
        <button (click)="retryLoad()" class="retry-button">Retry</button>
      </div>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <div class="stories-section" *ngIf="!loading">
        <div class="stories-header" *ngIf="paginatedStories">
          <h2>
            {{ searchQuery ? 'Search Results' : 'Latest Stories' }}
            <span class="story-count">({{ paginatedStories?.totalCount }} stories)</span>
          </h2>
        </div>

        <div class="stories-list" *ngIf="paginatedStories?.stories?.length; else noStories">
          <app-story-item 
            *ngFor="let story of paginatedStories?.stories; trackBy: trackByStoryId" 
            [story]="story">
          </app-story-item>
        </div>

        <ng-template #noStories>
          <div class="no-stories" *ngIf="!loading">
            <p>{{ searchQuery ? 'No stories found for your search.' : 'No stories available.' }}</p>
          </div>
        </ng-template>

        <app-pagination 
          *ngIf="paginatedStories && (paginatedStories?.totalPages ?? 0) > 1"
          [currentPage]="currentPage"
          [totalPages]="paginatedStories?.totalPages ?? 1"
          [pageSize]="pageSize"
          [totalItems]="paginatedStories?.totalCount ?? 0"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-pagination>
      </div>
    </div>
  `,
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit, OnDestroy {
  paginatedStories: PaginatedStories | null = null;
  searchQuery = '';
  currentPage = 1;
  pageSize = 20;
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(private storyService: StoryService) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      this.performSearch(query);
    });
  }

  ngOnInit(): void {
    this.subscribeToServiceState();
    this.loadStories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToServiceState(): void {
    this.storyService.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.loading = loading;
    });

    this.storyService.error$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(error => {
      this.error = error;
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  private performSearch(query: string): void {
    this.currentPage = 1;
    this.loadStories();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadStories();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStories();
    this.scrollToTop();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadStories();
  }

  retryLoad(): void {
    this.storyService.clearError();
    this.loadStories();
  }

  trackByStoryId(index: number, story: Story): number {
    return story.id;
  }

  private loadStories(): void {
    const searchParams: SearchParams = {
      query: this.searchQuery || undefined,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    const request$ = this.searchQuery 
      ? this.storyService.searchStories(searchParams)
      : this.storyService.getNewestStories(searchParams);

    request$.pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.paginatedStories = data;
      },
      error: (error) => {
        console.error('Error loading stories:', error);
        this.paginatedStories = null;
      }
    });
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
