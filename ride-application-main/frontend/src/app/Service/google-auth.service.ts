import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare var google: any;

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private isGoogleApiLoaded = false;
  private userSubject = new BehaviorSubject<GoogleUser | null>(null);
  public user$ = this.userSubject.asObservable();

  // Google OAuth Config - Replace with your actual Client ID
  private readonly GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

  constructor() {
    this.loadGoogleApi();
  }

  /**
   * Load Google Identity Services API
   */
  private loadGoogleApi(): void {
    if (this.isGoogleApiLoaded) {
      return;
    }

    // Create script element to load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.isGoogleApiLoaded = true;
      this.initializeGoogleAuth();
    };
    
    document.head.appendChild(script);
  }

  /**
   * Initialize Google Authentication
   */
  private initializeGoogleAuth(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      // Initialize Google One Tap
      google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: (response: any) => this.handleGoogleResponse(response),
        auto_select: false,
        cancel_on_tap_outside: false
      });
    }
  }

  /**
   * Handle Google Sign-in Response
   */
  private handleGoogleResponse(response: any): void {
    try {
      // Decode JWT token to get user information
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      
      const googleUser: GoogleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        sub: payload.sub
      };

      this.userSubject.next(googleUser);
      console.log('Google Sign-in successful:', googleUser);
      
    } catch (error) {
      console.error('Error parsing Google response:', error);
    }
  }

  /**
   * Sign in with Google (Popup)
   */
  signInWithGoogle(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      if (!this.isGoogleApiLoaded) {
        reject(new Error('Google API not loaded'));
        return;
      }

      // Create callback for popup
      const callback = (response: any) => {
        if (response.credential) {
          try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            
            const googleUser: GoogleUser = {
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
              sub: payload.sub
            };

            this.userSubject.next(googleUser);
            resolve(googleUser);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('No credential received'));
        }
      };

      // Update callback and prompt
      google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: callback
      });

      // Show the sign-in prompt
      google.accounts.id.prompt();
    });
  }

  /**
   * Sign in with Google using custom button
   */
  signInWithGoogleButton(): Promise<GoogleUser> {
    return new Promise((resolve, reject) => {
      if (!this.isGoogleApiLoaded || !google.accounts) {
        reject(new Error('Google API not loaded'));
        return;
      }

      // Use Google's popup flow
      const client = google.accounts.oauth2.initTokenClient({
        client_id: this.GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: (response: any) => {
          if (response.access_token) {
            // Get user info using access token
            this.getUserInfo(response.access_token)
              .then(userInfo => {
                const googleUser: GoogleUser = {
                  email: userInfo.email,
                  name: userInfo.name,
                  picture: userInfo.picture,
                  sub: userInfo.id
                };
                
                this.userSubject.next(googleUser);
                resolve(googleUser);
              })
              .catch(reject);
          } else {
            reject(new Error('No access token received'));
          }
        }
      });

      client.requestAccessToken();
    });
  }

  /**
   * Get user info from Google API
   */
  private getUserInfo(accessToken: string): Promise<any> {
    return fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
      .then(response => response.json());
  }

  /**
   * Sign out from Google
   */
  signOut(): void {
    if (this.isGoogleApiLoaded && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    this.userSubject.next(null);
  }

  /**
   * Get current user
   */
  getCurrentUser(): GoogleUser | null {
    return this.userSubject.value;
  }

  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean {
    return this.userSubject.value !== null;
  }
}