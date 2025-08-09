import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Story } from '../../models/story.model';

@Component({
  selector: 'app-story-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="story-item">
      <div class="story-content">
        <h3 class="story-title">
          <a 
            *ngIf="story.url; else noLink" 
            [href]="story.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="story-link"
          >
            {{ story.title }}
            <span class="external-link-icon">🔗</span>
          </a>
          <ng-template #noLink>
            <span class="story-title-text">{{ story.title }}</span>
            <span class="no-link-indicator">(No Link Available)</span>
          </ng-template>
        </h3>
        
        <div class="story-meta">
          <span class="score">
            <span class="score-icon">▲</span>
            {{ story.score }} points
          </span>
          <span class="author">by {{ story.by }}</span>
          <span class="time">{{ getTimeAgo(story.time) }}</span>
          <span *ngIf="story.descendants" class="comments">
            {{ story.descendants }} comments
          </span>
        </div>
        
        <div *ngIf="story.text" class="story-text">
          <p [innerHTML]="getStoryText()"></p>
        </div>
      </div>
    </article>
  `,
  styleUrls: ['./story-item.component.scss']
})
export class StoryItemComponent {
  @Input() story!: Story;

  getTimeAgo(timestamp: number): string {
    const now = Date.now() / 1000;
    const diffInSeconds = now - timestamp;
    
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  }

  getStoryText(): string {
    if (!this.story.text) return '';
    
    // Basic HTML sanitization - remove script tags and other dangerous elements
    return this.story.text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  }
}
