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
export class CreateBeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public beFormAdd: FormGroup;
  public activeInactive: any;
  public currentActive: any = "DISABLED";
  public FormItem: FormArray;
  public errorMessage: any = "SHOWERROR";
  public specialityOptions: any;
  saveErrors: any;
  public yearOfIncor = [];

  selectedSpeciality = [];
  dropdownSettings = {};

  public UserOptions: any;

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

    this.specialityOptions = [
      { speciality_id: "1", speciality_name: "Electronics" },
      { speciality_id: "2", speciality_name: "Phones" },
      { speciality_id: "3", speciality_name: "Furniture" },
      { speciality_id: "4", speciality_name: "Other" }
    ];
    let maxYear = new Date().getFullYear();
    let minYear = maxYear - 200;

    for (var i = minYear; i <= maxYear; i++) {
      this.yearOfIncor.push({ id: "1", year: i });
    }

    this.blockUI.start("Fetching Users");
    this.dataservice.fetchData("users").subscribe(
      data => {
        if (data.status === 200) {
          console.log(data.body);
          this.UserOptions = JSON.parse(data.body.users);
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastrService.error(data.error.message);
        }
      },
      err => {
        console.log("Problems in downloading users");
        this.blockUI.stop();
      }
    );

    this.dropdownSettings = {
      singleSelection: false,
      idField: "speciality_id",
      textField: "speciality_name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    let current_year = new Date().getFullYear();

    this.beFormAdd = fb.group({
      orgName: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(namePattern)
        ])
      ],
      orgLocation: ["", Validators.compose([Validators.required])],
      orgEmail: [
        "",
        Validators.compose([Validators.required, CustomValidators.email])
      ],
      orgTelephone: [""],
      orgMobile: ["", Validators.compose([Validators.required])],
      orgYearsOfOperation: [
        "",
        Validators.compose([
          Validators.required,
          CustomValidators.number,
          CustomValidators.min(1000),
          CustomValidators.max(current_year)
        ])
      ],
      numberOfBranches: [
        "",
        Validators.compose([
          CustomValidators.number,
          CustomValidators.min(1),
          CustomValidators.max(10000)
        ])
      ],
      paymentTerms: ["", Validators.compose([Validators.required])],
      creditDurationInDays: [
        "",
        Validators.compose([CustomValidators.number, CustomValidators.min(0)])
      ],
      accountManager: [""],
      selectedItems: [null],
      orgSpeciality: [""]
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
    return this.beFormAdd.controls;
  }
  // Submitting Add Entity
  public onAddSubmit(form: FormGroup) {
    if (form.valid) {
      this.errorMessage = "SHOWERROR";
      this.blockUI.start("Adding Partner");

      const postFormData = {
        email: form.value.orgEmail,
        location: form.value.orgLocation,
        telephone: form.value.orgTelephone,
        mobile: form.value.orgMobile.internationalNumber.replace(/ /g, ""),
        year_of_incorporation: form.value.orgYearsOfOperation,
        name: form.value.orgName,
        speciality: this.selectedSpeciality
          .map(x => x.speciality_name)
          .join("|"),
        account_manager: form.value.accountManager,
        no_of_branches: form.value.numberOfBranches,
        payment_terms: form.value.paymentTerms,
        credit_duration_in_days: form.value.creditDurationInDays
      };
      this.dataservice.postData("partners", postFormData).subscribe(
        data => {
          if (data.status === 201) {
            this.toastrService.success(data.message);
            this.router.navigate(["/onboarding/partners"]);
            this.blockUI.stop();
            this.toastrService.success("Record Creation was successful");
          } else {
            // this.toastrService.error(data.message);
            this.blockUI.stop();

            // this.toastrService.error(data.message);
            this.toastrService.success(
              "There was a problem creating the record"
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
    this.router.navigate(["partners"]);
  }
  onSpecialitySelect(item: any) {
    console.log(item);
    // this.selectedSpeciality.push(item);
    console.log(this.selectedSpeciality);
  }
  onSelectAllSpeciality(items: any) {
    console.log(items);
    // this.selectedSpeciality = this.specialityOptions;
    console.log(this.selectedSpeciality);
  }
  onDeSelectSpeciality(item: any) {
    console.log(item);
    /* var index = this.selectedSpeciality.indexOf(item);
    if (index > -1) {
      this.selectedSpeciality.splice(index, 1);
    }*/
    console.log(this.selectedSpeciality);
  }
}
