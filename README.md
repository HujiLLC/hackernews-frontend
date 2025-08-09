# Hacker News Frontend

An Angular frontend application that displays the newest stories from Hacker News using a .NET Core backend API.

## Features

- 📰 Display newest stories from Hacker News
- 🔍 Search functionality to find specific stories
- 📄 Pagination for easy navigation
- 📱 Responsive design for mobile and desktop
- 🚀 Modern Angular 17 with standalone components
- ✅ Comprehensive test coverage
- 🎨 Clean, intuitive UI design

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/HujiLLC/hackernews-frontend.git
cd HackerNews-Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API URL in the environment files:
   - `src/environments/environment.ts` (for development)
   - `src/environments/environment.prod.ts` (for production)

## Development

Start the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Testing

Run unit tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Building

Build for development:
```bash
npm run build
```

Build for production:
```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/` directory.

## Architecture

### Components

- **AppComponent**: Root component with header and router outlet
- **HeaderComponent**: Navigation header with branding
- **StoryListComponent**: Main component displaying stories with search and pagination
- **StoryItemComponent**: Individual story display with metadata
- **PaginationComponent**: Reusable pagination controls
- **LoadingSpinnerComponent**: Loading state indicator

### Services

- **StoryService**: Handles API communication with the backend
  - Caches responses
  - Manages loading and error states
  - Provides search functionality

### Models

- **Story**: Interface for Hacker News story data
- **PaginatedStories**: Interface for paginated API responses
- **SearchParams**: Interface for search and pagination parameters

## Key Features Implementation

### Search with Debouncing
The search functionality includes a 300ms debounce to prevent excessive API calls while typing.

### Pagination
- Configurable page sizes (10, 20, 50, 100)
- Smart page number display
- Item count indicators

### Error Handling
- User-friendly error messages
- Retry functionality
- Loading states

### Responsive Design
- Mobile-first approach
- Flexible layouts
- Touch-friendly interactions

## Deployment to Azure

This project is connected to Azure, so if you push or merge a pull request to master branch, it'll be automatically deployed.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
