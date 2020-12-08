import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // Database
  dbFS: firebase.firestore.Firestore;

  // Firebase
  storageRef: any;
  
  collections = {
    users       : 'users',
    signs       : 'signs',
    regions     : 'regions',
    categories  : 'categories',
    gloves      : 'gloves',
    suggestions : 'suggestions',
    history     : 'history'
  }

  constructor() { 
    if (this.dbFS == null) {
      firebase.initializeApp(environment.firebaseConfig);
      this.dbFS = firebase.firestore();
      this.storageRef = firebase.storage().ref();
    }
  }
}
