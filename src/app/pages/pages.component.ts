import { Component } from '@angular/core';
import { Router } from '@angular/router';


import { ApiService } from '../services/api.service';

@Component({
  selector: 'pages-root',
  templateUrl: './pages.component.html'
})


export class PagesComponent {
    currentUser: any;

    constructor(
        private router: Router,
        private dataservice: ApiService
    ) {
        //this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.currentUser = dataservice.currentLoggedInUser;
        console.log("Current User"+ this.currentUser);
    }

    logout() {
        //this.authenticationService.logout();
        this.currentUser = null;
        this.router.navigate(['/login']);
    }
}
