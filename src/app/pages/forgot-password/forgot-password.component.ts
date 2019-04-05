import { ApiService } from "../../services/api.service";
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
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public form: FormGroup;
  public formOTP: FormGroup;
  public otp: any;
  public sub: any;
  public token: any;
  public securityQuestionsList: any;
  public retryConfig = 3;
  public retries: number;
  public retriesRemaining: number;
  public errorMessage: any = "SHOWERROR";
  public fsubmitted = false;
  public fsubmittedwitherrors = false;
  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataService: ApiService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) {
    this.router = router;
    this.authenticationService.logout();
    this.form = fb.group({
      userName: ["", Validators.compose([Validators.required])],
      securityQuestion: ["", Validators.compose([Validators.required])],
      securityQuestionAnswer: ["", Validators.compose([Validators.required])]
    });
    this.retriesRemaining = 0;
    // read

    this.securityQuestionsList = [
      {
        id: "childhood_nickname",
        question: "What was your childhood nickname?"
      },
      {
        id: "city_or_town_born",
        question: "In what city or town where you born?"
      },
      {
        id: "middlename_of_best_friend",
        question: "What is the middle name of your best friend?"
      },
      {
        id: "grandma_maiden_name",
        question: "What is your grandmother's maiden name?"
      },
      {
        id: "name_of_primary_school",
        question: "What was the name of your elementary or primary school?"
      }
    ];

    this.route.queryParams.subscribe(params => {
      this.token = params;
    });
  }

  public forgotPass() {
    this.fsubmitted = false;
    this.fsubmittedwitherrors = false;
  }

  public login() {
    this.router.navigate(["login"]);
  }

  public onSubmit(form: FormGroup) {
    if (this.form.valid) {
      this.blockUI.start("Submitting Forgot Password");
      this.errorMessage = "SHOWERROR";
      const postdata = {
        email: form.value.userName,
        security_question: form.value.securityQuestion,
        security_answer: form.value.securityQuestionAnswer
      };

      this.dataService.forgotpassword(postdata).subscribe(
        data => {
          if (data.status === 200) {
            // this.toastrService.success(data.message);
            this.router.navigate(["login"]);
            this.blockUI.stop();
            this.toastrService.success(
              "Request submitted successfully, You will receive an email with instructions"
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
