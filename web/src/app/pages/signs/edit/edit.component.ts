import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';

import { Sign } from 'src/app/classes/sign';
import { STATES } from 'src/app/utilities/states';
import { Upload } from 'src/app/classes/upload';
import { routes } from 'src/app/utilities/routes';
import { UploadService } from 'src/app/services/upload.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  
  STATES = STATES;
  routes = routes;

  id: string;
  sign: Sign;
  currentUpload: Upload;
  selectedFile: File;
  imageSrc: string;
  loading = false;

  editSignsForm: FormGroup;
  mCategories = new Array<any>();
  statesFC = new FormControl();
  config = new MatSnackBarConfig();

  constructor(
    private dbService: DatabaseService,
    private uploadService: UploadService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _activatedroute: ActivatedRoute,
  ) {
    this.sign = new Sign();
  }

  ngOnInit(): void {
    this.id = this._activatedroute.snapshot.paramMap.get('id');
    this.editSignsForm = new FormGroup({
      name: new FormControl(this.sign.name, [Validators.required]),
      description: new FormControl(this.sign.description, []),
      category: new FormControl(this.sign.category, [Validators.required]),
    });
    // Event that is fired when the file is uploaded
    this.uploadService.uploadBSubject.subscribe(isUploaded => {
      if (isUploaded) {
        this.sign.image_url = this.currentUpload.url;
        this.store();
        // Emmits "false" to avoid multiple file uploads
        this.uploadService.uploadBSubject.next(false);
      }
    });
    this.dbService.dbFS
    .collection(this.dbService.collections.signs)
    .doc(this.id)
    .onSnapshot(snapshop => {
      Object.assign(this.sign, snapshop.data());
      this.imageSrc = this.sign.image_url;
      this.editSignsForm.patchValue({
        name: snapshop.data().name, 
        description: snapshop.data().description, 
        category: snapshop.data().category,
      });
      this.statesFC.setValue(this.sign.states);
    });
    this.dbService.dbFS
    .collection(this.dbService.collections.categories)
    .onSnapshot(snapshop => {
      snapshop.forEach(category => {
        this.mCategories.push(category.data().title);
      });
    });
  }

  get formValidation(){
    return this.editSignsForm.controls;
  }
   
  onFileChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.editSignsForm.patchValue({
          fileSource: reader.result
        });
      };
      this.selectedFile = event.target.files.item(0);
    }
  }
   
  // When you click "Save" button
  uploadFile() {
    this.loading = true;
    if (this.selectedFile === undefined) {
      this.store();
    } else {
      this.currentUpload = new Upload(this.selectedFile);
      this.uploadService.pushUpload(this.currentUpload);
    }
  }

  store() {
    if (this.selectedFile !== undefined) {
      this.sign.image_url = this.currentUpload.url;
    }
    this.sign.name = capitalizeFirstLetter(this.editSignsForm.value.name);
    this.sign.category = this.editSignsForm.value.category;
    this.sign.description = capitalizeFirstLetter(this.editSignsForm.value.description);
    this.sign.states = this.statesFC.value;
    this.dbService
      .dbFS
      .collection(this.dbService.collections.signs)
      .doc(this.id)
      .update(Object.assign({}, this.sign))
      .then(() => {
        this.loading = false;
        this.config.panelClass = ['success'];
        this.config.duration = 2000;
        this._snackBar.open('Seña editada con éxito', '', this.config);
      })
      .catch(e => {
        this.config.panelClass = ['error'];
        this.config.duration = 2000;
        this._snackBar.open('Por favor, vuelva a intentarlo más tarde', '', this.config);
      })
      .finally(() => {
        this.router.navigate(['/signs']);
      })
  }

}

/** Builds and returns a capitalize first letter */
function capitalizeFirstLetter(text: string): string {
  if (text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  } else {
    return "";
  }
}
