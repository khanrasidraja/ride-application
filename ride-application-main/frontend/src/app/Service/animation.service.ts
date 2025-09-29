import { Injectable } from '@angular/core';
import { 
  trigger, 
  state, 
  style, 
  transition, 
  animate, 
  keyframes,
  query,
  stagger,
  group
} from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  // Fade In/Out Animation
  static fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-in', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate('300ms ease-out', style({ opacity: 0 }))
    ])
  ]);

  // Slide In From Left
  static slideInLeft = trigger('slideInLeft', [
    transition(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 }),
      animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
    ])
  ]);

  // Slide In From Right
  static slideInRight = trigger('slideInRight', [
    transition(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
    ])
  ]);

  // Slide In From Top
  static slideInTop = trigger('slideInTop', [
    transition(':enter', [
      style({ transform: 'translateY(-100%)', opacity: 0 }),
      animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ])
  ]);

  // Slide In From Bottom
  static slideInBottom = trigger('slideInBottom', [
    transition(':enter', [
      style({ transform: 'translateY(100%)', opacity: 0 }),
      animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ])
  ]);

  // Scale In Animation
  static scaleIn = trigger('scaleIn', [
    transition(':enter', [
      style({ transform: 'scale(0)', opacity: 0 }),
      animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
    ])
  ]);

  // Bounce In Animation
  static bounceIn = trigger('bounceIn', [
    transition(':enter', [
      animate('600ms ease-in', keyframes([
        style({ transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0, offset: 0 }),
        style({ transform: 'scale3d(1.1, 1.1, 1.1)', opacity: 1, offset: 0.2 }),
        style({ transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.4 }),
        style({ transform: 'scale3d(1.03, 1.03, 1.03)', offset: 0.6 }),
        style({ transform: 'scale3d(0.97, 0.97, 0.97)', offset: 0.8 }),
        style({ transform: 'scale3d(1, 1, 1)', offset: 1 })
      ]))
    ])
  ]);

  // Flip In Animation
  static flipIn = trigger('flipIn', [
    transition(':enter', [
      style({ transform: 'perspective(400px) rotateY(90deg)', opacity: 0 }),
      animate('400ms ease-in', style({ transform: 'perspective(400px) rotateY(0deg)', opacity: 1 }))
    ])
  ]);

  // Stagger Animation for Lists
  static staggerIn = trigger('staggerIn', [
    transition('* => *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        stagger('100ms', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
        ])
      ], { optional: true })
    ])
  ]);

  // Button Hover Animation
  static buttonHover = trigger('buttonHover', [
    state('normal', style({ transform: 'scale(1)' })),
    state('hovered', style({ transform: 'scale(1.05)' })),
    transition('normal <=> hovered', animate('200ms ease-in-out'))
  ]);

  // Card Float Animation
  static cardFloat = trigger('cardFloat', [
    state('normal', style({ transform: 'translateY(0px)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' })),
    state('floating', style({ transform: 'translateY(-5px)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' })),
    transition('normal <=> floating', animate('300ms ease-in-out'))
  ]);

  // Loading Spinner Animation
  static spinner = trigger('spinner', [
    transition('* => *', [
      animate('1s linear', keyframes([
        style({ transform: 'rotate(0deg)', offset: 0 }),
        style({ transform: 'rotate(360deg)', offset: 1 })
      ]))
    ])
  ]);

  // Shake Animation for Errors
  static shake = trigger('shake', [
    transition('* => *', [
      animate('600ms ease-in-out', keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-10px)', offset: 0.1 }),
        style({ transform: 'translateX(10px)', offset: 0.2 }),
        style({ transform: 'translateX(-10px)', offset: 0.3 }),
        style({ transform: 'translateX(10px)', offset: 0.4 }),
        style({ transform: 'translateX(-10px)', offset: 0.5 }),
        style({ transform: 'translateX(10px)', offset: 0.6 }),
        style({ transform: 'translateX(-10px)', offset: 0.7 }),
        style({ transform: 'translateX(10px)', offset: 0.8 }),
        style({ transform: 'translateX(-10px)', offset: 0.9 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ]))
    ])
  ]);

  // Page Transition Animation
  static pageTransition = trigger('pageTransition', [
    transition('* <=> *', [
      group([
        query(':enter', [
          style({ transform: 'translateX(100%)', opacity: 0 }),
          animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
        ], { optional: true }),
        query(':leave', [
          animate('400ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
        ], { optional: true })
      ])
    ])
  ]);

  constructor() { }
}