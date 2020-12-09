import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProfileRoutingModule } from './my-profile-routing.module';
import { MyProfileComponent } from './my-profile.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DialogEditEmail } from 'src/app/pages/my-profile/my-profile.component';
import { DialogEditPassword } from 'src/app/pages/my-profile/my-profile.component';

@NgModule({
  declarations: [MyProfileComponent, DialogEditEmail, DialogEditPassword],
  imports: [
    CommonModule,
    MyProfileRoutingModule,
    FormsModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [DialogEditEmail, DialogEditPassword],
  bootstrap: [DialogEditEmail, DialogEditPassword],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class MyProfileModule { }
