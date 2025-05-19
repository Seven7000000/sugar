# Deploying Sugar Spice Lab to GitHub

This guide will help you deploy your Sugar Spice Lab project to GitHub and set up proper authentication.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click on the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "sugar-spice-lab")
4. Add a description (optional)
5. Choose public or private visibility as needed
6. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, follow the instructions provided by GitHub to push your existing code:

```bash
# Initialize Git in your project folder (if not already done)
git init

# Add all files to Git
git add .

# Commit your changes
git commit -m "Initial commit - Sugar Spice Lab"

# Add the GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/sugar-spice-lab.git

# Push your code to GitHub
git push -u origin main
```

## Step 3: Set Up Firebase Authentication

To fix the Firebase authentication issues:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (sugarspicelab-3979c)
3. Navigate to "APIs & Services" > "Enabled APIs & services"
4. Click on "+ ENABLE APIS AND SERVICES" at the top
5. Search for and enable the following APIs:
   - Identity Toolkit API
   - Firebase Installations API
   - Firebase (various APIs may be listed)

Once these APIs are enabled, your Firebase authentication should start working properly.

## Step 4: Configure Environment Variables

For services to work properly, ensure these environment variables are set:

```
# Firebase Configuration
# (Already in your Firebase config file, no need for environment variables)

# Stability AI
STABILITY_API_KEY=your_stability_api_key

# Google Vertex AI
GOOGLE_PROJECT_ID=your_google_project_id
GOOGLE_LOCATION=your_google_location
GOOGLE_CLIENT_EMAIL=your_google_client_email
GOOGLE_PRIVATE_KEY=your_google_private_key

# Database
DATABASE_URL=your_database_connection_string
```

## Step 5: Hosting Options

Consider these hosting options for your Sugar Spice Lab:

1. **Vercel** - Great for React applications with serverless functions
2. **Netlify** - Similar to Vercel with easy GitHub integration
3. **Firebase Hosting** - Since you're already using Firebase Auth
4. **Heroku** - Good for full-stack applications with databases

Each option has specific deployment instructions that can be followed from their respective documentation.

## Using GitHub Pages (Quick Option)

For a simple static version of your site:

1. Go to your GitHub repository settings
2. Scroll down to "GitHub Pages" section
3. Select your branch (main) as source
4. Click Save

Note: For a full-stack application with backend features, GitHub Pages alone won't be sufficient.