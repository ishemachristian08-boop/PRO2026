# Deployment Guide

This guide provides instructions for deploying the NYABIHU CHRISTIAN ACADEMY website to various platforms.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB instance (local or cloud)
- Domain name (optional)

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/nca
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/nca

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=5000000  # 5MB
UPLOAD_PATH=./uploads
```

### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Application
NEXT_PUBLIC_APP_NAME="NYABIHU CHRISTIAN ACADEMY"
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID

# Other Services (optional)
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-pixel-id
NEXT_PUBLIC_HOTJAR_ID=your-hotjar-id
```

## Local Development

### Backend

1. Navigate to the backend directory:
   ```bash
   cd nca-website/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Seed the database (optional):
   ```bash
   npm run seed
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd nca-website/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:3000`

## Production Deployment

### Option 1: Vercel (Recommended for Frontend)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/nca-website.git
   git push -u origin main
   ```

2. **Deploy Frontend to Vercel:**
   - Sign up at [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables in Vercel dashboard
   - Deploy

3. **Deploy Backend to Railway/Render:**
   - Sign up at [railway.app](https://railway.app) or [render.com](https://render.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

### Option 2: Heroku

1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy Backend:**
   ```bash
   # Login to Heroku
   heroku login
   
   # Create app
   heroku create your-app-name
   
   # Add MongoDB addon
   heroku addons:create mongolab:sandbox
   
   # Set environment variables
   heroku config:set JWT_SECRET=your-secret-key
   
   # Deploy
   git push heroku main
   ```

3. **Deploy Frontend:**
   ```bash
   # Create separate Heroku app for frontend
   heroku create your-frontend-app-name --buildpack https://github.com/mars/create-react-app-buildpack.git
   
   # Build and deploy
   npm run build
   git add build
   git commit -m "Add build files"
   git push heroku main
   ```

### Option 3: Docker

1. **Create Dockerfile for Backend:**
   ```dockerfile
   # backend/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Create Dockerfile for Frontend:**
   ```dockerfile
   # frontend/Dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   
   COPY . .
   
   RUN npm run build
   
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

3. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   
   services:
     backend:
       build: ./backend
       ports:
         - "5000:5000"
       environment:
         - MONGODB_URI=mongodb://mongo:27017/nca
         - JWT_SECRET=your-secret-key
       depends_on:
         - mongo
   
     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=http://localhost:5000/api
       depends_on:
         - backend
   
     mongo:
       image: mongo:6
       ports:
         - "27017:27017"
       volumes:
         - mongo-data:/data/db
   
   volumes:
     mongo-data:
   ```

4. **Deploy:**
   ```bash
   docker-compose up -d
   ```

## Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Cluster:**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Set up database user and network access

2. **Get Connection String:**
   - Copy the connection string from Atlas dashboard
   - Update `MONGODB_URI` in your environment variables

### Local MongoDB

1. **Install MongoDB:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS
   brew install mongodb/brew/mongodb-community
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB:**
   ```bash
   mongod
   ```

## SSL/HTTPS Configuration

### Let's Encrypt (Free SSL)

1. **Using Certbot:**
   ```bash
   # Install Certbot
   sudo apt-get install certbot
   
   # Get SSL certificate
   sudo certbot certonly --standalone -d yourdomain.com
   
   # Configure your server to use SSL
   ```

### Cloudflare (Recommended)

1. **Add Domain to Cloudflare:**
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Add your domain
   - Update DNS settings

2. **Enable SSL:**
   - Go to SSL/TLS settings
   - Set SSL mode to "Flexible" or "Full"

## Monitoring and Analytics

### Google Analytics

1. **Create Google Analytics Account:**
   - Sign up at [analytics.google.com](https://analytics.google.com)
   - Create a property for your website
   - Get your Measurement ID

2. **Add to Frontend:**
   - Set `NEXT_PUBLIC_GA_ID` in environment variables
   - Analytics code is automatically included

### Error Monitoring

Consider using services like:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [New Relic](https://newrelic.com) for performance monitoring

## Backup and Recovery

### Database Backup

1. **Automated Backups:**
   - MongoDB Atlas provides automated backups
   - For self-hosted MongoDB, use `mongodump`

2. **Manual Backup:**
   ```bash
   # Export database
   mongodump --uri="mongodb://localhost:27017/nca" --out=./backup
   
   # Import database
   mongorestore --uri="mongodb://localhost:27017/nca" ./backup
   ```

### Code Backup

- Use Git for version control
- Regularly push to remote repository
- Consider using multiple remotes for redundancy

## Performance Optimization

### Frontend Optimization

1. **Image Optimization:**
   - Use WebP format when possible
   - Implement lazy loading
   - Compress images

2. **Code Splitting:**
   - Next.js automatically handles code splitting
   - Use dynamic imports for heavy components

3. **Caching:**
   - Implement service worker for caching
   - Use CDN for static assets

### Backend Optimization

1. **Database Indexing:**
   - Create indexes for frequently queried fields
   - Use compound indexes for complex queries

2. **Caching:**
   - Implement Redis for caching
   - Use query result caching

3. **Load Balancing:**
   - Use multiple server instances
   - Implement load balancer

## Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use strong, unique secrets

2. **HTTPS:**
   - Always use HTTPS in production
   - Redirect HTTP to HTTPS

3. **CORS:**
   - Configure CORS properly
   - Only allow necessary origins

4. **Rate Limiting:**
   - Implement rate limiting on API endpoints
   - Use tools like `express-rate-limit`

5. **Input Validation:**
   - Validate all user inputs
   - Use parameterized queries to prevent SQL injection

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check `FRONTEND_URL` environment variable
   - Verify CORS configuration in backend

2. **Database Connection:**
   - Verify `MONGODB_URI` is correct
   - Check network connectivity

3. **Build Errors:**
   - Ensure all dependencies are installed
   - Check Node.js version compatibility

### Logs and Debugging

1. **Backend Logs:**
   ```bash
   # View logs on Heroku
   heroku logs --tail
   
   # View logs on Railway
   # Use Railway dashboard
   ```

2. **Frontend Logs:**
   - Use browser developer tools
   - Check console for errors

3. **Error Tracking:**
   - Implement error tracking service
   - Monitor application performance

## Support

For additional support:
- Check the [GitHub Issues](https://github.com/nca-rwanda/nca-website/issues)
- Contact the development team
- Review deployment logs for specific error messages

---

**Note:** Always test your deployment thoroughly before going live. Consider setting up a staging environment that mirrors your production setup.