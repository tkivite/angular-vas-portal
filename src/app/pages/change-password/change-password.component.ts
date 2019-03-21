//import { BackendService } from './../../services/backend.service';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
//import { ConfigService } from './../../services/config.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
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
  //public retryConfig: number = this.configService.getConfiguration().otpRetries;
  public retries: number;
  public retriesRemaining: number;
  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
   // public dataService: BackendService,
    public http: Http,
    //public configService: ConfigService,
    private route: ActivatedRoute
  ) {
    this.router = router;
    this.form = fb.group(
      {
        newPasswordRepeat: ['', Validators.compose([Validators.required])],
        newPassword: [
          '',
          Validators.compose([
            Validators.required, Validators.minLength(6)
          ])
        ],
        securityQuestion: ['', Validators.compose([Validators.required])],
        temporaryPassword: ['', Validators.compose([Validators.required])],
        securityQuestionAnswer: ['', Validators.compose([Validators.required])]
      },
      { validator: matchingPasswords('newPassword', 'newPasswordRepeat') }
    );
    this.retriesRemaining = 0;
   
    // read
    this.securityQuestionsList = [];
    // get password Policy
  
    this.route.queryParams.subscribe(params => {
      this.token = params;
      this.blockUI.start('Processing');
      const postdata = {
        token: this.token.token
      };

      //check token

      /*this.http
        .post(this.webApiBaseUrl + 'user/firstTimeLoginTokenCheck', postdata)
        .toPromise()
        .then(rs => {
          this.blockUI.stop();
          const data = rs.json();
          if (data['responseCode'] === '00') {
            if (data['entity'].status != '0') {
              this.router.navigate(['login']);
            }
          }
        })
        .catch(e => {
          this.blockUI.stop();
          this.toastrService.error('System Error. Contact System Admin');
        });*/
    });
  }

  public onSubmit(form: FormGroup) {
    if (this.form.valid) {
      this.blockUI.start('Changing Password');
      const postdata = {
        token: this.token.token,
        newPasswordRepeat: form.value.newPasswordRepeat,
        newPassword: form.value.newPassword,
        securityQuestion: form.value.securityQuestion,
        temporaryPassword: form.value.temporaryPassword,
        securityQuestionAnswer: form.value.securityQuestionAnswer
      };
      //post data
      /*this.http
        .post(this.webApiBaseUrl + 'user/changeFirstTimePassword', postdata)
        .toPromise()
        .then(rs => {
          this.blockUI.stop();
          const data = rs.json();
          if (data['responseCode'] === '00') {
            this.toastrService.success(data['responseDescription'][0]);
            this.router.navigate(['login']);
          } else {
            this.toastrService.error(data['responseDescription'][0]);
          }
        })
        .catch(e => {
          this.blockUI.stop();
          this.toastrService.error('System Error. Contact System Admin');
        });*/
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
