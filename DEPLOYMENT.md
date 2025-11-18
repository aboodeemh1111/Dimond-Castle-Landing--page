# 🚀 Diamond Castle Deployment Guide

This guide covers deploying the Diamond Castle application stack to a VPS with Vercel frontend deployment.

## 📋 Architecture Overview

- **Frontend**: Next.js apps deployed to Vercel
  - Public site: `dimond-castle-web` → `https://www.MYDOMAIN.com`
  - Admin panel: `dimond-castle-admin-v2` → `https://admin.MYDOMAIN.com`
- **Backend**: Express API + MongoDB in Docker
  - API: `dimond-castle-api` → `https://api.MYDOMAIN.com`
  - Database: MongoDB in Docker container
  - File storage: Local `/uploads` directory

## 🔄 Pre-Deployment Migration Steps

### 1. Migrate Images from Cloudinary to Local Storage

Before deploying, migrate all existing images from Cloudinary to local storage:

```bash
# In the API directory
cd dimond-castle-api

# Set your Atlas connection string
export ATLAS_URI="mongodb+srv://username:password@cluster.mongodb.net/dimondcastle?retryWrites=true&w=majority"

# Run the migration
npm run migrate:images
```

**What this does:**
- Connects to your MongoDB Atlas database
- Finds all documents with Cloudinary URLs
- Downloads images to `./uploads/` directory
- Updates database records to use local URLs (`/uploads/filename.ext`)
- Processes blogs, pages, products, and settings collections

### 2. Dump MongoDB Atlas Database

Export your current Atlas database:

```bash
# Install mongodb-database-tools if not available
# On Ubuntu/Debian:
sudo apt-get install mongodb-database-tools

# Or download from: https://www.mongodb.com/try/download/database-tools

# Dump the database (replace with your Atlas connection string)
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/dimondcastle?retryWrites=true&w=majority" --out=./atlas-backup

# Compress the backup
tar -czf atlas-backup.tar.gz atlas-backup/
```

## 🐳 Deploy Backend to VPS

### 1. Prepare VPS Environment

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
sudo apt install docker.io docker-compose-v2 -y

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional, for convenience)
sudo usermod -aG docker $USER

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Deploy Application

```bash
# Clone or upload your project to the VPS
# Assuming you're in the project root directory

# Navigate to API directory
cd dimond-castle-api

# Copy environment configuration
cp .env.production.example .env.production

# Edit with your actual values
nano .env.production

# Build and start services
docker-compose up -d --build

# Check that services are running
docker-compose ps
docker-compose logs app
docker-compose logs mongo
```

### 3. Restore Database from Atlas

```bash
# Copy your Atlas backup to the VPS
# Assuming you have atlas-backup.tar.gz in the current directory

# Extract backup
tar -xzf atlas-backup.tar.gz

# Restore to Docker MongoDB
docker-compose exec mongo mongorestore --username admin --password your_password --db dimondcastle ./atlas-backup/dimondcastle/

# Verify restoration
docker-compose exec mongo mongo --username admin --password your_password dimondcastle --eval "db.stats()"
```

### 4. Configure Nginx Reverse Proxy

Create Nginx configuration for the API:

```bash
# Create sites-available config
sudo nano /etc/nginx/sites-available/api.MYDOMAIN.com
```

**Contents of `/etc/nginx/sites-available/api.MYDOMAIN.com`:**

```nginx
server {
    listen 80;
    server_name api.MYDOMAIN.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle static file serving for uploads
    location /uploads/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Cache static files
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy all other requests to the API
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable the site:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/api.MYDOMAIN.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 5. Configure SSL Certificate

```bash
# Obtain SSL certificate
sudo certbot --nginx -d api.MYDOMAIN.com

# Follow the prompts to configure HTTPS
# Certbot will automatically update your Nginx config
```

## 🚀 Deploy Frontend to Vercel

### 1. Deploy Public Site (`dimond-castle-web`)

```bash
# In the dimond-castle-web directory
cd dimond-castle-web

# Install Vercel CLI if not installed
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or via CLI:
vercel env add NEXT_PUBLIC_API_URL production
# Value: https://api.MYDOMAIN.com

# For preview deployments (optional):
vercel env add NEXT_PUBLIC_API_URL preview
# Value: https://api.MYDOMAIN.com
```

### 2. Deploy Admin Panel (`dimond-castle-admin-v2`)

```bash
# In the dimond-castle-admin-v2 directory
cd dimond-castle-admin-v2

# Deploy
vercel

# Set environment variables:
vercel env add NEXT_PUBLIC_API_URL production
# Value: https://api.MYDOMAIN.com

vercel env add NEXT_PUBLIC_MAIN_WEBSITE_URL production
# Value: https://www.MYDOMAIN.com
```

## ✅ Final Deployment Checklist

### Pre-Deployment
- [ ] Run Cloudinary migration script against Atlas database
- [ ] Create backup of Atlas database with `mongodump`
- [ ] Test migration script in development environment
- [ ] Update all environment variables in `.env.production`

### VPS Setup
- [ ] Install Docker, Docker Compose, Nginx, and Certbot
- [ ] Configure firewall (allow 22, 80, 443, optionally 4000 for direct API access)
- [ ] Clone/upload project files to VPS
- [ ] Copy and configure `.env.production` file

### Backend Deployment
- [ ] Run `docker-compose up -d --build` in API directory
- [ ] Verify services are running: `docker-compose ps`
- [ ] Check API health: `curl http://localhost:4000/api/health`
- [ ] Restore database from Atlas backup
- [ ] Verify MongoDB connection and data restoration

### Nginx Configuration
- [ ] Create `/etc/nginx/sites-available/api.MYDOMAIN.com`
- [ ] Enable site with symlink to `sites-enabled`
- [ ] Test configuration: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`
- [ ] Verify API accessible via `http://api.MYDOMAIN.com/api/health`

### SSL Setup
- [ ] Run `sudo certbot --nginx -d api.MYDOMAIN.com`
- [ ] Verify HTTPS works: `https://api.MYDOMAIN.com/api/health`
- [ ] Check Certbot auto-renewal: `sudo systemctl status certbot.timer`

### Frontend Deployment
- [ ] Deploy `dimond-castle-web` to Vercel
- [ ] Set `NEXT_PUBLIC_API_URL=https://api.MYDOMAIN.com`
- [ ] Deploy `dimond-castle-admin-v2` to Vercel
- [ ] Set `NEXT_PUBLIC_API_URL=https://api.MYDOMAIN.com`
- [ ] Set `NEXT_PUBLIC_MAIN_WEBSITE_URL=https://www.MYDOMAIN.com`

### Post-Deployment Testing
- [ ] Test public site loads and can fetch data
- [ ] Test admin panel login and functionality
- [ ] Test file uploads work and are served correctly
- [ ] Test CORS allows requests from Vercel domains
- [ ] Verify image URLs point to `/uploads/` paths
- [ ] Test contact form submissions
- [ ] Verify database operations work correctly

### Monitoring & Maintenance
- [ ] Set up log monitoring: `docker-compose logs -f`
- [ ] Configure log rotation for Nginx
- [ ] Set up backup strategy for MongoDB data
- [ ] Monitor disk space usage (especially `/uploads`)
- [ ] Set up alerts for service failures

## 🔧 Troubleshooting

### Common Issues

**API returns 502 Bad Gateway:**
- Check if Docker containers are running: `docker-compose ps`
- Check API logs: `docker-compose logs app`
- Verify Nginx configuration: `sudo nginx -t`

**Images not loading:**
- Check file permissions on `./uploads` directory
- Verify volume mount in `docker-compose.yml`
- Check API logs for file serving errors

**CORS errors:**
- Verify `FRONTEND_ORIGINS` in `.env.production`
- Check Vercel deployment URLs match allowed origins
- Restart API container after env changes

**Database connection issues:**
- Check MongoDB logs: `docker-compose logs mongo`
- Verify connection string in `.env.production`
- Test connection: `docker-compose exec mongo mongo --eval "db.stats()"`

### Useful Commands

```bash
# View all logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Check disk usage
df -h
du -sh uploads/

# Check MongoDB
docker-compose exec mongo mongo dimondcastle --eval "db.stats()"

# Check API health
curl -I https://api.MYDOMAIN.com/api/health
```

## 🔒 Security Considerations

- Change default admin credentials in production
- Use strong JWT secrets
- Regularly update Docker images
- Monitor for security updates
- Use HTTPS everywhere
- Implement rate limiting (already configured)
- Set up proper firewall rules
- Regularly backup data
- Monitor logs for suspicious activity

---

🎉 **Congratulations!** Your Diamond Castle application is now deployed and ready to serve users.
