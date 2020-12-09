import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/utilities/routes';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  routes = routes;
  
  mCategories = new Array<any>();

  constructor(private dbService: DatabaseService) { }

  ngOnInit(): void {

    this.dbService.dbFS.collection(this.dbService.collections.categories).onSnapshot(snapshop => {
      this.mCategories = new Array<any>();
      snapshop.forEach(region => {
        this.mCategories.push(region.data());
      });
    });

  }

}
