import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { routes } from 'src/app/utilities/routes';
import { DatabaseService } from 'src/app/services/database.service';
import { MatSnackBar, MatSnackBarConfig  } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface UserData {
  id: string;
  name: string;
  role: string;
}

export interface DialogData {
  role: string;
}
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit  {

  routes = routes;

  role: string;
  isEmpty: boolean;

  mUsers = new Array<any>();
  config = new MatSnackBarConfig();
  dataSource: MatTableDataSource<UserData>;
  displayedColumns: string[] = ['name', 'role', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private dbService: DatabaseService
  ) {  }

  ngOnInit(): void {
    this.dbService.dbFS
    .collection(this.dbService.collections.users)
    .onSnapshot(snapshop => {
      this.mUsers = new Array<any>();
      snapshop.forEach(user => {
        let data = user.data();
        data.id = user.id;
        data.name = user.data().name;
        data.role = user.data().role ?? 'N/A';
        this.mUsers.push(data);
      });
      if (this.mUsers.length > 0) {
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(uid: string, role: string) {
    const dialogRef = this.dialog.open(DialogEditRole, {
      width: '250px',
      data: { role: role }
    });
    dialogRef.afterClosed().subscribe(
      isAdmin => {

        if (isAdmin !== undefined) {
          let role = isAdmin ? 'admin' : 'user';
          this.dbService
            .dbFS
            .collection(this.dbService.collections.users)
            .doc(uid)
            .update({ role: role })
            .then(() => {
              this.config.panelClass = ['success'];
              this.config.duration = 2000;
              this._snackBar.open('Usuario editado con éxito', '', this.config);
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

  delete(uid: string) {
    const dialogRef = this.dialog.open(DialogDeleteUser);

    dialogRef.afterClosed().subscribe(
      isDeleted => {

        if (isDeleted) {
          this.dbService
            .dbFS
            .collection(this.dbService.collections.users)
            .doc(uid)
            .delete()
            .then(() => {
              this.config.panelClass = ['success'];
              this.config.duration = 2000;
              this._snackBar.open('Usuario eliminado con éxito', '', this.config);
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

@Component({
  selector: 'dialog-edit-role',
  templateUrl: 'dialog-edit-role.html',
})
export class DialogEditRole {
  isAdmin: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogEditRole>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if(this.data.role === 'admin') {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  editAsAdmin() {
    this.dialogRef.close(this.isAdmin);
  }

}

@Component({
  selector: 'dialog-delete-user',
  templateUrl: 'dialog-delete-user.html',
})
export class DialogDeleteUser {

  constructor(public dialogRef: MatDialogRef<DialogDeleteUser>) {}

  close(): void {
    this.dialogRef.close();
  }

  delete() {
    this.dialogRef.close(true);
  }
  
}
