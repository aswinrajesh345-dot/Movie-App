# Movie App

A modern, responsive movie search application built with React and Vite. Search for movies using the OMDB API, view detailed information, and manage your favorite films.

## Features

- 🔍 **Search Movies** - Search for movies by title with real-time results
- 📺 **Movie Details** - View comprehensive movie information in an interactive modal
- 🎬 **Pagination** - Browse through search results with easy pagination
- 💾 **Responsive Design** - Fully responsive UI for desktop and mobile devices
- ⚡ **Fast Performance** - Built with Vite for rapid development and optimized builds
- 🎨 **Modern UI** - Clean and intuitive user interface with skeleton loading states

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: CSS
- **API**: OMDB (Open Movie Database)
- **Code Quality**: ESLint

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aswinrajesh345-dot/movie-app.git
cd movie-app
```

2. Install dependencies:
```bash
npm install
```

3. Create an `.env` file in the root directory and add your OMDB API key:
```env
VITE_OMDB_API_KEY=your_api_key_here
```

You can get a free API key from [OMDB API](http://www.omdbapi.com/apikey.aspx)

### Running the App

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── FilterBar.jsx
│   ├── MovieCard.jsx
│   ├── MovieModal.jsx
│   ├── Pagination.jsx
│   ├── SearchBar.jsx
│   └── SkeletonGrid.jsx
├── hooks/              # Custom React hooks
│   └── useDebounce.js
├── api/                # API integration
│   └── omdb.js
├── App.jsx
├── main.jsx
└── index.css
```

## Usage

1. Open the application in your browser
2. Use the search bar to find movies
3. Click on a movie card to view detailed information
4. Use pagination to browse through results
5. Apply filters to narrow down your search

## Components

- **SearchBar** - Input field for movie searches with debouncing
- **FilterBar** - Additional filtering options for search results
- **MovieCard** - Displays individual movie information
- **MovieModal** - Shows detailed movie information in a modal
- **Pagination** - Navigate through paginated results
- **SkeletonGrid** - Loading skeleton UI while fetching data

## Custom Hooks

- **useDebounce** - Debounces search input to optimize API calls

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Movie data provided by [OMDB API](http://www.omdbapi.com/)
- Built as an internship project

## Support

If you encounter any issues or have questions, please feel free to open an issue in the repository.
# Movie-App
