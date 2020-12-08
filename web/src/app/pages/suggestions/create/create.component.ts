import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';

import { Upload } from 'src/app/classes/upload';
import { STATES } from 'src/app/utilities/states';
import { routes } from 'src/app/utilities/routes';
import { Suggestion } from 'src/app/classes/suggestion';
import { UploadService } from 'src/app/services/upload.service';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  STATES = STATES;
  routes = routes;
  loading = false;

  imageSrc: string;
  selectedFile: File;
  currentUpload: Upload;
  suggestion: Suggestion;
  suggestionForm: FormGroup;
  statesFC = new FormControl();
  mCategories = new Array<any>();
  config = new MatSnackBarConfig();
  
  constructor(
    private router: Router,
    private dbService: DatabaseService, 
    private uploadService: UploadService,
    private _snackBar: MatSnackBar
  ) {
    this.suggestion = new Suggestion();
  }

  ngOnInit(): void {
    this.suggestionForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(),
      category: new FormControl(),
      file: new FormControl(),
      fileSource: new FormControl()
    });
    this.dbService.dbFS
      .collection(this.dbService.collections.categories)
      .onSnapshot(snapshop => {
        snapshop.forEach(category => {
          this.mCategories.push(category.data().name);
        });
      });
    // Event that is fired when the file is uploaded
    this.uploadService.uploadBSubject.subscribe(isUploaded => {
      if (isUploaded) {
        this.store();
        // Emmits "false" to avoid multiple file uploads
        this.uploadService.uploadBSubject.next(false);
      }
    });
  }
  
  get formValidation(){
    return this.suggestionForm.controls;
  }
   
  onFileChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.suggestionForm.patchValue({
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
      this.suggestion.image_url = this.currentUpload.url;
    } 
    this.suggestion.category = this.suggestionForm.value.category;
    this.suggestion.name = capitalizeFirstLetter(this.suggestionForm.value.name);
    this.suggestion.description = capitalizeFirstLetter(this.suggestionForm.value.description);
    this.suggestion.states = this.statesFC.value;

    this.dbService
      .dbFS
      .collection(this.dbService.collections.suggestions)
      .add(Object.assign({}, this.suggestion))
      .then(() => {
        this.loading = false;
        this.config.panelClass = ['success'];
        this.config.duration = 2000;
        this._snackBar.open('Sugerencia enviada con éxito', '', this.config);
      })
      .catch(e => {
        console.log(e);
        this.config.panelClass = ['error'];
        this.config.duration = 2000;
        this._snackBar.open('Por favor, vuelva a intentarlo más tarde', '', this.config);
      })
      .finally(() => {
        this.router.navigate(['/categories']);
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