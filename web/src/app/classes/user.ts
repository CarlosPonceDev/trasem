import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class User {
  uid         : string;
  name        : string;
  email       : string;
  password    : string;
  photo_url   : string;
  uid_guante  : string;
  uid_region  : string;
  role        : string;
  favorites   : object;
  created_at  : Timestamp;
  updated_at  : Timestamp;

  constructor() {
    this.uid        = "";
    this.name       = "";
    this.email      = "";
    this.photo_url  = "";
    this.uid_guante = "";
    this.uid_region = "";
    this.role       = "";
    this.favorites  = null;
    this.created_at = null;
    this.updated_at = null;
  }

}