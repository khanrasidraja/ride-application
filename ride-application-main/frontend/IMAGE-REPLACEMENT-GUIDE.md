# Image Replacement Guide

This document explains how to replace all images in your ride-sharing application.

## 🎨 Image Categories

### 1. Vehicle Images
**Location:** `frontend/src/assets/images/vehicles/`
**Required Images:**
- `auto-rickshaw.png` - Auto rickshaw icon
- `car.png` - Standard car icon
- `bike.png` - Motorcycle/bike icon
- `taxi.png` - Taxi icon
- `suv.png` - SUV icon
- `luxury-car.png` - Luxury car icon
- `truck.png` - Truck icon
- `van.png` - Van icon

**Recommended Size:** 128x128px or 256x256px
**Format:** PNG with transparent background

### 2. Background Images
**Location:** `frontend/src/assets/images/backgrounds/`
**Required Images:**
- `login-bg.jpg` - Login page background
- `dashboard-bg.jpg` - Dashboard background
- `map-bg.jpg` - Map component background
- `hero-bg.jpg` - Landing page hero background

**Recommended Size:** 1920x1080px or larger
**Format:** JPG or PNG

### 3. Profile Images
**Location:** `frontend/src/assets/images/profiles/`
**Required Images:**
- `default-profile.png` - Default user profile
- `male-profile.png` - Male user profile
- `female-profile.png` - Female user profile
- `driver-profile.png` - Driver profile

**Recommended Size:** 150x150px
**Format:** PNG with transparent background

### 4. Icon Images
**Location:** `frontend/src/assets/images/icons/`
**Required Images:**
- `location-icon.png` - Location/GPS icon
- `phone-icon.png` - Phone icon
- `email-icon.png` - Email icon
- `time-icon.png` - Time/clock icon
- `star-icon.png` - Rating star icon
- `user-icon.png` - User icon

**Recommended Size:** 32x32px or 64x64px
**Format:** PNG with transparent background

### 5. Logo
**Location:** `frontend/src/assets/images/`
**Required Images:**
- `logo.png` - Main application logo

**Recommended Size:** 200x80px (or maintain aspect ratio)
**Format:** PNG with transparent background

## 🔄 How to Replace Images

### Method 1: Direct Replacement
1. Navigate to the respective folder
2. Replace the existing image with your new image
3. **Keep the same filename** to avoid code changes

### Method 2: Using New Filenames
1. Add your new images to the respective folders
2. Update the `ImageService` in `frontend/src/app/Service/image.service.ts`
3. Update the image mappings in the service

### Method 3: Bulk Image Updates
1. Place all your images in the correct folders
2. Update the image service mappings
3. Run the application to see changes

## 🎯 Image Sources (Free)

### High-Quality Image Resources:
- **Unsplash** (https://unsplash.com/) - Free high-quality photos
- **Pexels** (https://pexels.com/) - Free stock photos
- **Pixabay** (https://pixabay.com/) - Free images and vectors
- **Freepik** (https://freepik.com/) - Free vectors and icons (attribution required)
- **Flaticon** (https://flaticon.com/) - Free icons (attribution required)

### Vehicle Icons:
- Search for "car icon", "taxi icon", "motorcycle icon", etc.
- Look for SVG or PNG formats
- Ensure consistent style across all vehicle types

### Background Images:
- Search for "city background", "road background", "abstract background"
- Choose images that match your app's color scheme
- Ensure images are high resolution

## 🛠️ Image Optimization Tips

1. **Compress Images:** Use tools like TinyPNG or ImageOptim
2. **Consistent Style:** Use similar art styles across all images
3. **Proper Sizing:** Don't use oversized images
4. **Responsive Images:** Consider different screen sizes
5. **WebP Format:** Consider using WebP for better compression

## 🎨 Animation Features Added

The application now includes:
- ✅ Fade in/out animations
- ✅ Slide animations (left, right, top, bottom)
- ✅ Scale and bounce effects
- ✅ Hover animations for buttons and cards
- ✅ Stagger animations for lists
- ✅ Loading spinners
- ✅ Image zoom on hover
- ✅ Modern card designs with shadows
- ✅ Gradient text effects

## 📝 Usage in Components

To use animations in your components:

```typescript
// Import animations
import { trigger, transition, style, animate } from '@angular/animations';

// Add to component decorator
@Component({
  // ... other properties
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
```

```html
<!-- Use in templates -->
<div class="fade-in">Content with fade animation</div>
<div class="hover-scale">Hover me for scale effect</div>
<div class="modern-card">Modern styled card</div>
```

## 🚀 Next Steps

1. **Replace Images:** Add your custom images to the respective folders
2. **Customize Colors:** Update the CSS variables in `styles.css`
3. **Add More Animations:** Extend the animation service with custom animations
4. **Test Performance:** Ensure animations don't impact performance
5. **Mobile Optimization:** Test animations on mobile devices