import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoryItemComponent } from './story-item.component';
import { Story } from '../../models/story.model';

describe('StoryItemComponent', () => {
  let component: StoryItemComponent;
  let fixture: ComponentFixture<StoryItemComponent>;

  const mockStoryWithUrl: Story = {
    id: 1,
    title: 'Test Story with URL',
    url: 'https://example.com',
    score: 100,
    by: 'testuser',
    time: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    descendants: 50,
    type: 'story'
  };

  const mockStoryWithoutUrl: Story = {
    id: 2,
    title: 'Test Story without URL',
    score: 75,
    by: 'anotheruser',
    time: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
    descendants: 25,
    type: 'story'
  };

  const mockStoryWithText: Story = {
    id: 3,
    title: 'Story with text content',
    score: 50,
    by: 'contentuser',
    time: Math.floor(Date.now() / 1000) - 300, // 5 minutes ago
    type: 'story',
    text: 'This is some <p>HTML content</p> with <script>alert("malicious")</script> potential XSS'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryItemComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StoryItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.story = mockStoryWithUrl;
    expect(component).toBeTruthy();
  });

  it('should display story with URL correctly', () => {
    component.story = mockStoryWithUrl;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleLink = compiled.querySelector('.story-link');
    const scoreElement = compiled.querySelector('.score');

    expect(titleLink).toBeTruthy();
    expect(titleLink.textContent).toContain('Test Story with URL');
    expect(titleLink.href).toBe('https://example.com/');
    expect(scoreElement.textContent).toContain('100 points');
  });

  it('should display story without URL correctly', () => {
    component.story = mockStoryWithoutUrl;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleText = compiled.querySelector('.story-title-text');
    const noLinkIndicator = compiled.querySelector('.no-link-indicator');

    expect(titleText).toBeTruthy();
    expect(titleText.textContent).toContain('Test Story without URL');
    expect(noLinkIndicator).toBeTruthy();
    expect(noLinkIndicator.textContent).toContain('(No Link Available)');
  });

  it('should display story text with XSS protection', () => {
    component.story = mockStoryWithText;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const storyText = compiled.querySelector('.story-text');

    expect(storyText).toBeTruthy();
    
    const sanitizedText = component.getStoryText();
    expect(sanitizedText).not.toContain('<script>');
    expect(sanitizedText).toContain('<p>HTML content</p>');
  });

  describe('getTimeAgo', () => {
    it('should return "Just now" for very recent stories', () => {
      const recentTime = Math.floor(Date.now() / 1000) - 30; // 30 seconds ago
      const result = component.getTimeAgo(recentTime);
      expect(result).toBe('Just now');
    });

    it('should return minutes for stories less than an hour old', () => {
      const minutesAgo = Math.floor(Date.now() / 1000) - 1800; // 30 minutes ago
      const result = component.getTimeAgo(minutesAgo);
      expect(result).toBe('30 minutes ago');
    });

    it('should return hours for stories less than a day old', () => {
      const hoursAgo = Math.floor(Date.now() / 1000) - 7200; // 2 hours ago
      const result = component.getTimeAgo(hoursAgo);
      expect(result).toBe('2 hours ago');
    });

    it('should return days for older stories', () => {
      const daysAgo = Math.floor(Date.now() / 1000) - 172800; // 2 days ago
      const result = component.getTimeAgo(daysAgo);
      expect(result).toBe('2 days ago');
    });

    it('should handle singular forms correctly', () => {
      const oneMinuteAgo = Math.floor(Date.now() / 1000) - 60; // 1 minute ago
      const oneHourAgo = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const oneDayAgo = Math.floor(Date.now() / 1000) - 86400; // 1 day ago

      expect(component.getTimeAgo(oneMinuteAgo)).toBe('1 minute ago');
      expect(component.getTimeAgo(oneHourAgo)).toBe('1 hour ago');
      expect(component.getTimeAgo(oneDayAgo)).toBe('1 day ago');
    });
  });

  describe('getStoryText', () => {
    it('should return empty string when no text', () => {
      component.story = mockStoryWithUrl;
      const result = component.getStoryText();
      expect(result).toBe('');
    });

    it('should sanitize dangerous HTML elements', () => {
      component.story = mockStoryWithText;
      const result = component.getStoryText();
      
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('<iframe>');
      expect(result).not.toContain('<object>');
      expect(result).not.toContain('<embed>');
    });

    it('should preserve safe HTML elements', () => {
      const storyWithSafeHtml: Story = {
        ...mockStoryWithText,
        text: 'This has <p>paragraphs</p> and <strong>bold text</strong>'
      };
      
      component.story = storyWithSafeHtml;
      const result = component.getStoryText();
      
      expect(result).toContain('<p>paragraphs</p>');
      expect(result).toContain('<strong>bold text</strong>');
    });
  });
});
