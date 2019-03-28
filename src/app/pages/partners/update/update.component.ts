import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-be-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateBeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public beFormAdd: FormGroup;
  public activeInactive: any;
  public currentActive: any = 'DISABLED';
  public FormItem: FormArray;
  public errorMessage: any = 'SHOWERROR';
  public specialityOptions: any;
  public editData: any;


  constructor(router: Router, fb: FormBuilder,
              public toastrService: ToastrService,
              public dataservice: ApiService) {
    this.router = router;
    const namePattern = /^[a-zA-Z ']{2,45}$/;
    const kenyanMobileNoPattern = '^(254|0)(7([0-9]{8}))$';
    this.editData = this.dataservice.EditFormData;

    this.specialityOptions = [
      {id: '1', name: 'Electronics'},
      {id: '2', name: 'Phones'},
      {id: '3', name: 'Furniture'},
      {id: '4', name: 'General'}];
    // const specialityArray: FormArray = new FormArray([]);
   // orgMobile:   ['', Validators.compose([ Validators.required,Validators.pattern(kenyanMobileNoPattern)])],
    this.beFormAdd = fb.group({
      orgName:     ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      orgLocation: ['', Validators.compose([Validators.required])],
      orgEmail:    ['', Validators.compose([Validators.required, CustomValidators.email])],
      orgTelephone:['', Validators.compose([Validators.required])],
      orgMobile:   ['', Validators.compose([Validators.required])],
      orgYearsOfOperation:['', Validators.compose([Validators.required,CustomValidators.number])],
      orgSpeciality: ['', Validators.required]
     });
    this.beFormAdd.patchValue({
      orgName: this.editData.name,
      orgLocation: this.editData.location,
      orgEmail: this.editData.email,
      orgTelephone: this.editData.telephone,
      orgMobile: this.editData.mobile,
      orgYearsOfOperation: this.editData.year_of_incorporation,
      orgSpeciality: this.editData.speciality,
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
  get f() { return this.beFormAdd.controls; }
  // Submitting Add Entity
  public onEditSubmit(form: FormGroup) {

    if (form.valid) {
      this.errorMessage  = 'SHOWERROR';
      this.blockUI.start('Updating Partner....');

      const postFormData = {
        email: form.value.orgEmail,
        location: form.value.orgLocation,
        telephone: form.value.orgTelephone,
        mobile: form.value.orgMobile,
        year_of_incorporation: form.value.orgYearsOfOperation,
        name: form.value.orgName,
        speciality: form.value.orgSpeciality
      };
      this.dataservice
        .updateRecord('partners', this.editData.id,postFormData).subscribe( data => {
             console.log(data);
             if (data.status === 200) {
            this.router.navigate(['partners']);
            this.blockUI.stop();
            this.toastrService.success('Record Update was successful');
          } else {
            this.blockUI.stop();
            this.toastrService.error('There was a problem updating the record');
            // this.toastrService.error(data.message);
          }
        }, err => {
          console.log('Something Went Wrong, We could not complete the request');
          console.log(err);
          this.blockUI.stop();
          this.toastrService.error('Something Went Wrong, We could not complete the request');
         });

    }
  }
  // On List
  onList() {
    this.router.navigate(['partners']);
  }
}
