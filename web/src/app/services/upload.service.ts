import { Injectable } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Upload } from "../classes/upload";
import * as firebase from "firebase";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath: string = '/uploads';
  private uploadTask: firebase.default.storage.UploadTask;
  public uploadBSubject: BehaviorSubject<Boolean>;

  constructor(private afService: DatabaseService) { 
    this.uploadBSubject = new BehaviorSubject(false);
  }

  pushUpload(upload: Upload) {
    this.uploadTask = this.afService
      .storageRef
      .child(`${this.basePath}/${upload.file.name}`)
      .put(upload.file);

    this.uploadTask.on(firebase.default.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.uploadTask
          .snapshot
          .ref
          .getDownloadURL()
          .then(downloadUrl => {
            upload.url = downloadUrl;
            upload.name = upload.file.name;
            this.uploadBSubject.next(true);
          })
          .catch(e => {
            console.log('error', e);
          });
      }
      )
  }

}
