import { AuthenticationService } from "../../services/authentication.service";
import { Component, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public form: FormGroup;
  public formOTP: FormGroup;
  public webApiBaseUrl: string;
  public otp: any;
  public sub: any;
  public token: any;
  public passwordList: any = [];
  public securityQuestionsList: any;
  public retries: number;
  public retriesRemaining: number;
  public fsubmitted = false;
  public fsubmittedwitherrors = false;
  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.router = router;
    this.authenticationService.logout();
    localStorage.removeItem("currentUser");

    //const passpattern = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[d]){1,})(?=(.*[W]){1,})(?!.*s).{8,}$/;
    // "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$";

    this.form = fb.group(
      {
        passwordRepeat: ["", Validators.compose([Validators.required])],
        password: [
          "",
          Validators.compose([
            Validators.required,
            // 2. check whether the entered password has a number
            Validators.pattern(/\d/),
            // 3. check whether the entered password has upper case letter
            Validators.pattern(/[A-Z]/),
            // 4. check whether the entered password has a lower-case letter
            Validators.pattern(/[a-z]/),
            // 5. check whether the entered password has a special character
            // 6. Has a minimum length of 8 characters
            Validators.minLength(8),
            Validators.maxLength(20)
          ])
        ]
      },
      { validator: matchingPasswords("password", "passwordRepeat") }
    );
    this.retriesRemaining = 0;

    // get password Policy

    this.route.queryParams.subscribe(params => {
      this.token = params;
      // this.blockUI.start('Processing');
      const postdata = {
        token: this.token.token
      };
    });
  }

  public onPasswordStrengthChanged(strength) {
    console.log("====================================");
    console.log("onPasswordStrengthChanged", strength);
    console.log("====================================");
  }
  get password() {
    return this.form.get("password");
  }
  public onSubmit(form: FormGroup) {
    if (this.form.valid) {
      this.blockUI.start("Changing Password");
      const postdata = {
        token: this.token.token,
        passwordRepeat: form.value.passwordRepeat,
        new_password: form.value.password
      };

      this.authenticationService.changepassword(postdata).subscribe(
        data => {
          if (data.status === 200) {
            // this.toastrService.success(data.message);
            this.router.navigate(["login"]);
            this.blockUI.stop();
            this.toastrService.success(
              "Request to change password was successfull"
            );
            this.fsubmitted = true;
          } else {
            // this.toastrService.error(data.message);
            this.blockUI.stop();
            // this.toastrService.error(data.message);
            this.toastrService.error("There was a problem posting the request");
          }
        },
        err => {
          console.log(
            "Something Went Wrong, We could not complete the request"
          );
          console.log(err);
          this.blockUI.stop();

          if (err.status === 404) {
            // this.toastrService.error(data.message);
            this.blockUI.stop();
            // this.toastrService.error(data.message);
            this.toastrService.error(
              "We could not find a user with search credentials"
            );
            this.fsubmittedwitherrors = true;
          } else {
            this.toastrService.error(
              "Something Went Wrong, We could not complete the request"
            );
          }
        }
      );
    } else {
      // console.log(form.errors);
      const invalid = [];
      const controls = form.controls;
      console.log(controls);
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
          console.log(name);
        }
      }
    }
  }
}
export function matchingPasswords(
  passwordKey: string,
  passwordConfirmationKey: string
) {
  return (group: FormGroup) => {
    const password = group.controls[passwordKey];
    const passwordConfirmation = group.controls[passwordConfirmationKey];
    if (password.value !== passwordConfirmation.value) {
      return passwordConfirmation.setErrors({ mismatchedPasswords: true });
    }
  };
}

//$2a$10$rEjrp8vG0oBg6yexqE3fKuKI.D/oldsgF5Lke9cbj7Ymtp2/QvEki
