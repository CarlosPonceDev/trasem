import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesComponent } from './categories.component';
import { IndexComponent } from './index/index.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { PracticeComponent } from './practice/practice.component';

const routes: Routes = [
  { path: '', component: CategoriesComponent, children: [
    { path: '', component: IndexComponent },
    { path: 'dictionary/:category', component: DictionaryComponent },
    { path: 'practice', component: PracticeComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
