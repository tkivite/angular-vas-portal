import { ApiService } from "../../../services/api.service";
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
  selector: "app-pickup",
  templateUrl: "./pickup.component.html",
  styleUrls: ["./pickup.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class StaffPickupComponent {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public pickupForm: FormGroup;
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
  public rsubmitted = false;
  public fsubmittedwitherrors = false;
  public userMobileNumber;
  public customerItems;
  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataService: ApiService,
    private route: ActivatedRoute
  ) {
    this.router = router;
    this.pickupForm = fb.group({
      idNumber: ["", Validators.compose([Validators.required])],
      verificationCode: ["", Validators.compose([Validators.required])]
    });
    this.retriesRemaining = 0;

    this.route.queryParams.subscribe(params => {
      this.token = params;
    });
  }

  public forgotPass() {
    this.fsubmitted = false;
    this.rsubmitted = false;
    this.fsubmittedwitherrors = false;
  }

  public login() {
    this.router.navigate(["login"]);
  }

  public onSubmit(form: FormGroup) {
    if (form.valid) {
      this.blockUI.start("Submitting Forgot Password");
      this.errorMessage = "SHOWERROR";
      const postdata = {
        email: form.value.idNumber,
        pin: form.value.verificationCode
      };

      this.dataService.forgotpassword(postdata).subscribe(
        data => {
          if (data.status === 200) {
            // this.toastrService.success(data.message);
            //this.router.navigate(["login"]);
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

  getVerificationCode(form: FormGroup) {
    if (form.value.idNumber) {
      this.blockUI.start("Requesting verification code");
      const postdata = {
        id_number: form.value.idNumber
      };

      this.dataService.fetchstaffverificationCode(postdata).subscribe(
        data => {
          console.log(data);
          if (data.status === 200) {
            this.userMobileNumber = data.body.mobile;
            this.customerItems = data.body.sales;
            this.blockUI.stop();
            this.toastrService.success(
              "A text message with verification code has been sent to " +
                this.userMobileNumber
            );
            this.rsubmitted = true;
            this.fsubmittedwitherrors = false;
          } else {
            // this.toastrService.error(data.message);
            this.fsubmittedwitherrors = true;
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
              "We could not find an item for that id number "
            );
            this.fsubmittedwitherrors = true;
          } else {
            this.fsubmittedwitherrors = true;
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
