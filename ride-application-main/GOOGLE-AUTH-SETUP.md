# 🔐 Google Authentication Setup Guide

## 📋 **Overview**
This guide will help you implement Google Sign-in functionality in your Eber Taxi application.

## 🛠️ **Step 1: Google Cloud Console Setup**

### **1.1 Create a Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** or select existing project
3. Name your project (e.g., "Eber Taxi App")
4. Click **"Create"**

### **1.2 Enable Google Identity Services**
1. In the Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google Identity and Access Management (IAM) API"**
3. Click **"Enable"**

### **1.3 Configure OAuth Consent Screen**
1. Go to **"APIs & Services" > "OAuth consent screen"**
2. Select **"External"** user type
3. Fill in the required information:
   - **App name**: Eber Taxi
   - **User support email**: your-email@example.com
   - **Developer contact information**: your-email@example.com
4. Click **"Save and Continue"**
5. Skip **"Scopes"** section for now
6. Add test users if needed
7. Click **"Save and Continue"**

### **1.4 Create OAuth 2.0 Credentials**
1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ CREATE CREDENTIALS" > "OAuth client ID"**
3. Select **"Web application"**
4. Configure the client:
   - **Name**: Eber Taxi Web Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:4200` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**: 
     - `http://localhost:4200/login` (for development)
     - `https://yourdomain.com/login` (for production)
5. Click **"Create"**
6. **IMPORTANT**: Copy the **Client ID** - you'll need this!

## 🔧 **Step 2: Update Your Application**

### **2.1 Update Google Auth Service**
Open `src/app/Service/google-auth.service.ts` and replace `YOUR_GOOGLE_CLIENT_ID` with your actual Client ID:

```typescript
// Replace this line:
private readonly GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// With your actual Client ID:
private readonly GOOGLE_CLIENT_ID = '123456789-abcdefgh.apps.googleusercontent.com';
```

### **2.2 Update Environment Configuration**
Create or update your environment files:

**`src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
};
```

**`src/environments/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
};
```

### **2.3 Update Index.html (Optional)**
Add Google Identity Services script to `src/index.html`:

```html
<head>
  <!-- Other head content -->
  <script src="https://accounts.google.com/gsi/client" async defer></script>
</head>
```

## 🖥️ **Step 3: Backend Setup**

### **3.1 Install Required Packages**
```bash
cd backend
npm install google-auth-library
```

### **3.2 Environment Variables**
Add to your `.env` file:
```
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### **3.3 Verify Backend Route**
The Google authentication route has been created at `backend/routes/google-auth.js` and added to your `app.js`.

## 🧪 **Step 4: Testing**

### **4.1 Development Testing**
1. Start your backend server:
   ```bash
   cd backend
   node app.js
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to `http://localhost:4200/login`
4. Click the **"Google"** button
5. Follow the Google sign-in flow

### **4.2 Test Cases**
- ✅ New user registration via Google
- ✅ Existing user login via Google
- ✅ Error handling for failed authentication
- ✅ Token generation and storage

## 🔒 **Step 5: Security Best Practices**

### **5.1 Environment Security**
- Never commit your Google Client ID to version control
- Use environment variables for all sensitive data
- Use different Client IDs for development and production

### **5.2 Token Verification**
The backend route includes proper JWT token generation and user validation.

### **5.3 Error Handling**
Proper error handling is implemented for:
- Invalid Google tokens
- Database connection issues
- Missing required fields

## 🚀 **Step 6: Production Deployment**

### **6.1 Update OAuth Settings**
1. Go back to Google Cloud Console
2. Update **"Authorized JavaScript origins"** and **"Authorized redirect URIs"** with your production domain
3. Update environment variables in your production server

### **6.2 SSL/HTTPS**
Google requires HTTPS in production. Ensure your domain has a valid SSL certificate.

## 🔧 **Troubleshooting**

### **Common Issues:**

**❌ "Google API not loaded"**
- Ensure the Google Identity Services script is loaded
- Check browser console for script loading errors

**❌ "Invalid Client ID"**
- Verify your Client ID is correct
- Ensure your domain is authorized in Google Cloud Console

**❌ "Unauthorized JavaScript Origin"**
- Add your domain to authorized origins in Google Cloud Console
- Include both HTTP and HTTPS if needed

**❌ Backend errors**
- Check that the Google auth route is properly imported in `app.js`
- Verify your MongoDB connection is working
- Check server logs for detailed error messages

## 📱 **Mobile App Integration (Future)**

For mobile apps, you'll need to:
1. Create iOS and Android OAuth clients in Google Cloud Console
2. Use platform-specific Google Sign-in SDKs
3. Configure deep links for redirect handling

## 🎯 **Next Steps**

After setting up Google authentication:
1. Test with multiple Google accounts
2. Implement user profile completion for new Google users
3. Add Google account linking for existing users
4. Consider implementing Google One Tap for faster sign-in

---

## 📞 **Support**

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check server logs for backend errors
3. Verify all configuration steps were completed
4. Test with a simple HTML page first if needed

**🔗 Useful Links:**
- [Google Identity Documentation](https://developers.google.com/identity)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)

---

**✅ Your Google Authentication is now ready to use!**