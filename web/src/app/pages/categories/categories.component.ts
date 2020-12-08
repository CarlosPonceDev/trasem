import { Component, OnInit } from '@angular/core';

import { routes } from 'src/app/utilities/routes';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  routes = routes;

  constructor() { }

  ngOnInit(): void {
  }

}
