import { ApiService } from '../../services/api.service';
import { Component, ViewEncapsulation, Output, HostListener, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { ToastrService } from 'ngx-toastr';
import {  BlockUI, NgBlockUI } from 'ng-block-ui';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public form: FormGroup;
  public formOTP: FormGroup;
  public webApiBaseUrl: string;
  public otp: any;
  public sub: any;
  public passwordList: any = [];
  public token: any;
  public securityQuestionsList: any;
  public retryConfig = 3;
  public retries: number;
  public showCaps: any = false;
  public retriesRemaining: number;
  public errorMessage: any = 'SHOWERROR';
  @HostListener('window:keydown', ['$event'])
      onKeyDown(event: KeyboardEvent): void {
       const capsOn = event.getModifierState && event.getModifierState('CapsLock');
       if (capsOn) {
          this.showCaps = true;
       } else {
        this.showCaps = false;
       }
  }
  constructor(router: Router, fb: FormBuilder, public toastrService: ToastrService,
    public dataService: ApiService,  private route: ActivatedRoute) {
      this.router = router;
      this.form = fb.group({
          'confirmPassword': ['', Validators.compose([Validators.required])],
          'newPassword': ['', Validators.compose([Validators.required , Validators.minLength(6)])],
          'otp': ['', Validators.compose([Validators.required])],
      }, {validator: matchingPasswords('newPassword', 'confirmPassword')});
      this.retriesRemaining = 0;

    // get password Policy

      this.passwordList = [];

      this.route.queryParams
      .subscribe(params => {
        this.token = params;
      });
  }

public onSubmit(form: FormGroup) {
  if (this.form.valid) {
      this.blockUI.start('Resetting Password');
      this.errorMessage = 'SHOWERROR';
      const postdata = {
        token: this.token.token,
        confirmPassword: form.value.confirmPassword,
        newPassword: form.value.newPassword,
        otp: form.value.otp,
      };
    //submit data
  }
}
}
export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: FormGroup) => {
      const password = group.controls[passwordKey];
      const passwordConfirmation = group.controls[passwordConfirmationKey];
      if (password.value !== passwordConfirmation.value) {
          return passwordConfirmation.setErrors({mismatchedPasswords: true})
      }
  }
}
