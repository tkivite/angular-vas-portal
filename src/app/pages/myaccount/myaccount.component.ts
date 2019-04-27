import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: "app-myaccount",
  templateUrl: "./myaccount.component.html",
  styleUrls: ["./myaccount.component.css"]
})
export class MyaccountComponent implements OnInit {
  useraccount: any;
  store: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => ((this.useraccount = x.user), (this.store = x.store))
    );
  }

  ngOnInit() {}
}
