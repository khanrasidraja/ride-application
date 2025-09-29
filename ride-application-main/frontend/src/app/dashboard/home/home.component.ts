import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollAnimationService } from '../../Service/scroll-animation.service';
declare const google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  map: any;
  directionsService: any;
  directionsRenderer: any;

  constructor(
    private readonly router: Router,
    private readonly elementRef: ElementRef,
    private readonly scrollAnimationService: ScrollAnimationService
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  ngOnDestroy(): void {
    this.scrollAnimationService.cleanup();
  }

  navigateToCreateRide() {
    this.router.navigate(['/app/createride']);
  }

  /**
   * Initialize all animations using the scroll animation service
   */
  private initAnimations(): void {
    // Initialize scroll animations for cards
    this.scrollAnimationService.initScrollAnimations(
      this.elementRef,
      '.card',
      {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px',
        animationClass: 'in-view',
        staggerDelay: 0.2,
        once: true
      }
    );

    // Add hover animations
    this.scrollAnimationService.addHoverAnimations(
      this.elementRef,
      '.card',
      'hover-active'
    );

    // Add click animations with navigation callback
    this.scrollAnimationService.addClickAnimations(
      this.elementRef,
      '.card',
      (element, event) => this.onCardClick(element, event)
    );

    // Add glow effect with delay
    setTimeout(() => {
      this.addGlowEffects();
    }, 1000);
  }

  /**
   * Add glow effects to cards
   */
  private addGlowEffects(): void {
    const cards = this.elementRef.nativeElement.querySelectorAll('.card');
    cards.forEach((card: Element, index: number) => {
      setTimeout(() => {
        card.classList.add('glow');
      }, index * 300);
    });
  }

  /**
   * Handle card click with navigation
   */
  private onCardClick(element: Element, event: Event): void {
    const vehicleId = element.getAttribute('data-vehicle-id');
    
    if (vehicleId) {
      console.log('Selected vehicle:', vehicleId);
      // You can implement navigation to vehicle details or booking
      // this.router.navigate(['/app/vehicle-details', vehicleId]);
      // Or navigate to create ride with pre-selected vehicle
      // this.router.navigate(['/app/createride'], { queryParams: { vehicle: vehicleId } });
    }

    // Show user feedback
    this.showSelectionFeedback(element);
  }

  /**
   * Show visual feedback when card is selected
   */
  private showSelectionFeedback(element: Element): void {
    const card = element as HTMLElement;
    const originalBorder = card.style.border;
    
    // Add selection highlight
    card.style.border = '3px solid #667eea';
    card.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
    
    // Remove highlight after delay
    setTimeout(() => {
      card.style.border = originalBorder;
      card.style.boxShadow = '';
    }, 1500);
  }

  /**
   * Public method to trigger animations manually
   */
  public triggerCardAnimations(): void {
    const cards = this.elementRef.nativeElement.querySelectorAll('.card');
    
    cards.forEach((card: Element, index: number) => {
      setTimeout(() => {
        card.classList.add('animate-in', 'glow');
      }, index * 200);
    });
  }




  // -------------------------------------INITIALIZE GOOGLE MAP-------------------------------------//
  initMap() {
    const koramangalaLocation = { lat: 12.9352, lng: 77.6245 }; // Koramangala, Bengaluru coordinates
    const airportLocation = { lat: 13.1986, lng: 77.7066 }; // Kempegowda Airport, Bengaluru coordinates
  
    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 12,
        center: koramangalaLocation,
      }
    );
  
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      polylineOptions: {
        strokeColor: "blue", 
      },
    });
  
    // Set up directions request
    const request = {
      origin: koramangalaLocation,
      destination: airportLocation,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    // Calculate and display directions
    this.directionsService.route(request, (response: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(response);
        // Add markers to the map
        const startMarker = new google.maps.Marker({
          position: koramangalaLocation,
          map: this.map,
          title: "Koramangala, Bengaluru",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Red marker for start
          },
        });
        
        const endMarker = new google.maps.Marker({
          position: airportLocation,
          map: this.map,
          title: "Kempegowda Airport, Bengaluru",
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green marker for end
          },
        });

        // Store markers for potential future use
        console.log('Map markers initialized:', startMarker, endMarker);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    });
  }
  
  
}
