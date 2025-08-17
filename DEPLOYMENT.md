# Deployment Guide for Render

This guide will walk you through deploying the Meeting Summarizer application to Render.

## 🚀 **Quick Deployment Steps**

### **Option 1: Deploy Both Services (Recommended)**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Meeting Summarizer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/meeting-summarizer.git
   git push -u origin main
   ```

2. **Deploy Backend API:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** `meeting-summarizer-backend`
     - **Environment:** `Python`
     - **Build Command:** `cd backend && pip install -r requirements.txt`
     - **Start Command:** `cd backend && python app.py`
     - **Instance Type:** Free (or paid for better performance)

3. **Set Environment Variables for Backend:**
   ```
   GEMINI_API_KEY=AIzaSyCn0j4EQoDgg_vqXqLVl7PVwEkzJPUelPU
   EMAIL_ADDRESS=sohghosh2003@gmail.com
   EMAIL_PASSWORD=beio qiyj vxvm tvgq
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```

4. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Configure:
     - **Name:** `meeting-summarizer-frontend`
     - **Build Command:** `cd frontend && npm install && npm run build`
     - **Publish Directory:** `frontend/build`

5. **Set Frontend Environment Variables:**
   ```
   REACT_APP_API_URL=https://YOUR_BACKEND_URL.onrender.com
   ```
   (Replace with your actual backend URL from step 3)

### **Option 2: One-Click Deploy with render.yaml**

1. **Push to GitHub** (same as above)

2. **Use Blueprint:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Render will automatically detect `render.yaml` and deploy both services

3. **Set Environment Variables:**
   - Backend: Same variables as Option 1
   - Frontend: Will automatically connect to backend

## 🔧 **Environment Variables Setup**

### **Required for Backend:**
```env
GEMINI_API_KEY=your_actual_gemini_key
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
FLASK_ENV=production
FLASK_DEBUG=False
```

### **Required for Frontend:**
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## 📋 **Post-Deployment Checklist**

- [ ] Backend service is running (check logs)
- [ ] Frontend can connect to backend API
- [ ] Test AI summarization functionality
- [ ] Test email sharing feature
- [ ] Verify environment variables are set correctly

## 🚨 **Important Security Notes**

1. **Never commit your .env file** - it contains sensitive API keys
2. **Use Environment Variables** in Render dashboard for secrets
3. **Rotate API keys** if they're ever exposed
4. **Use Gmail App Passwords** not your regular password

## 🔍 **Troubleshooting**

### **Backend Issues:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure Gemini API key is valid

### **Frontend Issues:**
- Check if REACT_APP_API_URL points to correct backend
- Verify build process completed successfully
- Check browser console for CORS errors

### **API Issues:**
- Test backend endpoints directly: `https://your-backend.onrender.com/api/health`
- Check if all dependencies installed correctly

## 🌐 **Your Deployed URLs**

After deployment, you'll have:
- **Frontend:** `https://meeting-summarizer-frontend-xyz.onrender.com`
- **Backend API:** `https://meeting-summarizer-backend-abc.onrender.com`

## 📈 **Performance Tips**

1. **Upgrade to Paid Plan** for better performance and no sleep mode
2. **Use CDN** for static assets
3. **Enable Auto-Deploy** for continuous deployment
4. **Monitor logs** for any issues

## 🔄 **Updating Your Deployment**

1. Make changes to your code
2. Push to GitHub: `git push origin main`
3. Render will automatically redeploy (if auto-deploy is enabled)

---

**Need Help?** Check Render's documentation or the troubleshooting section above.
