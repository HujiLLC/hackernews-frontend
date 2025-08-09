import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pagination-container">
      <div class="pagination-info">
        <span>
          Showing {{ startItem }}-{{ endItem }} of {{ totalItems }} stories
        </span>
        <div class="page-size-selector">
          <label for="pageSize">Items per page:</label>
          <select 
            id="pageSize" 
            [ngModel]="pageSize" 
            (ngModelChange)="onPageSizeChange($event)"
            class="page-size-select"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      
      <nav class="pagination-nav" *ngIf="totalPages > 1">
        <button 
          (click)="goToPage(1)"
          [disabled]="currentPage === 1"
          class="pagination-button"
          type="button"
        >
          First
        </button>
        
        <button 
          (click)="goToPage(currentPage - 1)"
          [disabled]="currentPage === 1"
          class="pagination-button"
          type="button"
        >
          Previous
        </button>
        
        <div class="page-numbers">
          <button 
            *ngFor="let page of visiblePages" 
            (click)="goToPage(page)"
            [class.active]="page === currentPage"
            class="pagination-button page-number"
            type="button"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          (click)="goToPage(currentPage + 1)"
          [disabled]="currentPage === totalPages"
          class="pagination-button"
          type="button"
        >
          Next
        </button>
        
        <button 
          (click)="goToPage(totalPages)"
          [disabled]="currentPage === totalPages"
          class="pagination-button"
          type="button"
        >
          Last
        </button>
      </nav>
    </div>
  `,
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() pageSize = 20;
  @Input() totalItems = 0;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  
  visiblePages: number[] = [];
  startItem = 0;
  endItem = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateVisiblePages();
    this.calculateItemRange();
  }

  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(newPageSize: string): void {
    const size = parseInt(newPageSize, 10);
    if (size !== this.pageSize) {
      this.pageSizeChange.emit(size);
    }
  }

  private calculateVisiblePages(): void {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    this.visiblePages = pages;
  }

  private calculateItemRange(): void {
    this.startItem = (this.currentPage - 1) * this.pageSize + 1;
    this.endItem = Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}
