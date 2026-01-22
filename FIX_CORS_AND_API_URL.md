# 🔧 Fix: CORS Error + Localhost API Issue

## Current Problems

1. **Frontend is using `localhost:5000`** - `VITE_API_URL` is not set in Vercel
2. **CORS error** - Server only allows `localhost:3000` but request comes from `https://vjs-gamma.vercel.app`

## ✅ Solution (2 Steps)

### Step 1: Set VITE_API_URL in Vercel (CRITICAL)

The frontend is still trying to use `http://localhost:5000` because `VITE_API_URL` is not configured.

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click your **vjs** project

2. **Set Environment Variable:**
   - Go to **Settings** → **Environment Variables**
   - Find or add `VITE_API_URL`
   - Set the **Value** to your Railway backend URL:
     ```
     https://your-backend.railway.app/api
     ```
     - Replace with your actual Railway URL
     - **Must include `/api` at the end**
     - **Must start with `https://`**

3. **Enable for Production:**
   - Make sure it's checked for **Production** environment
   - Click **Save**

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Click **Redeploy**
   - Wait 1-2 minutes

### Step 2: Set FRONTEND_URL in Railway (For CORS)

Your Railway backend needs to know your Vercel frontend URL.

1. **Go to Railway Dashboard:**
   - https://railway.app/
   - Click your backend project

2. **Set Environment Variable:**
   - Go to **Variables** tab
   - Find or add `FRONTEND_URL`
   - Set the **Value** to:
     ```
     https://vjs-gamma.vercel.app
     ```
     - **No trailing slash**
     - **Must use `https://`**

3. **Redeploy Railway:**
   - Railway will auto-redeploy when you change variables
   - Wait for deployment to complete

## ✅ Expected Result

After both steps:
- ✅ Frontend calls Railway backend (not localhost)
- ✅ No CORS errors
- ✅ Bookings load and save successfully

## 🆘 Still Having Issues?

### Check 1: Verify VITE_API_URL is Set

In Vercel:
1. Go to **Settings** → **Environment Variables**
2. Verify `VITE_API_URL` exists
3. Verify value is: `https://your-backend.railway.app/api`
4. Verify it's enabled for **Production**

### Check 2: Verify FRONTEND_URL is Set

In Railway:
1. Go to **Variables** tab
2. Verify `FRONTEND_URL` exists
3. Verify value is: `https://vjs-gamma.vercel.app`
4. Check deployment logs to confirm it's using the new value

### Check 3: Test Backend Health

Visit your Railway backend:
```
https://your-backend.railway.app/health
```

Should return:
```json
{
  "status": "OK",
  "message": "VJK Mahal API is running"
}
```

### Check 4: Check Browser Console

After redeploying both:
1. Open https://vjs-gamma.vercel.app/
2. Open browser console (F12)
3. Look for network requests
4. Should see requests to: `https://your-backend.railway.app/api/bookings`
5. Should NOT see requests to `localhost:5000`

## 📝 Quick Checklist

**Vercel Environment Variables:**
- [ ] `VITE_API_URL` = `https://your-backend.railway.app/api`
- [ ] Enabled for Production
- [ ] Project redeployed

**Railway Environment Variables:**
- [ ] `FRONTEND_URL` = `https://vjs-gamma.vercel.app`
- [ ] Backend redeployed

**Testing:**
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Can login (PIN: 1234)
- [ ] Can add bookings
- [ ] No CORS errors in console

## 🔍 Common Mistakes

**❌ Wrong VITE_API_URL:**
```
/api                                    ← Relative path
http://localhost:5000/api              ← Localhost
https://vjs-gamma.vercel.app/api        ← Vercel domain
https://your-backend.railway.app        ← Missing /api
```

**✅ Correct VITE_API_URL:**
```
https://your-backend.railway.app/api
```

**❌ Wrong FRONTEND_URL:**
```
http://vjs-gamma.vercel.app            ← Should be https
https://vjs-gamma.vercel.app/          ← Trailing slash
localhost:3000                        ← Wrong domain
```

**✅ Correct FRONTEND_URL:**
```
https://vjs-gamma.vercel.app
```

---

**Need help deploying Railway backend?** See `RAILWAY_DEPLOY_NOW.md`
