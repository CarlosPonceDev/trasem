import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  // Learn more: https://blog.angular-university.io/angular-material-dialog/

  constructor(
    private dialog: MatDialogRef<ConfirmDialogComponent>,
  ) { }

  ngOnInit(): void {
  }
  
  close() {
    this.dialog.close();
  }

  delete() {
    this.dialog.close(true);
  }

}
