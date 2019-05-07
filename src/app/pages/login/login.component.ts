import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { AuthenticationService } from "../../services";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dataservice: ApiService,
    public toastrService: ToastrService,
    public alertService: ToastrService,
    private authenticationService: AuthenticationService
  ) {
    //authenticationService.logout();
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["dashboard"]);
      let user = this.authenticationService.currentUserValue;
      this.blockUI.start("Taking you home ....");
      let email = user.user.email;
      let password = user.password;
      this.login(email, password);
      ///  console.log(this.authenticationService.currentUserValue);
    }
  }

  ngOnInit() {
    this.toastrService.warning("Please Login to proceed", "Unauthorised", {
      timeOut: 5000
    });
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.compose([Validators.required])],
      password: ["", Validators.compose([Validators.required])]
    });
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }
  //submit login
  public onSubmit(form: FormGroup) {
    this.blockUI.start("Taking you home ....");

    let email = this.f.username.value;
    let password = this.f.password.value;

    this.login(email, password);
  }

  forgotPass() {
    this.router.navigate(["forgotPassword"]);
  }
  login(email, password) {
    const postFormData = {
      email: email,
      password: password
    };
    this.authenticationService
      .login(postFormData)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          // this.router.navigate([this.returnUrl]);
          this.router.navigate(["dashboard"]);

          // window.location.reload();

          const firstname = data.user.firstname;
          this.blockUI.stop();
          this.toastrService.success(
            "Login Successful",
            "Welcome" + firstname,
            {
              timeOut: 10000
            }
          );
        },
        error => {
          console.log(error);
          this.authenticationService.logout();
          this.blockUI.stop();
          this.toastrService.error(error.statusText, "Login Unsuccessful", {
            timeOut: 10000
          });
        }
      );
  }
}
