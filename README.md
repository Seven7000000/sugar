# Sugar Spice Lab - Recipe Website

Sugar Spice Lab is a professional recipe website that provides an engaging culinary platform for home cooks, offering advanced recipe management and personalized cooking experiences powered by AI technologies.

## Features

- **Recipe Management**: Browse, search, and save your favorite recipes
- **French Recipes**: Includes classic recipes like Salade Niçoise
- **AI-Generated Images**: High-quality food images generated with Stability AI
- **Authentication**: Flexible authentication with Google or guest access
- **Responsive Design**: Mobile-first design that works on all devices
- **Premium Subscription**: Access to premium recipe features

## Tech Stack

- React frontend with TypeScript
- Express backend
- Firebase authentication (with localStorage fallback)
- PostgreSQL database with Drizzle ORM
- Stability AI for dynamic recipe image generation
- Google Vertex AI integration for intelligent recipe features

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`
5. Open http://localhost:5000 in your browser

## API Keys and Configuration

The application uses several external services that require API keys:

- Firebase (authentication)
- Stability AI (image generation)
- Google Vertex AI (recipe AI features)

These keys should be added to your environment variables.

## License

This project is licensed under the MIT License - see the LICENSE file for details.