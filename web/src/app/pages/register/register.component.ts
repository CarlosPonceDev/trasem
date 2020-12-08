import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { User } from 'src/app/classes/user';
import { routes } from 'src/app/utilities/routes';
import { SignInTypes } from 'src/app/utilities/sign-in-types.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  routes = routes;
  loading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  
  user: User;
  authUser: User;
  registerForm: FormGroup;
  config = new MatSnackBarConfig();

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) { 
    this.user = new User();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, this.passwordConfirming)
  }

  get formValidation(){
    return this.registerForm.controls;
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return {invalid: true};
    }
  }

  loginWithGoogle() {
    this.signIn(SignInTypes.GOOGLE);
  }

  signIn(signInType: SignInTypes) {
    this.authenticationService.sign_in(signInType);
  }

  register() {
    this.loading = true;
    this.user.role = 'user';
    this.user.name = this.registerForm.value.name;
    this.user.email = this.registerForm.value.email;
    this.user.password = this.registerForm.value.password;

    this.authenticationService.register(this.formValidation.email.value, this.formValidation.password.value)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        var errorCode = error.code;
        // console.log(errorCode);
        if (errorCode == 'auth/email-already-in-use') {
          this.config.panelClass = ['error'];
          this.config.duration = 3000;
          this._snackBar.open('Este correo ya se encuentra ocupado', '', this.config);
        } else {
          this.config.panelClass = ['error'];
          this.config.duration = 2000;
          this._snackBar.open('Por favor, vuelva a intentarlo más tarde', '', this.config);
        }
      });
    this.loading = false;
  }
}
