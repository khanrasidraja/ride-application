import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Service/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { GoogleAuthService, GoogleUser } from '../../Service/google-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.8s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query('.form-group', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private readonly _api: ApiService, 
    private readonly _router: Router, 
    private readonly formBuilder: FormBuilder, 
    private readonly toastr: ToastrService,
    private readonly googleAuthService: GoogleAuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this._api.loginUser({ email, password }).subscribe({
       next: (res: any) => {
        const token = res.token;
          sessionStorage.setItem('token', token);
          localStorage.setItem("token",res.token)
          this.loginForm.reset();
          this.toastr.success(res.message, 'Success');
          this.isLoading = false;
          this._router.navigate(['/app/dashboard']);
        },
       error: (error) => {
         console.log(error);
         this.isLoading = false;
         this.toastr.error(error.error.message);
        }
      }
      );
    } else {
      this.toastr.warning('All Fields are required.');
    }
  }

  /**
   * Handle Google Sign-in
   */
  onGoogleLogin(): void {
    this.isLoading = true;
    
    this.googleAuthService.signInWithGoogleButton()
      .then((googleUser: GoogleUser) => {
        console.log('Google user:', googleUser);
        
        // Send Google user data to your backend for verification/registration
        this._api.googleLogin({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          googleId: googleUser.sub
        }).subscribe({
          next: (res: any) => {
            const token = res.token;
            sessionStorage.setItem('token', token);
            localStorage.setItem('token', res.token);
            this.toastr.success('Google login successful!', 'Success');
            this.isLoading = false;
            this._router.navigate(['/app/dashboard']);
          },
          error: (error: any) => {
            console.error('Google login error:', error);
            this.isLoading = false;
            // If backend doesn't have Google login endpoint, show a message
            this.toastr.info('Google login feature is being set up. Please use email/password for now.', 'Info');
          }
        });
      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        this.isLoading = false;
        this.toastr.error('Google sign-in failed. Please try again.', 'Error');
      });
  }

  /**
   * Handle Apple Sign-in (placeholder)
   */
  onAppleLogin(): void {
    this.toastr.info('Apple Sign-in is coming soon!', 'Info');
  }

  

}


