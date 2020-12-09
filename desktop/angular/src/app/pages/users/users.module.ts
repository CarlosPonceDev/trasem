import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersComponent } from './users.component';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DialogEditRole } from 'src/app/pages/users/index/index.component';
import { DialogDeleteUser } from 'src/app/pages/users/index/index.component';

import { getDutchPaginatorIntl } from 'src/app/pages/users/index/dutch-paginator-intl';

@NgModule({
  declarations: [UsersComponent, IndexComponent, CreateComponent, DialogEditRole, DialogDeleteUser],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [DialogEditRole, DialogDeleteUser],
  bootstrap: [DialogEditRole, DialogDeleteUser],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
  ]
})
export class UsersModule { }
