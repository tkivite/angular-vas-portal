import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray
} from "@angular/forms";
import { CustomValidators } from "ng2-validation";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../../../services/api.service";

@Component({
  selector: "app-view",
  templateUrl: "./view.component.html"
})
export class ViewInvoiceComponent {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public storeOptions: any;
  public viewData: any;
  public data: any = [];

  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataservice: ApiService
  ) {
    this.router = router;
    this.viewData = this.dataservice.EditFormData;
    this.dataservice
      .fetchData("invoices/" + this.viewData.id + "/invoice_details")
      .subscribe(
        data => {
          this.blockUI.start();
          if (data.status === 200) {
            console.log(data.body.invoice_details);
            this.data = data.body.invoice_details;
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
  }
}
