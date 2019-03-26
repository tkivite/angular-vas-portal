import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {AuthenticationService } from '../../services';
import {ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
        private authenticationService: AuthenticationService,
        ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['dashboard']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.compose([Validators.required])],
            password: ['', Validators.compose([Validators.required])],
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    //submit login
    public onSubmit(form: FormGroup) {
      this.blockUI.start('Taking you home ....');
      const postFormData = {
            email: this.f.username.value,
            password: this.f.password.value
          };
      this.authenticationService.login(postFormData)
            .pipe(first())
            .subscribe(
                data => {
                  console.log(data);
                   // this.router.navigate([this.returnUrl]);
                  this.router.navigate(['dashboard']);
                  const firstname = data.user.firstname;
                  this.blockUI.stop();
                  this.toastrService.success('Login Successful', 'Welcome'+firstname, {
                      timeOut: 10000
                    });
                },
                error => {
                  console.log(error);
                  this.blockUI.stop();
                  this.toastrService.error(error.error.error.user_authentication[0], 'Login Unsuccessful', {
                      timeOut: 10000
                    });
                  });
        }
      }