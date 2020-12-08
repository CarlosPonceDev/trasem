export class Upload {

  $key       : string;
  file       : File;
  name       : string;
  url        : string;
  progress   : number;
  created_at : Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
  
}
