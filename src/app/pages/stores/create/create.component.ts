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
import { ApiService } from "../../../services/api.service";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  encapsulation: ViewEncapsulation.None
})
export class CreateStoreComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public storeFormAdd: FormGroup;
  public activeInactive: any;
  public currentActive: any = "DISABLED";
  public FormItem: FormArray;
  public errorMessage: any = "SHOWERROR";
  public PartnerOptions: any;

  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataservice: ApiService
  ) {
    this.router = router;
    const namePattern = /^[a-zA-Z ']{2,45}$/;
    const kenyanMobileNoPattern = "^(254|0)(7([0-9]{8}))$";
    const kenyanTillNoPattern = /^[0-9]{5,7}$/;

    this.dataservice.fetchData("partners").subscribe(
      data => {
        if (data.status === 200) {
          console.log(data.body);
          this.PartnerOptions = data.body;
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      },
      err => {
        console.log("Problems in downloading partners");
        this.blockUI.stop();
      }
    );

    this.storeFormAdd = fb.group({
      storePartner: ["", Validators.compose([Validators.required])],
      storeName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(namePattern)
        ])
      ],
      storeLocation: ["", Validators.compose([Validators.required])],
      storeTarget: [""],
      storeDisburseEmail: [
        "",
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      storeDisburseEmail1: ["", Validators.compose([CustomValidators.email])],
      storeDisburseEmail2: ["", Validators.compose([CustomValidators.email])],
      storeSourceid: [
        "",
        Validators.compose([Validators.required, CustomValidators.email])
      ],
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
      storeManagerMobile: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(kenyanMobileNoPattern)
        ])
      ],
      storeContact: ["", Validators.compose([Validators.pattern(namePattern)])],
      storeContactEmail: ["", Validators.compose([CustomValidators.email])],
      storeContactMobile: [
        "",
        Validators.compose([Validators.pattern(kenyanMobileNoPattern)])
      ],
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
      numberOfEmployees: ["", Validators.compose([CustomValidators.number])],
      monthlyRevenue: ["", Validators.compose([CustomValidators.number])]
    });
    this.activeInactive = "ENABLED";
  }

  public ngOnInit() {
    this.blockUI.start("Processing");
    this.currentActive = "ENABLED";
    const searchParams = {
      searchFields: [{ status: 1 }]
    };
    const strParams = encodeURIComponent(JSON.stringify(searchParams));
    this.blockUI.stop();
  }
  get f() {
    return this.storeFormAdd.controls;
  }
  // Submitting Store
  public onAddSubmit(form: FormGroup) {
    if (form.valid) {
      this.errorMessage = "SHOWERROR";
      this.blockUI.start("Adding Store");
      const postFormData = {
        name: form.value.storeName,
        target: form.value.storeTarget,
        location: form.value.storeLocation,
        manager: form.value.storeManager,
        manager_email: form.value.storeManagerEmail,
        manager_phone: "+254" + form.value.storeManagerMobile.slice(-9),
        contact_person: form.value.storeContact,
        contact_person_email: form.value.storeContactEmail,
        contact_person_mobile: "+254" + form.value.storeContactMobile.slice(-9),
        disburse_email: form.value.storeDisburseEmail,
        disburse_email_cc1: form.value.storeDisburseEmail1,
        disburse_email_cc2: form.value.storeDisburseEmail2,
        partner_id: form.value.storePartner,
        createdBy: 0,
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
      this.dataservice.postData("stores", postFormData).subscribe(
        data => {
          if (data.status === 201) {
            this.router.navigate(["stores"]);
            this.blockUI.stop();
            this.toastrService.success("Store Record created successfully");
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
          this.blockUI.stop();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      );
    }
  }
  // On List
  onList() {
    this.router.navigate(["stores"]);
  }
}
