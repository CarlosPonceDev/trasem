import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignsComponent } from './signs.component';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: SignsComponent, children: [
    { path: '', component: IndexComponent },
    { path: 'create', component: CreateComponent },
    { path: 'create/:id', component: CreateComponent },
    { path: 'edit/:id', component: EditComponent },
  ]}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignsRoutingModule { }
