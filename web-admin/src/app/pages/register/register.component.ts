import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { routes } from 'src/app/utilities/routes';
import { SignInTypes } from 'src/app/utilities/sign-in-types.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  routes = routes;
  loading = false;
  
  user: User;
  authUser: User;
  registerForm: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private router: Router,
    private dbService: DatabaseService,
    private authenticationService: AuthenticationService) { 
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
      .then(e => console.log(e))
    this.loading = false;
  }
}
