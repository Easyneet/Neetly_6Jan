# Deployment Guide

This guide explains how to deploy the MCQ Test Management System.

## Option 1: Deploy to Vercel (Recommended)

### Frontend Deployment
1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Navigate to the client directory:
   ```bash
   cd client
   ```
4. Deploy to Vercel:
   ```bash
   vercel
   ```

### Backend Deployment
1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure environment variables in Vercel dashboard
4. Deploy using Vercel CLI:
   ```bash
   vercel
   ```

## Option 2: Deploy to Netlify + Railway

### Frontend Deployment (Netlify)
1. Create a Netlify account at https://netlify.com
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
4. Deploy

### Backend Deployment (Railway)
1. Create a Railway account at https://railway.app
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

## Option 3: Deploy to GitHub Pages + Render

### Frontend Deployment (GitHub Pages)
1. Add GitHub Pages dependency:
   ```bash
   cd client
   npm install gh-pages --save-dev
   ```
2. Deploy:
   ```bash
   npm run deploy
   ```

### Backend Deployment (Render)
1. Create a Render account at https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy

## Getting a Free Domain

1. Visit Freenom (https://www.freenom.com)
2. Choose a free domain (`.tk`, `.ml`, `.ga`, `.cf`, or `.gq`)
3. Register the domain
4. Configure DNS settings to point to your deployed application

## Environment Variables

Make sure to set these environment variables in your deployment platform:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=production
```

## Post-Deployment Steps

1. Set up MongoDB Atlas for database hosting
2. Configure CORS settings in backend
3. Update API endpoints in frontend
4. Test the deployed application
5. Set up SSL certificate (if needed)

## Monitoring and Maintenance

1. Set up logging (e.g., using Winston or Morgan)
2. Configure error tracking (e.g., Sentry)
3. Set up automated backups
4. Monitor application performance
5. Regular security updates

## Troubleshooting

Common issues and solutions:

1. **CORS Errors**
   - Update CORS configuration in backend
   - Check API endpoint URLs in frontend

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings
   - Verify IP whitelist

3. **Build Failures**
   - Check build logs
   - Verify dependencies
   - Check Node.js version

4. **Domain Issues**
   - Verify DNS settings
   - Check SSL certificate
   - Verify domain registration 