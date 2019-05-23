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
export class CreateLipalaterUserComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public userFormAdd: FormGroup;
  public activeInactive: any;
  public currentActive: any = "DISABLED";
  public FormItem: FormArray;
  public errorMessage: any = "SHOWERROR";
  public storeOptions: any;
  public genderList: any;
  public roleList: any;
  saveErrors: any;
  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataservice: ApiService
  ) {
    this.router = router;

    this.genderList = [{ id: "1", name: "Male" }, { id: "2", name: "Female" }];

    this.roleList = [
      { id: "1", name: "Lipalater admin" },
      { id: "2", name: "Lipalater_delivery" },
      { id: "3", name: "Lipalater_cro" }
    ];

    const namePattern = /^[a-zA-Z ']{2,45}$/;
    const kenyanMobileNoPattern = /^\+(?:[0-9] ?){6,14}[0-9]$/;
    this.dataservice.fetchData("stores/lipalater").subscribe(
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

    this.userFormAdd = fb.group({
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
          Validators.maxLength(12),
          Validators.required
        ])
      ),
      mobile: new FormControl("", Validators.compose([Validators.required])),
      role: new FormControl("", Validators.compose([Validators.required])),
      store_id: new FormControl("", Validators.compose([Validators.required]))
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
    return this.userFormAdd.controls;
  }
  // Submitting Add Entity
  public onAddSubmit(form: FormGroup) {
    if (form.valid) {
      this.errorMessage = "SHOWERROR";
      this.blockUI.start("Adding Internal User ....");

      const postFormData = {
        email: form.value.email,
        username: form.value.email,
        firstname: form.value.firstname,
        gender: form.value.gender,
        lastname: form.value.lastname,
        mobile: form.value.mobile.internationalNumber.replace(/ /g, ""),
        password: "Admin101",
        role: form.value.role,
        id_number: form.value.id_number,
        store_id: form.value.store_id,
        active_status: true
      };
      this.dataservice.postData("users", postFormData).subscribe(
        data => {
          if (data.status === 201) {
            this.router.navigate(["lipalater-users"]);
            this.blockUI.stop();
            this.toastrService.success("User Record created successfully");
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
    this.router.navigate(["lipalater-users"]);
  }
}
