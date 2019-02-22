import { SweetAlertService } from 'angular-sweetalert-service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CreateBeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public formAdd: FormGroup;
  public regionList: any;
  public activeInactive: any;
  public currentActive: any = 'DISABLED';
  public FormItem: FormArray;
  public errorMessage: any = 'SHOWERROR';
  public masterLocations = [];
  constructor(router: Router, fb: FormBuilder, public toastrService: ToastrService,
    public alertService: SweetAlertService) {
    this.router = router;
    const products: FormArray = new FormArray([]);
    const contacts: FormArray = new FormArray([]);
    const namePattern = /^[a-zA-Z ']{2,45}$/;
    this.formAdd = fb.group({
      entityName: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9].*[\s\.]*$')])],
      entityRegion: ['', Validators.compose([Validators.required])],
      entityPaymentModel: ['', Validators.compose([Validators.required])],
      entityMinDailyAmt: [0],
      entityMaxDailyAmt: [0],
      entityMinOrgAmt: [0],
      entityMaxOrgAmt: [0],
      entityMinTrxAmt: [0],
      entityMaxTrxAmt: [0],
      notificationShortName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(7)
        ])
      ],
      entityAuthMode: ['NATIVE'],
      location: ['', Validators.compose([Validators.required])],
      entityEmail: ['', Validators.compose([Validators.required, CustomValidators.email])],
      entityCategory: ['', Validators.compose([Validators.required])],
      products: products,
      contacts: contacts,
     });
    // }, { validator: ''});
    this.activeInactive = 'ENABLED'
    
   
    this.FormItem = <FormArray>this.formAdd.controls['contacts'];
    this.FormItem.push(
      new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required, Validators.pattern(namePattern)])),
        type: new FormControl('', Validators.compose([Validators.required])),
        value: new FormControl('', Validators.compose([Validators.required])),
      })
    );
  }

  public ngOnInit() {
 
    this.blockUI.start('Processing');
    this.currentActive = 'ENABLED';
   
      const searchParams = {
        searchFields: [{ status: 1}]
      };
      const strParams = encodeURIComponent(JSON.stringify(searchParams));
     
    
    this.formAdd.get('contacts')['controls'].forEach((contact, i) => {
      this.subscribeChanges(contact);
    });
    this.blockUI.stop();
  }
  subscribeChanges(contact: FormGroup) {
     contact.get('type').valueChanges.subscribe(val => {
      if (val === 'Email') {
        contact.get('value').setValidators(
          Validators.compose([Validators.required, CustomValidators.email])
        );
        contact.get('value').updateValueAndValidity();
      } else {
        contact.get('value').setValidators(
          Validators.compose([
            Validators.required,
            Validators.pattern('^(254|0)(7([0-9]{8}))$')
          ])
        );
        contact.get('value').updateValueAndValidity();
      }
    });
  }

  // Submitting Add Entity
  public onAddSubmit(form: FormGroup) {
    if (form.valid) {
      this.errorMessage  = 'SHOWERROR';
      this.blockUI.start('Adding Business Entity');
      const perms = form.value.products;
     
      
      const postFormData = {
        approvalStatus: 0,
        minDailyAmt: form.value.entityMinDailyAmt,
        maxDailyAmt: form.value.entityMaxDailyAmt,
        minOrgAmt: form.value.entityMinOrgAmt,
        maxOrgAmt: form.value.entityMaxOrgAmt,
        minTrxAmt: form.value.entityMinTrxAmt,
        maxTrxAmt: form.value.entityMaxTrxAmt,
        paymentModel: form.value.entityPaymentModel,
        authenticationMode: form.value.entityAuthMode,
        notificationShortName: form.value.notificationShortName,
        email: form.value.entityEmail,
        businessCategoryId: form.value.entityCategory,
        contacts: form.value.contacts,
        createdBy: 0,
        regionId: form.value.entityRegion,
        currentApprovalLevel: 0,
        intrash: 'NO',
        location: form.value.location,
        maxApprovals: 0,
        name: form.value.entityName,
        status: 0,
        timeCreated: new Date(),
        timeUpdated: new Date(),
        updatedBy: 0,
        isAdminBe: 0,
        throttleStatus: 0
      };
      
      
    }
  }
  // On List
  onList() {
    this.router.navigate(['pages/businessentity']);
  }
  
  addContact() {
    this.FormItem = <FormArray>this.formAdd.controls['contacts'];
    this.FormItem.push(
      new FormGroup({
        name: new FormControl('', Validators.compose([Validators.required])),
        type: new FormControl('', Validators.compose([Validators.required])),
        value: new FormControl('', Validators.compose([Validators.required])),
      })
    );
    this.formAdd.get('contacts')['controls'].forEach((contact, i) => {
      this.subscribeChanges(contact);
    });
  }
  removeContact(i) {
    console.log(i);
    this.FormItem = <FormArray>this.formAdd.controls['contacts'];
    this.FormItem.removeAt(i);
  }
}
