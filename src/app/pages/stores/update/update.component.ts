import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
//import { AlertService, AuthenticationService } from '../../../services';
import { ApiService } from '../../../services/api.service';
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class UpdateStoreComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public storeFormAdd: FormGroup;
  public activeInactive: any;
  public currentActive: any = 'DISABLED';
  public FormItem: FormArray;
  public errorMessage: any = 'SHOWERROR';
  public PartnerOptions: any;
  public editData: any;

  
  constructor(router: Router, fb: FormBuilder, public toastrService: ToastrService,  public dataservice: ApiService) {
    this.router = router;  
    this.editData = this.dataservice.EditFormData;  
    const namePattern = /^[a-zA-Z ']{2,45}$/;
    const kenyanMobileNoPattern = '^(254|0)(7([0-9]{8}))$';
    const kenyanTillNoPattern = /^[0-9]{5,7}$/;

    this.dataservice
      .fetchData('partners').subscribe( data => {         
        
        if (data.status === 200) {
           console.log(data.body);
           this.PartnerOptions = data.body;
           this.blockUI.stop();            
        } else {
        this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      }, err => {console.log("Bad things happened");  this.blockUI.stop();});
   
    this.storeFormAdd = fb.group({
      
      storePartner: ['', Validators.compose([Validators.required])],
      storeName:     ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      storeLocation: ['', Validators.compose([Validators.required])],
      storeTarget: ['', Validators.compose([Validators.required])],
      storeDisburseEmail:    ['', Validators.compose([Validators.required, CustomValidators.email])],
      storeSourceid:    ['', Validators.compose([Validators.required, CustomValidators.email])],
      storeManager:     ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      storeManagerEmail:    ['', Validators.compose([Validators.required, CustomValidators.email])],
      storeManagerMobile:   ['', Validators.compose([ Validators.required,Validators.pattern(kenyanMobileNoPattern)])],
      storeContact:     ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      storeContactEmail:    ['', Validators.compose([Validators.required, CustomValidators.email])],
      storeContactMobile:   ['', Validators.compose([ Validators.required,Validators.pattern(kenyanMobileNoPattern)])],
      
      storeBank:     ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      storeBankAccountName:    ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      storeBankAccount:   ['', Validators.compose([ Validators.required])],
      storeBankBranch:     ['', Validators.compose([Validators.required, Validators.pattern(namePattern)])],
      storeMpesaTillNumber:    ['', Validators.compose([Validators.required, Validators.pattern(kenyanTillNoPattern)])],
      storeMpesaPaybillNumber:   ['', Validators.compose([ Validators.required,Validators.pattern(kenyanTillNoPattern)])],
            
     });
     this.storeFormAdd.patchValue({
      storeName: this.editData.name,
      storeTarget: this.editData.target,
      storeLocation: this.editData.location,
      storeManager: this.editData.manager,  
      storeManagerEmail: this.editData.manager_email, 
      storeManagerMobile: this.editData.manager_phone,  
      storeContact: this.editData.contact_person,   
      storeContactEmail: this.editData.contact_person_email,
      storeContactMobile: this.editData.contact_person_mobile,
      storeDisburseEmail: this.editData.disburse_email,
      storePartner: this.editData.partner_id,
      storeSourceid: this.editData.source_id,
      storeBank: this.editData.bank,   
      storeBankAccountName: this.editData.bank_acct,
      storeBankBranch: this.editData.bank_branch,
      storeBankAccount: this.editData.bank_acct_number,
      storeMpesaTillNumber: this.editData.mpesa_till_number,
      storeMpesaPaybillNumber: this.editData.mpesa_paybill_number,    
    });
    
    this.activeInactive = 'ENABLED'    
  }

  public ngOnInit() { 
    this.blockUI.start('Processing');
    this.currentActive = 'ENABLED';   
    const searchParams = {
    searchFields: [{ status: 1}]      };
    const strParams = encodeURIComponent(JSON.stringify(searchParams));
    this.blockUI.stop();      
  }
  get f() { return this.storeFormAdd.controls; }
  // Submitting Store
  public onEditSubmit(form: FormGroup) {
    
    if (form.valid) {
      this.errorMessage  = 'SHOWERROR';
      this.blockUI.start('Updating Store');  
      
      const postFormData = {
        name: form.value.storeName,
        target: form.value.storeTarget,
        location: form.value.storeLocation,
        manager: form.value.storeManager,  
        manager_email: form.value.storeManagerEmail, 
        manager_phone: form.value.storeManagerMobile,  
        contact_person: form.value.storeContact,   
        contact_person_email: form.value.storeContactEmail,
        contact_person_mobile: form.value.storeContactMobile,
        disburse_email: form.value.storeDisburseEmail,
        partner_id: form.value.storePartner,
        createdBy: 0,
        source_id: form.value.storeSourceid,
        bank: form.value.storeBank,   
        bank_acct: form.value.storeBankAccountName,
        bank_branch: form.value.storeBankBranch,
        bank_acct_number: form.value.storeBankAccount,
        mpesa_till_number: form.value.storeMpesaTillNumber,
        mpesa_paybill_number: form.value.storeMpesaPaybillNumber      
      };    


      this.dataservice
      .updateRecord('stores', this.editData.id,postFormData).subscribe( data => {
           console.log(data);       
        if (data.status === 200) {
          //this.toastrService.success(data.message);
          this.router.navigate(['onboarding']);
          this.blockUI.stop();
        } else {
          //this.toastrService.error(data.message);
          this.blockUI.stop();
        }
      }, err => {console.log("Problems!");  this.blockUI.stop();});
       
    }
  }
  // On List
  onList() {
    this.router.navigate(['stores']);
  }
}
