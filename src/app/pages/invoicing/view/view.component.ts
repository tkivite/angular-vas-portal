import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationDialogService } from "../../../services/confirmation-dialog/confirmation-dialog.service";

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
  saveErrors: any;

  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    public dataservice: ApiService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.router = router;
    this.viewData = this.dataservice.EditFormData;
    this.getData();
  }

  onDelete(record) {
    if (confirm("Are you sure to delete this invoice entry ")) {
      console.log(record);
      this.blockUI.start("Deleting Invoice Entry ........");

      this.dataservice.deleteRecord("invoice_details", record.id).subscribe(
        data => {
          console.log(data);
          if (data.status === 200) {
            // console.log(data.body);
            // this.data = data.body;
            this.getData();
            this.blockUI.stop();
            this.toastrService.success("Record has been deleted");
          } else {
            this.blockUI.stop();
            this.toastrService.error(
              "Something Went Wrong, We could not complete the request"
            );
          }
        },
        err => {
          console.log(err);
          console.log(
            "Something Went Wrong, We could not complete the request"
          );
          this.blockUI.stop();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      );
    }
    // this.confirmationDialogService
    //   .confirm(
    //     "Please confirm..",
    //     "Do you really want to delete the invoice record ?"
    //   )
    //   .then(confirmed => {
    //     console.log(record);
    //     this.blockUI.start("Deleting Invoice Entry ........");

    //     this.dataservice.deleteRecord("invoice_details", record.id).subscribe(
    //       data => {
    //         console.log(data);
    //         if (data.status === 200) {
    //           // console.log(data.body);
    //           // this.data = data.body;
    //           this.getData();
    //           this.blockUI.stop();
    //           this.toastrService.success("Record has been deleted");
    //         } else {
    //           this.blockUI.stop();
    //           this.toastrService.error(
    //             "Something Went Wrong, We could not complete the request"
    //           );
    //         }
    //       },
    //       err => {
    //         console.log(
    //           "Something Went Wrong, We could not complete the request"
    //         );
    //         this.blockUI.stop();
    //         this.toastrService.error(
    //           "Something Went Wrong, We could not complete the request"
    //         );
    //       }
    //     );
    //     // this.router.navigate(['onboarding']);
    //     console.log("User confirmed:", confirmed);
    //   })
    //   .catch(() =>
    //     console.log(
    //       "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
    //     )
    //   );
  }
  onFinish() {
    this.blockUI.start();
    this.dataservice.finishInvoice(this.viewData.id).subscribe(
      data => {
        if (data.status === 200) {
          this.router.navigate(["invoicing"]);
          this.blockUI.stop();

          this.toastrService.success("Invoice Completed successfully");
        } else {
          this.blockUI.stop();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      },
      err => {
        console.log("Something Went Wrong, We could not complete the request");
        console.log(err);
        this.saveErrors = err.error.message || err.error.error;
        this.blockUI.stop();
        this.toastrService.error(
          "Something Went Wrong, We could not complete the request"
        );
      }
    );
  }
  getData() {
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
