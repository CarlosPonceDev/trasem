import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponent } from './shared.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SharedRoutingModule } from './shared-routing.module';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DialogConfirmLogout } from 'src/app/shared/header/header.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EmptyResultComponent } from './empty-result/empty-result.component';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
@NgModule({
  declarations: [
    SharedComponent, 
    HeaderComponent, 
    FooterComponent,
    DialogConfirmLogout,
    ConfirmDialogComponent,
    EmptyResultComponent,
    FilterPipe,
    ProgressSpinnerComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    EmptyResultComponent,
    FilterPipe,
    ProgressSpinnerComponent
  ],
  entryComponents: [DialogConfirmLogout],
  bootstrap: [DialogConfirmLogout],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class SharedModule { }
