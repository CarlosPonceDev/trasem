import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { routes } from 'src/app/utilities/routes';
import { SignInTypes } from 'src/app/utilities/sign-in-types.enum';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  hide = true;
  routes = routes;

  authUser: User;
  loading: boolean;
  loginForm: FormGroup;
  config = new MatSnackBarConfig();
  private authUserSubscription: Subscription;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) { 
    this.authUserSubscription = this.authenticationService.authUserBSubject.subscribe(user => {
      if (user) {
        this.router.navigate(['/categories']);
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  ngOnDestroy(): void {
    this.authUserSubscription.unsubscribe();
  }

  loginWithGoogle() {
    this.signIn(SignInTypes.GOOGLE);
  }

  signIn(signInType: SignInTypes) {
    this.authenticationService.sign_in(signInType);
  }
  
  logIn() {
    this.loading = true;
    this.authenticationService.singInWithEmail(this.f.email.value, this.f.password.value)
    .catch(error => {
      var errorCode = error.code;
      // console.log(errorCode);
      if (errorCode == 'auth/user-not-found') {
        this.config.panelClass = ['error'];
        this.config.duration = 3000;
        this._snackBar.open('Usuario no encontrado', '', this.config);
      } else if (errorCode == 'auth/wrong-password') {
        this.config.panelClass = ['error'];
        this.config.duration = 3000;
        this._snackBar.open('Contraseña incorrecta', '', this.config);
      } else {
        this.config.panelClass = ['error'];
        this.config.duration = 2000;
        this._snackBar.open('Por favor, vuelva a intentarlo más tarde', '', this.config);
      }
    });
    this.loading = false;
  }

}
