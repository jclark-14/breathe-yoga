# Breathe Yoga

A front-end web application designed for yoga enthusiasts to discover and enjoy new yoga videos tailored to their preferences.

## Why I Built This

I created Breathe Yoga to address the common challenge of finding suitable yoga videos that match individual preferences and skill levels. This project combines my passion for web development with my interest in promoting wellness and making yoga more accessible to everyone.

## Live Demo

jclark-14.github.io/breathe-yoga/

## Technologies Used

- Frontend: HTML5, CSS3, TypeScript
- Styling: Tailwind CSS
- APIs: YouTube Data API v3
- Additional Libraries: Font Awesome

## Features

- User-friendly interface for searching yoga videos
- Customizable search options including level, category, length, and focus area
- Integration with YouTube to fetch relevant yoga videos
- Ability to save favorite videos
- Responsive design for both desktop and mobile viewing
- Modal video player for seamless viewing experience

## Preview

![Breathe Yoga Preview](assets/gif7.gif)

## Stretch Features

- User authentication for personalized experiences
- Integration with fitness tracking devices
- Community features for sharing favorite routines
- Offline mode for downloading and storing favorite videos
- AI-powered pose detection and correction using device camera

## Development

### System Requirements

- Node.js (version specified in your project)
- npm (version specified in your project)

### Getting Started

1. Clone the repository.
   ```bash
   git clone https://github.com/yourusername/breathe-yoga
   cd breathe-yoga
   ```

2. Install all dependencies with NPM.
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your YouTube API key:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   ```

4. Start the development server.
   ```bash
   npm run dev
   ```

5. Access the application by navigating to `http://localhost:5173` in your browser (or whichever port your dev server uses).



Note on API Usage
This project uses the YouTube Data API v3. Ensure you have a valid API key and comply with YouTube's terms of service and usage limits.
