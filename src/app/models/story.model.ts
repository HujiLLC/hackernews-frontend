export interface Story {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  type: string;
  text?: string;
}

export interface PaginatedStories {
  stories: Story[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
