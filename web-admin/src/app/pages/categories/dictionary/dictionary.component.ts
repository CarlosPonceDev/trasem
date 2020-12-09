import { Component, OnInit  } from '@angular/core';
import { routes } from 'src/app/utilities/routes';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { Sign } from 'src/app/classes/sign';

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit  {

  routes = routes;
  searchText = '';

  signs: Sign;
  category: string;
  isEmpty: boolean;
  mSigns = new Array<any>();

  constructor(
    private dbService: DatabaseService, 
    private _activatedroute: ActivatedRoute
  ) { 
    this.signs = new Sign();
  }

  ngOnInit(): void {
    
    this.category = this._activatedroute.snapshot.paramMap.get('category');
    
    this.dbService.dbFS
      .collection(this.dbService.collections.signs)
      .where("category", "==", this.category)
      .onSnapshot(snapshop => {
        snapshop.forEach(sign => {
          let data = sign.data();
          data.id = sign.id;
          data.category = data.category ?? 'N/A';
          data.image_url = data.image_url === "" ? 'assets/img/not-found.png' : data.image_url;
          this.mSigns.push(data);
        });
        if (this.mSigns.length > 0) {
          this.isEmpty = false;
        } else {
          this.isEmpty = true;
        }
      });
  }
}
