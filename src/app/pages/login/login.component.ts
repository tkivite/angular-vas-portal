import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AlertService } from '../../services';
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
    ) {
        // redirect to home if already logged in
        if (this.dataservice.currentLoggedInUser) { 
            this.router.navigate(['dashboard']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    public onSubmit(form: FormGroup) {
             
          const postFormData = {
            email: this.f.username.value,
            password: this.f.password.value
          };
          //{"email":"tkivite@gmail5.com","password":"123456"}
          this.dataservice
            .postData('authenticate', postFormData).subscribe( data => {              
              console.log(data)
              if (data.status === 200) {
                this.toastrService.success(data.message);
                this.router.navigate(['users']);
                this.blockUI.stop();
              } else {
                this.toastrService.error(data.message);
                this.blockUI.stop();
              }
            }, err => {console.log("Something went wrong");  this.blockUI.stop();});
           
        }
      
  
}