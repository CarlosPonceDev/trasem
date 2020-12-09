import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
export class Suggestion {

  $key        : string;
  name        : string;
  states      : object;
  category    : string;
  image_url   : string;
  description : string;
  created_at  : Timestamp;
  updated_at  : Timestamp;

  constructor() {
    this.name        = "";
    this.category    = "";
    this.image_url   = "";
    this.description = "";
    this.states      = null;
    this.created_at  = null;
    this.updated_at  = null;
  }

  reset() {
    this.name        = "";
    this.image_url   = "";
    this.description = "";
    this.states      = null;
    this.created_at  = null;
    this.updated_at  = null;
  }
  
}
