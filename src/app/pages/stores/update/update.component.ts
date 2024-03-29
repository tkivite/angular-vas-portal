import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
//import { AlertService, AuthenticationService } from '../../../services';
import { ApiService } from "../../../services/api.service";
@Component({
  selector: "app-update",
  templateUrl: "./update.component.html",
  styleUrls: ["./update.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class UpdateStoreComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public storeFormEdit: FormGroup;
  public activeInactive: any;
  public currentActive: any = "DISABLED";
  public FormItem: FormArray;
  public errorMessage: any = "SHOWERROR";
  public PartnerOptions: any;
  public editData: any;
  saveErrors: any;

  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataservice: ApiService
  ) {
    this.router = router;
    this.editData = this.dataservice.EditFormData;
    const namePattern = /^[a-zA-Z ']{2,45}$/;
    // const kenyanMobileNoPattern = "^(254|0)(7([0-9]{8}))$";
    const kenyanMobileNoPattern = /^\+(?:[0-9] ?){11,14}[0-9]$/;
    const kenyanTillNoPattern = /^[0-9]{5,7}$/;

    const commaSepEmail = (
      control: AbstractControl
    ): { [key: string]: any } | null => {
      const emails = control.value.split(",").map(e => e.trim());
      const forbidden = emails.some(email =>
        Validators.email(new FormControl(email))
      );
      return forbidden ? { toAddress: { value: control.value } } : null;
    };

    this.storeFormEdit = fb.group({
      storePartner: ["", Validators.compose([Validators.required])],
      storeName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(namePattern)
        ])
      ],
      storeLocation: ["", Validators.compose([Validators.required])],
      storeTarget: [
        "",
        Validators.compose([CustomValidators.number, CustomValidators.min(0)])
      ],
      storeDisburseEmail: [
        "",
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      storeDisburseEmailCC: ["", commaSepEmail],
      storeDisburseEmail1: ["", Validators.compose([CustomValidators.email])],
      storeDisburseEmail2: ["", Validators.compose([CustomValidators.email])],
      storeSourceid: ["", Validators.compose([Validators.required])],
      storeManager: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(namePattern)
        ])
      ],
      storeManagerEmail: [
        "",
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      storeManagerMobile: ["", Validators.compose([Validators.required])],
      storeContact: ["", Validators.compose([Validators.pattern(namePattern)])],
      storeContactEmail: ["", Validators.compose([CustomValidators.email])],
      storeContactMobile: [""],
      storeBank: ["", Validators.compose([Validators.pattern(namePattern)])],
      storeBankAccountName: [
        "",
        Validators.compose([Validators.pattern(namePattern)])
      ],
      storeBankAccount: ["", Validators.compose([CustomValidators.number])],
      storeBankBranch: [
        "",
        Validators.compose([Validators.pattern(namePattern)])
      ],
      storeMpesaTillNumber: [
        "",
        Validators.compose([Validators.pattern(kenyanTillNoPattern)])
      ],
      storeMpesaPaybillNumber: [
        "",
        Validators.compose([Validators.pattern(kenyanTillNoPattern)])
      ],

      storeCode: ["", Validators.compose([Validators.required])],
      city: ["", Validators.compose([Validators.required])],
      numberOfEmployees: [
        "",
        Validators.compose([CustomValidators.number, CustomValidators.min(0)])
      ],
      monthlyRevenue: [
        "",
        Validators.compose([CustomValidators.number, CustomValidators.min(0)])
      ]
    });
    this.storeFormEdit.patchValue({
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
      storeDisburseEmailCC: this.editData.disburse_email_cc1,
      storePartner: this.editData.partner_id,
      storeSourceid: this.editData.source_id,
      storeBank: this.editData.bank,
      storeBankAccountName: this.editData.bank_acct,
      storeBankBranch: this.editData.bank_branch,
      storeBankAccount: this.editData.bank_acct_number,
      storeMpesaTillNumber: this.editData.mpesa_till_number,
      storeMpesaPaybillNumber: this.editData.mpesa_paybill_number,
      storeCode: this.editData.store_code,
      city: this.editData.city,
      numberOfEmployees: this.editData.no_of_employess,
      monthlyRevenue: this.editData.monthly_revenue
    });
    this.activeInactive = "ENABLED";
  }

  public ngOnInit() {
    //this.blockUI.start("Processing");
    this.currentActive = "ENABLED";
    /*const searchParams = {
      searchFields: [{ status: 1 }]
    };
    const strParams = encodeURIComponent(JSON.stringify(searchParams));
    this.blockUI.stop();*/

    this.blockUI.start("Fetching Partners Data");
    this.dataservice.fetchData("partners").subscribe(
      data => {
        if (data.status === 200) {
          console.log(data.body);
          this.PartnerOptions = data.body.partners;
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      },
      err => {
        console.log("Bad things happened");
        this.blockUI.stop();
      }
    );
  }
  get f() {
    return this.storeFormEdit.controls;
  }
  // Submitting Store
  public onEditSubmit(form: FormGroup) {
    let contact_mobile = "";
    let manager_mobile = "";
    if (form.value.storeContactMobile.internationalNumber)
      contact_mobile = form.value.storeContactMobile.internationalNumber.replace(
        / /g,
        ""
      );
    if (form.value.storeManagerMobile.internationalNumber)
      manager_mobile = form.value.storeManagerMobile.internationalNumber.replace(
        / /g,
        ""
      );
    if (form.valid) {
      this.errorMessage = "SHOWERROR";
      this.blockUI.start("Updating Store....");

      const postFormData = {
        name: form.value.storeName,
        target: form.value.storeTarget,
        location: form.value.storeLocation,
        manager: form.value.storeManager,
        manager_email: form.value.storeManagerEmail,
        manager_phone: manager_mobile,
        contact_person: form.value.storeContact,
        contact_person_email: form.value.storeContactEmail,
        contact_person_mobile: contact_mobile,
        disburse_email: form.value.storeDisburseEmail,
        disburse_email_cc1: form.value.storeDisburseEmailCC,
        partner_id: form.value.storePartner,
        source_id: form.value.storeSourceid,
        bank: form.value.storeBank,
        bank_acct: form.value.storeBankAccountName,
        bank_branch: form.value.storeBankBranch,
        bank_acct_number: form.value.storeBankAccount,
        mpesa_till_number: form.value.storeMpesaTillNumber,
        mpesa_paybill_number: form.value.storeMpesaPaybillNumber,
        no_of_employess: form.value.numberOfEmployees,
        monthly_revenue: form.value.monthlyRevenue,
        city: form.value.city,
        store_code: form.value.storeCode
      };
      this.dataservice
        .updateRecord("stores", this.editData.id, postFormData)
        .subscribe(
          data => {
            console.log(data);
            if (data.status === 200) {
              this.router.navigate(["/onboarding/stores/"]);
              this.blockUI.stop();
              this.toastrService.success("Store Record updated successfully");
            } else {
              this.blockUI.stop();
              this.toastrService.error(
                "Something Went Wrong, We could not complete the request"
              );
            }
          },
          err => {
            console.log(
              "Something Went Wrong, We could not complete the request"
            );
            console.log(err);
            this.saveErrors = err.error.message || err.error.error;
            this.blockUI.stop();
            this.toastrService.error(
              "Something Went Wrong, We could not complete the request"
            );
          }
        );
    } else {
      // console.log(form.errors);
      const invalid = [];
      const controls = form.controls;
      console.log(controls);
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
          console.log(name);
        }
      }
    }
  }
  // On List
  onList() {
    this.router.navigate(["stores"]);
  }
}
