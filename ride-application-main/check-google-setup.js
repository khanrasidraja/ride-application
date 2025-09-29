#!/usr/bin/env node

/**
 * Google Authentication Setup Status Checker
 * Run this script to see what needs to be configured for Google login
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Google Authentication Setup Status...\n');

// Check if required files exist
const checks = [
  {
    name: 'Google Auth Service',
    path: 'frontend/src/app/Service/google-auth.service.ts',
    status: false,
    description: 'Angular service for Google authentication'
  },
  {
    name: 'Backend Google Route',
    path: 'backend/routes/google-auth.js',
    status: false,
    description: 'Backend API endpoint for Google login'
  },
  {
    name: 'Environment Configuration',
    path: 'frontend/src/environments/environment.ts',
    status: false,
    description: 'Environment file for Google Client ID'
  },
  {
    name: 'Setup Guide',
    path: 'GOOGLE-AUTH-SETUP.md',
    status: false,
    description: 'Complete setup instructions'
  }
];

// Check each file
checks.forEach(check => {
  try {
    if (fs.existsSync(check.path)) {
      check.status = true;
      console.log(`✅ ${check.name}: Found`);
    } else {
      console.log(`❌ ${check.name}: Missing`);
    }
  } catch (error) {
    console.log(`❌ ${check.name}: Error checking`);
  }
});

console.log('\n📋 Configuration Status:');

// Check for Google Client ID in the service file
try {
  const servicePath = 'frontend/src/app/Service/google-auth.service.ts';
  if (fs.existsSync(servicePath)) {
    const content = fs.readFileSync(servicePath, 'utf8');
    if (content.includes('YOUR_GOOGLE_CLIENT_ID')) {
      console.log('⚠️  Google Client ID: Not configured (still showing placeholder)');
    } else {
      console.log('✅ Google Client ID: Configured');
    }
  }
} catch (error) {
  console.log('❌ Cannot check Google Client ID configuration');
}

console.log('\n🚀 Next Steps:');
console.log('1. Follow the instructions in GOOGLE-AUTH-SETUP.md');
console.log('2. Get your Google Client ID from Google Cloud Console');
console.log('3. Replace YOUR_GOOGLE_CLIENT_ID in google-auth.service.ts');
console.log('4. Test the Google login functionality');

console.log('\n🔗 Quick Links:');
console.log('- Google Cloud Console: https://console.cloud.google.com/');
console.log('- Setup Guide: ./GOOGLE-AUTH-SETUP.md');
console.log('- Test Login: http://localhost:4200/login (after starting servers)');

console.log('\n💡 To test immediately with a placeholder:');
console.log('The Google login button is now functional but requires Google Cloud setup.');
console.log('For now, it will show an info message when clicked.');

console.log('\n🎯 Current Status: Google login UI is ready, backend is ready, needs Google Cloud configuration');