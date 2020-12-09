import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import firebase from "firebase";

import { User } from '../classes/user';
import { DatabaseService } from './database.service';
import { SignInTypes } from 'src/app/utilities/sign-in-types.enum';
import { routes } from 'src/app/utilities/routes';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  mAuth: firebase.User;
  authUser: User;
  authUserBSubject: BehaviorSubject<any>;

  constructor(
    private dbService: DatabaseService,
    private router: Router,
  ) { 
    this.authUserBSubject = new BehaviorSubject(null);

    if(this.authUser == null) {
      this.fnCheckUser();
    }
  }

  fnCheckUser() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.dbService
          .dbFS
          .collection('users')
          .doc(user.uid)
          .get()
          .then(it => {
            if (
              it !== null
              && it !== undefined
              && it.exists
              && it.get('role') !== undefined
              && it.get('role') === 'admin'
            ) {
              this.mAuth = user;
              this.authUser = new User();
              Object.assign(this.authUser, it.data());
              this.authUser.uid = it.id;
              this.authUserBSubject.next(this.authUser);
            } else {
              this.mAuth = null;
              this.authUser = null;
              this.sign_out(true);
            }
          })
          .catch(e => {
            this.authUserBSubject.next(null);
            this.router.navigate(['/login'], { replaceUrl: true });
          });
      } else {
        this.authUserBSubject.next(null);
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }

  sign_in(signInType: SignInTypes) {
    let provider = null;
    switch (signInType) {
      case SignInTypes.GOOGLE: {
        provider = new firebase.auth.GoogleAuthProvider();
        break;
      }
      case SignInTypes.MICROSOFT: {
        provider = new firebase.auth.OAuthProvider('microsoft.com');
        break;
      }
    }

    if (null != provider) {
      return firebase.auth().signInWithPopup(provider).then(result => {
        this.fnCheckUser();
        //this.router.navigate(['/signs']);
        return true;
      }).catch(error => false);
    }
  }

  singInWithEmail(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(result => {
        this.fnCheckUser();
      }).catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        // alert('Wrong password.');
        console.log('Wrong password.');
      } else {
        // alert(errorMessage);
        console.log(errorMessage);
      }
      console.log(error);
      // document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
  }

  register(email: string, password: string): Promise<firebase.auth.UserCredential>{
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  sign_out(error = false) {
    firebase.auth().signOut().then(value => {
      this.authUser = null;
      if (error) {
        this.authUserBSubject.next('error');
      } else {
        this.authUserBSubject.next(this.authUser);
        this.router.navigate([routes.login]);
      }
    }).catch(error => {
      console.error('Error de logout: ', error);
    });
  }
}
