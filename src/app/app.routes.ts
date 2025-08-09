import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/stories',
    pathMatch: 'full'
  },
  {
    path: 'stories',
    loadComponent: () => import('./components/story-list/story-list.component').then(m => m.StoryListComponent)
  },
  {
    path: '**',
    redirectTo: '/stories'
  }
];
