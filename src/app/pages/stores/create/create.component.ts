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
  saveErrors: any;

  public url = "api/stores/store_keys";
  public params = {};
  public query = "";

  public query3 = "";
  public staticList = [
    "jkiarie",
    "pmaina",
    "mduka",
    "saruk",
    "house_wifes_paradise",
    "finecom",
    "al_yassin",
    "gee_tek",
    "image_connections",
    "gadget_world",
    "appliances_kenya",
    "salute_iworld",
    "zetu_furniture",
    "tricom_tech",
    "samchi",
    "tesla",
    "cello",
    "e_zone",
    "neptune",
    "sony_zakir",
    "avenue",
    "paramount_merchants",
    "anchor_technologies",
    "rikel_technologies",
    "bigman",
    "compnet",
    "victoria_courts",
    "globo_edge",
    "fgee",
    "netcore",
    "endless",
    "trig",
    "anisuma_junction",
    "anisuma_kimathi",
    "anisuma_trm",
    "anisuma_nyali",
    "anisuma_gardencity",
    "samsung_smart_hub",
    "samsung_hub",
    "samsung_capital",
    "samsung_ridgeways",
    "samsung_garden_city",
    "startimes",
    "officemart_yaya",
    "officemart_680",
    "officemart_kenyatta",
    "officemart_curve",
    "officemart_junction",
    "simba_telecom",
    "makarim_samsung",
    "makarim_two_rivers",
    "makarim_hilton",
    "zedsons_electronics",
    "coastal_images",
    "capital_ict",
    "microlink_electronics",
    "ricom",
    "midsprings",
    "step_link",
    "copyrite_furniture",
    "teika_oppo",
    "furniture_elegance",
    "xtreme_media",
    "cool_joint",
    "meenakshi",
    "highlands",
    "pana_music",
    "dhaval",
    "future_tech",
    "bng",
    "king_paper_works",
    "fraca_servcom",
    "palo_alto",
    "aston",
    "electronic_masters",
    "csoft_furniture",
    "delpoint_electronics",
    "samsung_nakuru",
    "sparks_communication",
    "pace_connect",
    "mwalimu_enterprises",
    "ultimate_communication",
    "centrium_communication",
    "kificom",
    "gabbs",
    "boxlight",
    "avechi",
    "hotpoint",
    "hashmart",
    "fonati_airtel",
    "rudra",
    "bose",
    "home_living",
    "mac_and_more",
    "lg_brand_shop",
    "phone_shop",
    "sports_planet",
    "jabali_furniture",
    "elite_digital",
    "sofis_gallery",
    "palais_eleganza",
    "shop_new_level",
    "grand_tech",
    "lighting_solutions"
  ];

  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataservice: ApiService
  ) {
    this.router = router;
    const namePattern = /^[a-zA-Z ']{2,45}$/;
    //const kenyanMobileNoPattern = "^(254|0)(7([0-9]{8}))$";
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

    this.dataservice.fetchData("partners").subscribe(
      data => {
        if (data.status === 200) {
          console.log(data.body.partners);
          this.PartnerOptions = data.body.partners;
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
      let contact_mobile = "";
      if (form.value.storeContactMobile)
        contact_mobile = form.value.storeContactMobile.internationalNumber.replace(
          / /g,
          ""
        );

      const postFormData = {
        name: form.value.storeName,
        target: form.value.storeTarget,
        location: form.value.storeLocation,
        manager: form.value.storeManager,
        manager_email: form.value.storeManagerEmail,
        manager_phone: form.value.storeManagerMobile.internationalNumber.replace(
          / /g,
          ""
        ),
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
      this.dataservice.postData("stores", postFormData).subscribe(
        data => {
          if (data.status === 201) {
            this.router.navigate(["/onboarding/stores/"]);
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
          this.saveErrors = err.error.message || err.error.error;
          this.blockUI.stop();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      );
    } else {
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
  handleStaticResultSelected(result) {
    this.query3 = result;
  }
  handleHttpResultSelected(result) {
    this.query3 = result;
  }
  handleResultSelected(result) {
    this.query = result;
  }
}
