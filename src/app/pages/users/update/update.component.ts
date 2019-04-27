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
  selector: "app-update",
  templateUrl: "./update.component.html",
  styleUrls: ["./update.component.css"]
})
export class UpdateUserComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public userFormEdit: FormGroup;
  public activeInactive: any;
  public currentActive: any = "DISABLED";
  public FormItem: FormArray;
  public errorMessage: any = "SHOWERROR";
  public storeOptions: any;
  public genderList: any;
  public roleList: any;
  public editData: any;

  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataservice: ApiService
  ) {
    this.router = router;
    this.editData = this.dataservice.EditFormData;
    this.genderList = [{ id: "1", name: "Male" }, { id: "2", name: "Female" }];

    this.roleList = [
      { id: "1", name: "Store user" },
      { id: "2", name: "Store admin" },
      { id: "3", name: "Partner admin" }
    ];

    const namePattern = /^[a-zA-Z ']{2,45}$/;
    const kenyanMobileNoPattern = "^(254|0)(7([0-9]{8}))$";
    this.dataservice.fetchData("stores/stores").subscribe(
      data => {
        if (data.status === 200) {
          console.log(data.body);
          this.storeOptions = JSON.parse(data.body.stores);
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      },
      err => {
        console.log("Something went wrong");
        this.blockUI.stop();
      }
    );

    this.userFormEdit = fb.group({
      firstname: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z]*")
        ])
      ),
      lastname: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z]*")
        ])
      ),
      email: new FormControl(
        "",
        Validators.compose([Validators.required, CustomValidators.email])
      ),
      gender: new FormControl("", Validators.required),
      id_number: new FormControl(
        "",
        Validators.compose([
          Validators.minLength(6),
          Validators.maxLength(10),
          Validators.required
        ])
      ),
      mobile: new FormControl("", Validators.compose([Validators.required])),
      role: new FormControl("", Validators.compose([Validators.required])),
      store_id: new FormControl("", Validators.compose([Validators.required]))
    });

    this.userFormEdit.patchValue({
      firstname: this.editData.firstname,
      lastname: this.editData.lastname,
      email: this.editData.email,
      mobile: this.editData.mobile,
      id_number: this.editData.id_number,
      gender: this.editData.gender,
      role: this.editData.role,
      store_id: this.editData.store_id
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
    return this.userFormEdit.controls;
  }
  // Submitting Add Entity
  public onAddSubmit(form: FormGroup) {
    if (form.valid) {
      this.errorMessage = "SHOWERROR";
      this.blockUI.start("Updating User ..............");

      const postFormData = {
        email: form.value.email,
        firstname: form.value.firstname,
        gender: form.value.gender,
        lastname: form.value.lastname,
        mobile: form.value.mobile.internationalNumber,
        username: form.value.email,
        password: "Admin101",
        role: form.value.role,
        id_number: form.value.id_number,
        store_id: form.value.store_id
      };
      this.dataservice
        .updateRecord("users", this.editData.id, postFormData)
        .subscribe(
          data => {
            if (data.status === 200) {
              this.router.navigate(["users"]);
              this.blockUI.stop();
              this.toastrService.success("User Record updated successfully");
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
    this.router.navigate(["users"]);
  }
}
