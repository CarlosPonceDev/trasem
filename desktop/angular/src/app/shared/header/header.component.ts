import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { User } from 'src/app/classes/user';
import { routes } from "src/app/utilities/routes";
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  routes = routes;
  authUser: User;
  authUserSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver, 
    private authenticationService: AuthenticationService
  ) {
    this.authUserSubscription = this.authenticationService.authUserBSubject.subscribe(user => {
      this.authUser = user;
    });
  }

  ngOnInit(): void {
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
  confirmDialog(): void {
    const dialogRef = this.dialog.open(DialogConfirmLogout, {
      width: '400px',
    });
  }

}

@Component({
  selector: 'dialog-confirm-logout',
  templateUrl: 'dialog-confirm-logout.html',
})
export class DialogConfirmLogout {

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmLogout>,
    private authenticationService: AuthenticationService  
  ) {}

  logout() {
    this.authenticationService.sign_out();
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
