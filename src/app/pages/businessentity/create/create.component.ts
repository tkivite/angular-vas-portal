import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

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
  
  constructor(router: Router, fb: FormBuilder, public toastrService: ToastrService) {
    this.router = router;    
    const namePattern = /^[a-zA-Z ']{2,45}$/;
    const kenyanMobileNoPattern = '^(254|0)(7([0-9]{8}))$';
    this.beFormAdd = fb.group({
      orgName:     ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      orgLocation: ['', Validators.compose([Validators.required])],
      orgEmail:    ['', Validators.compose([Validators.required, CustomValidators.email])],
      orgTelephone:['', Validators.compose([Validators.required])],
      orgMobile:   ['', Validators.compose([ Validators.required,Validators.pattern(kenyanMobileNoPattern)])],
      orgYearsOfOperation:['', Validators.compose([Validators.required])],
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
  // Submitting Add Entity
  public onAddSubmit(form: FormGroup) {
    if (form.valid) {
      this.errorMessage  = 'SHOWERROR';
      this.blockUI.start('Adding Business Entity');   
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
        updatedBy: 0
      };
    }
  }
  // On List
  onList() {
    this.router.navigate(['pages/businessorg']);
  }
  
  addContact() {
    this.FormItem = <FormArray>this.beFormAdd.controls['contacts'];
    this.FormItem.push(
      new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required])),
        type: new FormControl('', Validators.compose([Validators.required])),
        value: new FormControl('', Validators.compose([Validators.required])),
      })
    );
    this.beFormAdd.get('contacts')['controls'].forEach((contact, i) => {
      this.subscribeChanges(contact);
    });
  }
  removeContact(i) {
    console.log(i);
    this.FormItem = <FormArray>this.beFormAdd.controls['contacts'];
    this.FormItem.removeAt(i);
  }
}
