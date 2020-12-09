import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from 'src/app/classes/user';
import { routes } from "src/app/utilities/routes";
import { DatabaseService } from 'src/app/services/database.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  routes = routes;
  authUser: User;
  mCategories = new Array<any>();
  authUserSubscription: Subscription;

  constructor(
    private dbService: DatabaseService,
    private authenticationService: AuthenticationService
  ) { 
    // Este es un ejemplo de un BehaviorSubject
    // Saber más: https://www.youtube.com/watch?v=_q-HL9YX_pk
    this.authUserSubscription = this.authenticationService.authUserBSubject.subscribe(user => {
      this.authUser = user;
    });
  }

  ngOnInit(): void {

    this.dbService.dbFS.collection(this.dbService.collections.categories).onSnapshot(snapshop => {
      snapshop.forEach(region => {
        this.mCategories.push(region.data());
      });
    });

  }

  // Este puede ir donde séa, lo puse aquí para el ejemplo
  logout() {
    this.authenticationService.sign_out();
  }

}
