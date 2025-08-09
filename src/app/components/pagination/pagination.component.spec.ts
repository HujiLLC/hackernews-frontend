import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentPage).toBe(1);
    expect(component.totalPages).toBe(1);
    expect(component.pageSize).toBe(20);
    expect(component.totalItems).toBe(0);
  });

  it('should calculate visible pages correctly', () => {
    component.currentPage = 3;
    component.totalPages = 10;
    component.ngOnChanges({});

    expect(component.visiblePages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should calculate visible pages when near the end', () => {
    component.currentPage = 9;
    component.totalPages = 10;
    component.ngOnChanges({});

    expect(component.visiblePages).toEqual([6, 7, 8, 9, 10]);
  });

  it('should calculate item range correctly', () => {
    component.currentPage = 2;
    component.pageSize = 20;
    component.totalItems = 45;
    component.ngOnChanges({});

    expect(component.startItem).toBe(21);
    expect(component.endItem).toBe(40);
  });

  it('should calculate item range for last page', () => {
    component.currentPage = 3;
    component.pageSize = 20;
    component.totalItems = 45;
    component.ngOnChanges({});

    expect(component.startItem).toBe(41);
    expect(component.endItem).toBe(45);
  });
  
  it('should not emit page change for same page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 3;
    
    component.goToPage(3);
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should not emit page change for invalid page', () => {
    spyOn(component.pageChange, 'emit');
    component.totalPages = 5;
    
    component.goToPage(0);
    component.goToPage(6);
    
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit page size change event', () => {
    spyOn(component.pageSizeChange, 'emit');
    
    component.onPageSizeChange('50');
    
    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(50);
  });

  it('should not emit page size change for same size', () => {
    spyOn(component.pageSizeChange, 'emit');
    component.pageSize = 20;
    
    component.onPageSizeChange('20');
    
    expect(component.pageSizeChange.emit).not.toHaveBeenCalled();
  });

  it('should handle single page scenario', () => {
    component.currentPage = 1;
    component.totalPages = 1;
    component.ngOnChanges({});

    expect(component.visiblePages).toEqual([1]);
  });

  it('should handle edge case with no items', () => {
    component.currentPage = 1;
    component.pageSize = 20;
    component.totalItems = 0;
    component.ngOnChanges({});

    expect(component.startItem).toBe(1);
    expect(component.endItem).toBe(0);
  });
});
