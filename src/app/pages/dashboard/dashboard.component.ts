import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private route: ActivatedRoute,
        private router: Router,private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        if (!this.authenticationService.currentUserValue) { 
            this.router.navigate(['login']);
        }
    }
  ngOnInit() {
  }

}
