import { Component, OnInit, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DatabaseService } from 'src/app/services/database.service';

export interface DialogData {
  name: string;
}
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  mUser: User;
  config = new MatSnackBarConfig();

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private mAuthService: AuthenticationService,
    private dbService: DatabaseService,
    private router: Router,
  ) { 
    this.mUser = new User();
    this.mAuthService.authUserBSubject.subscribe(user => {
      if (user) {
        this.mUser = user;
      }
    });
  }

  ngOnInit(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogEditEmail, {
      width: '400px',
      data: { name: this.mUser.name }
    });

    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.mUser.name = name;
        this.dbService
          .dbFS
          .collection(this.dbService.collections.users)
          .doc(this.mUser.uid)
          .set({
            name: this.mUser.name
          }, {merge: true})
          .then(result => {
            this.mAuthService
              .mAuth
              .updateProfile({
                displayName: this.mUser.name,
                photoURL: ""
              })
              .then(() => {
                this.config.panelClass = ['success'];
                this.config.duration = 2000;
                this._snackBar.open('Nombre editado con éxito', '', this.config);
              })
              .catch(e => {
                this.config.panelClass = ['error'];
                this.config.duration = 2000;
                this._snackBar.open('Por favor, vuelva a intentarlo más tarde', '', this.config);
              });
          })
      }
    });
  }

  openPasswordDialog(): void {
    const dialogRef = this.dialog.open(DialogEditPassword, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(password => {
      if (password) {
        this.mAuthService
          .mAuth
          .updatePassword(password)
          .then(() => {
            this.config.panelClass = ['success'];
            this.config.duration = 2000;
            this._snackBar.open('Contraseña editada con éxito', '', this.config);
          })
          .catch(error => {
            var errorCode = error.code;
            if (errorCode == 'auth/weak-password') {
              this.config.panelClass = ['error'];
              this.config.duration = 3000;
              this._snackBar.open('La contraseña debe tener al menos 8 caracteres', '', this.config);
            } else {
              this.config.panelClass = ['error'];
              this.config.duration = 2000;
              this._snackBar.open('Por favor, vuelva a intentarlo más tarde', '', this.config);
            }
          });
      }
    });
  }

}

@Component({
  selector: 'dialog-edit-email',
  templateUrl: 'dialog-edit-email.html',
})
export class DialogEditEmail {

  name: string;

  constructor(
    public dialogRef: MatDialogRef<DialogEditEmail>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.name = this.data.name;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.name);
  }

}

@Component({
  selector: 'dialog-edit-password',
  templateUrl: 'dialog-edit-password.html',
})
export class DialogEditPassword {

  password: string;
  hidePassword = true;

  constructor(
    public dialogRef: MatDialogRef<DialogEditPassword>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.password);
  }

}
