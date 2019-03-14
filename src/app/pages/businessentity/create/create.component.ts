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
export class CreateBeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public beFormAdd: FormGroup;
  public activeInactive: any;
  public currentActive: any = 'DISABLED';
  public FormItem: FormArray;
  public errorMessage: any = 'SHOWERROR';
  public specialityOptions: any;
  //public specialityArray: any;
  //public rolesSelected: any[] = [];

  
  constructor(router: Router, fb: FormBuilder, public toastrService: ToastrService,  public dataservice: ApiService) {
    this.router = router;    
    const namePattern = /^[a-zA-Z ']{2,45}$/;
    const kenyanMobileNoPattern = '^(254|0)(7([0-9]{8}))$';

    this.specialityOptions = [
      {id:"1",name:"Electronics"},
      {id:"2",name:"Phones"},
      {id:"3",name:"Furniture"},
      {id:"4",name:"General"}];
    //const specialityArray: FormArray = new FormArray([]);
   
    this.beFormAdd = fb.group({
      orgName:     ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      orgLocation: ['', Validators.compose([Validators.required])],
      orgEmail:    ['', Validators.compose([Validators.required, CustomValidators.email])],
      orgTelephone:['', Validators.compose([Validators.required])],
      orgMobile:   ['', Validators.compose([ Validators.required,Validators.pattern(kenyanMobileNoPattern)])],
      orgYearsOfOperation:['', Validators.compose([Validators.required,CustomValidators.number])],
      orgSpeciality: ['', Validators.required]
     });

   /*  this.specialityOptions.forEach(spec => {
     this.FormItem = <FormArray>this.beFormAdd.controls['orgSpeciality'];
     this.FormItem.push(
       new FormGroup({
         id: new FormControl(spec.id),
         name: new FormControl(spec.name)
       })
     );
     });*/
    
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
  get f() { return this.beFormAdd.controls; }
  // Submitting Add Entity
  public onAddSubmit(form: FormGroup) {
    
    if (form.valid) {
      this.errorMessage  = 'SHOWERROR';
      this.blockUI.start('Adding Business Organization');   
      
      const postFormData = {
        email: form.value.orgEmail,
        location: form.value.orgLocation,  
        telephone: form.value.orgTelephone, 
        mobile: form.value.orgMobile,  
        age: form.value.orgYearsOfOperation,   
        createdBy: 0,
        name: form.value.orgName,
        status: 0,
        timeCreated: new Date(),
        updatedBy: 0,
        speciality: form.value.orgSpeciality
      };
      this.dataservice
        .postData('partners', postFormData).subscribe( data => {
          
          
          if (data.status === 201) {
            this.toastrService.success(data.message);
            this.router.navigate(['onboarding']);
            this.blockUI.stop();
          } else {
            this.toastrService.error(data.message);
            this.blockUI.stop();
          }
        }, err => {console.log("Bad things happened");  this.blockUI.stop();});
       
    }
  }
  // On List
  onList() {
    this.router.navigate(['onboarding']);
  }
}
