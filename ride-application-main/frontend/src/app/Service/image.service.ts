import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  // Base paths for different image types
  private readonly basePaths = {
    vehicles: 'assets/images/vehicles/',
    backgrounds: 'assets/images/backgrounds/',
    icons: 'assets/images/icons/',
    profiles: 'assets/images/profiles/',
    logo: 'assets/images/'
  };

  // Vehicle images mapping
  private readonly vehicleImages: { [key: string]: string } = {
    'auto-rickshaw': 'auto-rickshaw.png',
    'car': 'car.png',
    'bike': 'bike.png',
    'taxi': 'taxi.png',
    'suv': 'suv.png',
    'luxury': 'luxury-car.png',
    'truck': 'truck.png',
    'van': 'van.png'
  };

  // Background images
  private readonly backgroundImages: { [key: string]: string } = {
    'login': 'login-bg.jpg',
    'dashboard': 'dashboard-bg.jpg',
    'map': 'map-bg.jpg',
    'hero': 'hero-bg.jpg'
  };

  // Icon images
  private readonly iconImages: { [key: string]: string } = {
    'location': 'location-icon.png',
    'phone': 'phone-icon.png',
    'email': 'email-icon.png',
    'time': 'time-icon.png',
    'star': 'star-icon.png',
    'user': 'user-icon.png'
  };

  // Profile images
  private readonly profileImages: { [key: string]: string } = {
    'default': 'default-profile.png',
    'male': 'male-profile.png',
    'female': 'female-profile.png',
    'driver': 'driver-profile.png'
  };

  constructor() { }

  /**
   * Get vehicle image path
   * @param vehicleType - Type of vehicle
   * @returns Image path or default image
   */
  getVehicleImage(vehicleType: string): string {
    const imageName = this.vehicleImages[vehicleType.toLowerCase()] || this.vehicleImages['car'];
    return this.basePaths.vehicles + imageName;
  }

  /**
   * Get background image path
   * @param backgroundType - Type of background
   * @returns Image path or default background
   */
  getBackgroundImage(backgroundType: string): string {
    const imageName = this.backgroundImages[backgroundType.toLowerCase()] || this.backgroundImages['dashboard'];
    return this.basePaths.backgrounds + imageName;
  }

  /**
   * Get icon image path
   * @param iconType - Type of icon
   * @returns Image path or default icon
   */
  getIconImage(iconType: string): string {
    const imageName = this.iconImages[iconType.toLowerCase()] || this.iconImages['user'];
    return this.basePaths.icons + imageName;
  }

  /**
   * Get profile image path
   * @param profileType - Type of profile
   * @returns Image path or default profile
   */
  getProfileImage(profileType: string = 'default'): string {
    const imageName = this.profileImages[profileType.toLowerCase()] || this.profileImages['default'];
    return this.basePaths.profiles + imageName;
  }

  /**
   * Get logo image path
   * @returns Logo image path
   */
  getLogoImage(): string {
    return this.basePaths.logo + 'logo.png';
  }

  /**
   * Get server image URL (for images stored on backend)
   * @param imagePath - Image path from server
   * @returns Full server image URL
   */
  getServerImage(imagePath: string): string {
    const serverUrl = 'http://localhost:4000';
    return `${serverUrl}/${imagePath}`;
  }

  /**
   * Check if image exists, return default if not
   * @param imagePath - Image path to check
   * @param defaultImage - Default image to return if not found
   * @returns Promise with image path or default
   */
  async checkImageExists(imagePath: string, defaultImage: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(imagePath);
      img.onerror = () => resolve(defaultImage);
      img.src = imagePath;
    });
  }

  /**
   * Preload images for better performance
   * @param imageUrls - Array of image URLs to preload
   */
  preloadImages(imageUrls: string[]): Promise<void[]> {
    const promises = imageUrls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    });
    return Promise.all(promises);
  }

  /**
   * Create a placeholder image URL
   * @param width - Image width
   * @param height - Image height
   * @param text - Placeholder text
   * @returns Placeholder image URL
   */
  createPlaceholderImage(width: number, height: number, text: string = 'No Image'): string {
    return `https://via.placeholder.com/${width}x${height}/cccccc/666666?text=${encodeURIComponent(text)}`;
  }
}