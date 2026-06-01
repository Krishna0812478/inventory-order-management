# Deployment Guide

## Backend Deployment

### Option 1: Render (Recommended)

1. **Create Render Account**: https://render.com
2. **Connect GitHub**: Link your repository
3. **Create Web Service**:
   - Select your repository
   - Environment: Docker
   - Build Command: (leave empty)
   - Start Command: (leave empty)
   
4. **Environment Variables**:
   ```
   DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ENVIRONMENT=production
   DEBUG=False
   ```

5. **Database**:
   - Use PostgreSQL from Supabase or Railway
   - Copy connection string to DATABASE_URL

### Option 2: Railway

1. **Create Railway Account**: https://railway.app
2. **Connect GitHub**: Link your repository
3. **Add PostgreSQL Plugin**
4. **Deploy Service**:
   - Select Dockerfile from backend/
   - Railway auto-generates DATABASE_URL

### Option 3: Fly.io

1. **Install Fly CLI**: https://fly.io/docs/hands-on/install-flyctl/
2. **Login**: `flyctl auth login`
3. **Create App**: `flyctl launch`
4. **Deploy**: `flyctl deploy`

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Create Vercel Account**: https://vercel.com
2. **Import Project**: Connect GitHub repository
3. **Configure Build**:
   - Framework: React
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.render.com
   ```

5. **Deploy**: Vercel auto-deploys on git push

### Option 2: Netlify

1. **Create Netlify Account**: https://netlify.com
2. **Connect GitHub**: Link repository
3. **Configure**:
   - Build Command: `npm run build`
   - Publish Directory: `build`
   - Base Directory: `frontend`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.render.com
   ```

5. **Deploy**: Netlify auto-deploys on git push

### Option 3: GitHub Pages

1. **Update package.json**:
   ```json
   "homepage": "https://username.github.io/inventory-order-management"
   ```

2. **Add deploy script**:
   ```bash
   npm run build
   npm run deploy
   ```

## Database Deployment

### Supabase (Easiest)

1. **Create Account**: https://supabase.com
2. **Create Project**: PostgreSQL database
3. **Get Connection String**: Project Settings → Database
4. **Copy URL**: `postgresql://[user]:[password]@[host]:[port]/[database]`

### Railway

1. **Create Account**: https://railway.app
2. **Add PostgreSQL Plugin**
3. **Copy Database URL** from connection tab
4. **Use in backend environment**

## Post-Deployment Steps

### 1. Test Backend API
```bash
curl https://your-backend-url/health
```

Expected response:
```json
{"status": "healthy"}
```

### 2. Test Frontend
- Visit: https://your-frontend-url
- Verify all pages load

### 3. Test API Integration
- Create a product from dashboard
- Create a customer
- Create an order

### 4. Monitor
- Check backend logs: `render.com` → Logs
- Check frontend logs: `vercel.com` → Analytics

## Troubleshooting

### Backend Not Connecting
- Verify DATABASE_URL is correct
- Check FRONTEND_URL is set to your frontend domain
- Review backend logs for errors

### Frontend Can't Reach Backend
- Check REACT_APP_API_URL is correct
- Verify CORS is enabled on backend
- Check browser console for errors

### Database Connection Timeout
- Verify database is running
- Check connection string format
- Ensure firewall allows connections

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backup enabled
- [ ] Backend health check passing
- [ ] Frontend loads without errors
- [ ] API endpoints responding
- [ ] Orders can be created
- [ ] Inventory updates working
- [ ] Error messages displaying
- [ ] Mobile responsive
- [ ] SSL certificate active

## Cost Estimation (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Backend (Render) | $7-12 | Free tier available |
| Frontend (Vercel) | Free | Unless using Pro |
| Database (Supabase) | $25 | Free tier 500MB |
| **Total** | **~$32-37** | Starting costs |

## Monitoring & Logs

### Render (Backend)
- Logs: Dashboard → Logs tab
- Metrics: Dashboard → Metrics tab
- Alerts: Settings → Alerts

### Vercel (Frontend)
- Logs: Project → Deployments → Logs
- Analytics: Project → Analytics

### Supabase (Database)
- Monitoring: Project → Monitoring
- Backups: Project → Backups

---

**Deployment Complete!** 🎉
