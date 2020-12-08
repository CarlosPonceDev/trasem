import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/utilities/routes';
import { DatabaseService } from 'src/app/services/database.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  routes = routes;
  searchText = '';

  isEmpty: boolean;
  mRegions = new Array<any>();
  mCategories = new Array<any>();
  mSuggestions = new Array<any>();
  regionControl = new FormControl();
  categoryControl = new FormControl();
  config = new MatSnackBarConfig();

  constructor(
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dbService: DatabaseService,
  ) { }

  ngOnInit(): void {
    // this.dbService.dbFS
    // .collection(this.dbService.collections.categories)
    // .onSnapshot(snapshop => {
    //   snapshop.forEach(category => {
    //     this.mCategories.push(category.data().title);
    //   });
    // });
    this.dbService.dbFS
    .collection(this.dbService.collections.suggestions)
    .onSnapshot(snapshop => {
      this.mSuggestions = new Array<any>();
      snapshop.forEach(suggestion => {
        let data = suggestion.data();
        data.id = suggestion.id;
        data.category = data.category ?? 'N/A';
        data.image_url = data.image_url === "" ? 'assets/img/not-found.png' : data.image_url;
        this.mSuggestions.push(data);
      });
      if (this.mSuggestions.length > 0) {
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
    });
  }

  delete(uid: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(
      isDeleted => {

        if (isDeleted === true) {
          this.dbService
            .dbFS
            .collection(this.dbService.collections.suggestions)
            .doc(uid)
            .delete()
            .then(() => {
              this.config.panelClass = ['success'];
              this.config.duration = 2000;
              this._snackBar.open('Sugerencia eliminada con éxito', '', this.config);
            })
            .catch(e => {
              this.config.panelClass = ['error'];
              this.config.duration = 2000;
              this._snackBar.open('Por favor, vuelva a intentarlo más tarde', '', this.config);
            });
        }
      }
    );
  }

}