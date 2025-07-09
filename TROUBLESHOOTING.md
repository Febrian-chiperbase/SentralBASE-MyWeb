# 🔧 TROUBLESHOOTING GUIDE - SentraBASE

## ❌ **ERR_CONNECTION_REFUSED Error**

### **Symptoms:**
- Browser shows `ERR_CONNECTION_REFUSED`
- Console errors: `Failed to fetch` dan `TypeError: Failed to fetch`
- Hot reload tidak bekerja
- Page tidak load

### **Root Causes:**
1. **Development server crashed** atau tidak berjalan
2. **Port 5173 blocked** atau digunakan process lain
3. **Vite cache corrupted**
4. **Network configuration issues**

## 🛠️ **SOLUTIONS**

### **Quick Fix - Restart Server:**
```bash
# Method 1: Use restart script
./restart-server.sh

# Method 2: Manual restart
npm run dev
```

### **Complete Fix - Clean Restart:**
```bash
# 1. Kill all processes on port 5173
lsof -ti:5173 | xargs kill -9

# 2. Clear caches
rm -rf node_modules/.vite
rm -rf dist

# 3. Restart server
npm run dev -- --host 0.0.0.0 --port 5173
```

### **Alternative Port:**
```bash
# If port 5173 is blocked, use different port
npm run dev -- --port 3000
```

## 🔍 **DIAGNOSTIC COMMANDS**

### **Check Server Status:**
```bash
# Check if server is running
lsof -i :5173

# Test server response
curl -I http://localhost:5173/

# Check server logs
npm run dev
```

### **Check Network:**
```bash
# Check if port is available
netstat -tulpn | grep :5173

# Check firewall
sudo ufw status
```

## 🚀 **PREVENTION TIPS**

### **1. Proper Server Shutdown:**
```bash
# Always use Ctrl+C to stop server properly
# Don't force close terminal without stopping server
```

### **2. Regular Cache Cleanup:**
```bash
# Weekly cleanup
rm -rf node_modules/.vite
npm run build
```

### **3. Monitor Server Health:**
```bash
# Check server status regularly
curl -s -I http://localhost:5173/ | head -1
```

## 🎯 **COMMON ISSUES & FIXES**

### **Issue: Server starts but page doesn't load**
**Fix:**
```bash
# Clear browser cache
# Hard refresh: Ctrl+Shift+R
# Or use incognito mode
```

### **Issue: Hot reload not working**
**Fix:**
```bash
# Restart server with clean cache
rm -rf node_modules/.vite
npm run dev
```

### **Issue: Port already in use**
**Fix:**
```bash
# Find and kill process using port
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### **Issue: Permission denied**
**Fix:**
```bash
# Check file permissions
ls -la package.json

# Fix permissions if needed
chmod 644 package.json
chmod 755 node_modules/.bin/*
```

## 📊 **SERVER HEALTH CHECK**

### **Automated Health Check Script:**
```bash
#!/bin/bash
echo "🔍 SentraBASE Server Health Check"

# Check if server is running
if lsof -i :5173 > /dev/null; then
    echo "✅ Server process is running"
else
    echo "❌ Server process not found"
    exit 1
fi

# Check if server responds
if curl -s -I http://localhost:5173/ | grep -q "200 OK"; then
    echo "✅ Server responds correctly"
else
    echo "❌ Server not responding"
    exit 1
fi

# Check build status
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo "🎉 All checks passed!"
```

## 🆘 **EMERGENCY RECOVERY**

### **If Nothing Works:**
```bash
# 1. Complete reset
rm -rf node_modules
rm -rf dist
rm -rf .vite

# 2. Fresh install
npm install

# 3. Clean build
npm run build

# 4. Start server
npm run dev
```

### **Nuclear Option:**
```bash
# Complete project reset (backup first!)
git stash
git clean -fdx
npm install
npm run dev
```

## 📞 **GETTING HELP**

### **Debug Information to Collect:**
```bash
# System info
node --version
npm --version
uname -a

# Project info
npm list --depth=0
cat package.json | grep version

# Server logs
npm run dev 2>&1 | tee server.log
```

### **Common Log Patterns:**
- `EADDRINUSE` → Port already in use
- `EACCES` → Permission denied
- `MODULE_NOT_FOUND` → Missing dependencies
- `VITE_*` → Vite configuration issues

## ✅ **SUCCESS INDICATORS**

### **Server Running Correctly:**
- ✅ `Local: http://localhost:5173/`
- ✅ `ready in XXXms`
- ✅ No error messages in console
- ✅ Hot reload working
- ✅ Page loads without errors

**Use this guide whenever you encounter connection issues!** 🚀
