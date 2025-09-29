import { Injectable, ElementRef } from '@angular/core';

export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animationClass?: string;
  staggerDelay?: number;
  once?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationService {
  private observers: Map<string, IntersectionObserver> = new Map();

  constructor() {}

  /**
   * Initialize scroll animations for elements
   * @param elementRef - Component's ElementRef
   * @param selector - CSS selector for elements to animate
   * @param options - Animation options
   */
  initScrollAnimations(
    elementRef: ElementRef, 
    selector: string = '.animate-on-scroll',
    options: ScrollAnimationOptions = {}
  ): void {
    const defaultOptions: ScrollAnimationOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      animationClass: 'in-view',
      staggerDelay: 0.1,
      once: true
    };

    const config = { ...defaultOptions, ...options };
    const elements = elementRef.nativeElement.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    // Create unique observer ID
    const observerId = `${selector}-${Date.now()}`;

    // Configure intersection observer
    const observerOptions = {
      threshold: config.threshold!,
      rootMargin: config.rootMargin!
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay
          setTimeout(() => {
            entry.target.classList.add(config.animationClass!);
            
            // Add additional effect classes
            entry.target.classList.add('animate-in');
            
            // Trigger custom animation event
            const event = new CustomEvent('scrollAnimation', {
              detail: { element: entry.target, index }
            });
            entry.target.dispatchEvent(event);
            
          }, index * (config.staggerDelay! * 1000));

          // Stop observing if once is true
          if (config.once) {
            observer.unobserve(entry.target);
          }
        } else if (!config.once) {
          // Remove animation class if element goes out of view
          entry.target.classList.remove(config.animationClass!);
          entry.target.classList.remove('animate-in');
        }
      });
    }, observerOptions);

    // Observe all elements
    elements.forEach((element: Element) => {
      observer.observe(element);
    });

    // Store observer for cleanup
    this.observers.set(observerId, observer);
  }

  /**
   * Add hover animations to elements
   * @param elementRef - Component's ElementRef
   * @param selector - CSS selector for elements
   * @param animationClass - CSS class to add on hover
   */
  addHoverAnimations(
    elementRef: ElementRef,
    selector: string = '.card',
    animationClass: string = 'hover-active'
  ): void {
    const elements = elementRef.nativeElement.querySelectorAll(selector);
    
    elements.forEach((element: Element) => {
      element.addEventListener('mouseenter', () => {
        element.classList.add(animationClass);
        element.classList.add('floating');
      });

      element.addEventListener('mouseleave', () => {
        element.classList.remove(animationClass);
        setTimeout(() => {
          element.classList.remove('floating');
        }, 300);
      });
    });
  }

  /**
   * Add click animations to elements
   * @param elementRef - Component's ElementRef
   * @param selector - CSS selector for elements
   * @param callback - Click callback function
   */
  addClickAnimations(
    elementRef: ElementRef,
    selector: string = '.card',
    callback?: (element: Element, event: Event) => void
  ): void {
    const elements = elementRef.nativeElement.querySelectorAll(selector);
    
    elements.forEach((element: Element) => {
      element.addEventListener('click', (event) => {
        // Add click animation
        const htmlElement = element as HTMLElement;
        const originalTransform = htmlElement.style.transform;
        
        htmlElement.style.transform = 'scale(0.95)';
        htmlElement.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
          htmlElement.style.transform = originalTransform;
          htmlElement.style.transition = '';
        }, 150);

        // Execute callback if provided
        if (callback) {
          callback(element, event);
        }
      });
    });
  }

  /**
   * Create parallax effect for elements
   * @param elementRef - Component's ElementRef
   * @param selector - CSS selector for elements
   * @param speed - Parallax speed (0-1, where 1 is normal scroll speed)
   */
  addParallaxEffect(
    elementRef: ElementRef,
    selector: string = '.parallax',
    speed: number = 0.5
  ): void {
    const elements = elementRef.nativeElement.querySelectorAll(selector);
    
    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      
      elements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        const rate = scrollY * speed;
        htmlElement.style.transform = `translateY(${rate}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Add typing animation effect
   * @param elementRef - Component's ElementRef
   * @param selector - CSS selector for text elements
   * @param speed - Typing speed in milliseconds
   */
  addTypingEffect(
    elementRef: ElementRef,
    selector: string = '.typing-text',
    speed: number = 100
  ): void {
    const elements = elementRef.nativeElement.querySelectorAll(selector);
    
    elements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      const text = htmlElement.textContent || '';
      htmlElement.textContent = '';
      
      let index = 0;
      const typeWriter = () => {
        if (index < text.length) {
          htmlElement.textContent += text.charAt(index);
          index++;
          setTimeout(typeWriter, speed);
        } else {
          htmlElement.classList.add('typing-complete');
        }
      };
      
      // Start typing when element comes into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeWriter();
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(htmlElement);
    });
  }

  /**
   * Cleanup all observers for a component
   * @param observerId - Optional specific observer ID to cleanup
   */
  cleanup(observerId?: string): void {
    if (observerId && this.observers.has(observerId)) {
      this.observers.get(observerId)!.disconnect();
      this.observers.delete(observerId);
    } else {
      // Cleanup all observers
      this.observers.forEach((observer) => {
        observer.disconnect();
      });
      this.observers.clear();
    }
  }

  /**
   * Create custom animation sequence
   * @param elements - Array of elements to animate
   * @param animations - Array of animation configurations
   */
  createAnimationSequence(
    elements: Element[],
    animations: Array<{
      delay: number;
      duration: number;
      className: string;
      callback?: () => void;
    }>
  ): void {
    elements.forEach((element, index) => {
      animations.forEach((animation) => {
        setTimeout(() => {
          element.classList.add(animation.className);
          
          if (animation.callback) {
            animation.callback();
          }
          
          // Remove class after duration
          setTimeout(() => {
            element.classList.remove(animation.className);
          }, animation.duration);
          
        }, animation.delay + (index * 100)); // Stagger by 100ms
      });
    });
  }

  /**
   * Add loading skeleton animation
   * @param elementRef - Component's ElementRef
   * @param selector - CSS selector for skeleton elements
   */
  addSkeletonAnimation(
    elementRef: ElementRef,
    selector: string = '.skeleton'
  ): void {
    const elements = elementRef.nativeElement.querySelectorAll(selector);
    
    elements.forEach((element: Element) => {
      element.classList.add('skeleton-loading');
      
      // Remove skeleton after content loads
      setTimeout(() => {
        element.classList.remove('skeleton-loading');
        element.classList.add('skeleton-loaded');
      }, 2000); // Adjust timing as needed
    });
  }
}