import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/utilities/routes';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.scss']
})
export class PracticeComponent implements OnInit {

  routes = routes;

  constructor() { }

  ngOnInit(): void {
  }

}
