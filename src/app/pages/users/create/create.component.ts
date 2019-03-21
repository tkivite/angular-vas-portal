import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
//import { AlertService, AuthenticationService } from '../../../services';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CreateUserComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public userFormAdd: FormGroup;
  public activeInactive: any;
  public currentActive: any = 'DISABLED';
  public FormItem: FormArray;
  public errorMessage: any = 'SHOWERROR';
  public storeOptions: any;
  public genderList: any;
  public roleList: any;
  
  constructor(router: Router, fb: FormBuilder, public toastrService: ToastrService,  public dataservice: ApiService) {
    this.router = router;    
    
    
    this.genderList = [
        {id:"1",name:"Male"},
        {id:"2",name:"Female"}];

    this.roleList = [
        {id:"1",name:"Store user"},
        {id:"2",name:"Partner admin"},
        {id:"3",name:"Lipalater admin"},
        {id:"4",name:"Lipalater delivery"},    
    ];    


    const namePattern = /^[a-zA-Z ']{2,45}$/;
    const kenyanMobileNoPattern = '^(254|0)(7([0-9]{8}))$';
    this.dataservice
      .fetchData('stores').subscribe( data => {
        if (data.status === 200) {
           console.log(data.body);
           this.storeOptions = data.body;
           this.blockUI.stop();            
        } else {
        this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      }, err => {console.log("Something went wrong");  this.blockUI.stop();});
   
    this.userFormAdd = fb.group({
        username: new FormControl(
            '',
            Validators.compose([
              Validators.required,
              Validators.pattern('[a-zA-Z0-9].*[s.]*$'), Validators.minLength(3),
              Validators.maxLength(100)
            ])
          ),
          firstname: new FormControl(
            '',
            Validators.compose([
              Validators.required, Validators.minLength(3),
              Validators.maxLength(100),
              Validators.pattern('[a-zA-Z]*')
            ])
          ),
          lastname: new FormControl(
            '',
            Validators.compose([
              Validators.required, Validators.minLength(3),
              Validators.maxLength(100),
              Validators.pattern('[a-zA-Z]*')
            ])
          ),
          email: new FormControl(
            '',
            Validators.compose([Validators.required, CustomValidators.email])
          ),
          gender: new FormControl('', Validators.required),
          id_number: new FormControl(
            '',
            Validators.compose([
              Validators.pattern('^[0-9]{6-10}$'),
              Validators.required
            ])
          ),
          mobile: new FormControl(
            '',
            Validators.compose([
              Validators.pattern('^(254|0)(7([0-9]{8}))$'),
              Validators.required
            ])
          ),
          role: new FormControl(
            '',
            Validators.compose([
              Validators.required
            ])
          ),
          store_id: new FormControl(
            '',
            Validators.compose([
              Validators.required
            ])
          )
     });
    
    this.activeInactive = 'ENABLED'    
  }

  public ngOnInit() {
 
    this.blockUI.start('Processing');
    this.currentActive = 'ENABLED';   
      const searchParams = {
        searchFields: [{ status: 1}]
      };
      const strParams = encodeURIComponent(JSON.stringify(searchParams));
      this.blockUI.stop();
  }
  get f() { return this.userFormAdd.controls; }
  // Submitting Add Entity
  public onAddSubmit(form: FormGroup) {
    
    if (form.valid) {
      this.errorMessage  = 'SHOWERROR';
      this.blockUI.start('Adding Business Organization');   
      
      const postFormData = {
        email: form.value.email,
        username: form.value.email,
        firstName: form.value.firstName,
        gender: form.value.gender,
        lastName: form.value.lastName,
        mobile: '254' + form.value.mobile.slice(-9),
        userName: form.value.userName,
        password: 'Admin101',      
        role: form.value.role,
        id_number: form.value.id_number,
        store_id: form.value.store_id,
      };
      this.dataservice
        .postData('users', postFormData).subscribe( data => {
          
          
          if (data.status === 201) {
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
  // On List
  onList() {
    this.router.navigate(['users']);
  }
}
