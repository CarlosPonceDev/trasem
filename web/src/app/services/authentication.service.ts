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
  authUserBSubject: BehaviorSubject<User>;

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
            ) {
              this.mAuth = user;
              this.authUser = new User();
              Object.assign(this.authUser, it.data());
              this.authUser.uid = it.id;
            } else {
              this.mAuth = null;
              this.authUser = null;
            }
            this.authUserBSubject.next(this.authUser);
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
        this.router.navigate(['/categories']);
        return true;
      }).catch(error => false);
    }
  }

  singInWithEmail(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(result => {
      this.fnCheckUser();
    });
  }

  register(email: string, password: string): Promise<firebase.auth.UserCredential>{
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  sign_out() {
    firebase.auth().signOut().then(value => {
      this.authUser = null;
      this.authUserBSubject.next(this.authUser);
      this.router.navigate([routes.home]);
    }).catch(error => {
      console.error('Error de logout: ', error);
    });
  }
}
