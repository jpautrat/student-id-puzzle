# Deployment Instructions

## GitHub Deployment

1. Create a new repository on GitHub
2. Add the remote repository URL to your local repository:
   ```
   git remote add origin https://github.com/yourusername/student-id-puzzle.git
   ```
3. Push your code to GitHub:
   ```
   git push -u origin master
   ```

## Netlify Deployment

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop the `build` folder from your local project
3. Wait for the deployment to complete
4. (Optional) Set up a custom domain name

Alternatively, you can connect your GitHub repository to Netlify for continuous deployment:

1. Sign up or log in to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your repository
6. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Click "Deploy site"

Your site will be deployed and available at a Netlify subdomain (e.g., https://your-site-name.netlify.app).
