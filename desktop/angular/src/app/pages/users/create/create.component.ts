import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

import { User } from 'src/app/classes/user';
import { routes } from 'src/app/utilities/routes';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  routes = routes;
  isAdmin = false;
  loading = false;
  
  user: User;
  authUser: User;
  validateUserForm: FormGroup;
  config = new MatSnackBarConfig();

  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private dbService: DatabaseService,
    private authenticationService: AuthenticationService
  ) { 
    this.user = new User();
  }

  ngOnInit(): void {
    this.validateUserForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, this.passwordConfirming);
  }

  get formValidation(){
    return this.validateUserForm.controls;
  }

  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return {invalid: true};
    }
  }

  onSubmit() {
    this.loading = true;
    if(this.isAdmin){
      this.user.role = 'admin';
    } else {
      this.user.role = 'user';
    }
    this.user.name = this.validateUserForm.value.name;
    this.user.email = this.validateUserForm.value.email;
    this.user.password = this.validateUserForm.value.password;

    this.authenticationService
      .register(this.formValidation.email.value, this.formValidation.password.value)
      .then(data => {
        this.dbService
          .dbFS
          .collection(this.dbService.collections.users)
          .doc(data.user.uid)
          .set(Object.assign({}, this.user),{merge: true})
          .then(result => {
            console.log('User saved successfully');
          })
          .catch(e =>{
            console.log('Error saving data');
          });
        this.loading = false;
        this.config.panelClass = ['success'];
        this.config.duration = 2000;
        this._snackBar.open('Usuario creado con éxito', '', this.config);
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          this.config.panelClass = ['error'];
          this.config.duration = 3000;
          this._snackBar.open('La contraseña debe tener al menos 8 caracteres', '', this.config);
        } else if (errorCode == 'auth/email-already-in-use') {
          this.config.panelClass = ['error'];
          this.config.duration = 5000;
          this._snackBar.open('La dirección de correo electrónico ya está siendo utilizada por otra cuenta.', '', this.config);
        }
      }).finally(() => {
        this.router.navigate(['/users']);
      });
  }

}
