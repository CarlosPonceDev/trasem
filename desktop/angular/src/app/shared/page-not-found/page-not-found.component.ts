import { Component, OnInit } from '@angular/core';
import { routes } from "src/app/utilities/routes";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  routes = routes;

  constructor() { }

  ngOnInit(): void {
  }

}
