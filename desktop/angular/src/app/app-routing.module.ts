import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: AppComponent, children: [
    { path: '', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) }, 
  ]},
  { path: '', loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
