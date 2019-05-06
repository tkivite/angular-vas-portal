import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  currentUser: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
    console.log("from app");
  }

  public ngOnInit() {
    $(document).ready(function() {
      $("#sidebarCollapse").on("click", function() {
        $("#sidebar").toggleClass("active");
      });
      $("#letnd").keydown(function(e) {
        var regex = new RegExp("^[a-zA-Z]+$");
        var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);

        console.log(e.keyCode); // check for backspace, delete etc. keyCodes you need

        if (e.keyCode != 8) {
          // e.g: backspace keyCode for Backspace on OS X
          if (!regex.test(key)) {
            e.preventDefault();
            return false;
          }
        }
      });
    });
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }
}
