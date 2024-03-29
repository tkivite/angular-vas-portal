import { Component, OnInit, ViewEncapsulation } from "@angular/core";
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
  selector: "app-create",
  templateUrl: "./create.component.html"
})
export class CreateInvoiceComponent {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public userFormEdit: FormGroup;
  public editData: any;
  saveErrors: any;

  public invoiceEntryForm: FormGroup;

  public fsubmitted = false;
  public rsubmitted = false;
  public fsubmittedwitherrors = false;
  public shopperOptions: any;
  selectedShopper: any;
  itemTypeList: any = [];

  data: any = [];

  constructor(
    router: Router,
    fb: FormBuilder,
    public toastrService: ToastrService,
    private dataservice: ApiService //private confirmationDialogService: ConfirmationDialogService
  ) {
    this.router = router;
    this.editData = this.dataservice.newInvoice;
    console.log(this.editData);

    this.itemTypeList = [
      { id: "1", name: "Furniture" },
      { id: "2", name: "Electronics" },
      { id: "3", name: "Phone" }
    ];

    this.dataservice.fetchData("shoppers").subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.shopperOptions = data.body.shoppers;
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

    this.getData();

    this.invoiceEntryForm = fb.group({
      receiptNo: new FormControl("", Validators.compose([Validators.required])),
      itemDescription: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      itemType: new FormControl("", Validators.compose([Validators.required])),
      shopper: new FormControl("", Validators.compose([Validators.required])),
      totalValue: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          CustomValidators.number,
          CustomValidators.min(0)
        ])
      )
    });
  }

  get f() {
    return this.invoiceEntryForm.controls;
  }

  public onAddSubmit(form: FormGroup) {
    if (form.valid && this.editData) {
      this.blockUI.start("Adding Invoice Entry ..............");

      const postFormData = {
        customer_names: this.selectedShopper.customer_names,
        verification_code: this.selectedShopper.verification_code,
        receipt_number: form.value.receiptNo,
        item_type: form.value.itemType,
        item_description: form.value.itemDescription,
        total_price: form.value.totalValue,
        invoice_id: this.editData.id,
        store: this.editData.store
      };
      this.dataservice.postData("invoice_details", postFormData).subscribe(
        data => {
          if (data.status === 200) {
            this.blockUI.stop();
            this.data.push(data.body);
            this.toastrService.success("Invoice Entry added successfully");
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
    this.router.navigate(["users"]);
  }
  onSelect(item) {
    console.log(item.target.value);
    this.selectedShopper = JSON.parse(item.target.value);
    console.log(this.selectedShopper.customer_names);
  }

  onDelete(record) {
    if (
      confirm(
        "Please confirm,Do you really want to delete the invoice record ?"
      )
    ) {
      console.log(record);
      this.blockUI.start("Deleting Invoice Entry ........");

      this.dataservice.deleteRecord("invoice_details", record.id).subscribe(
        data => {
          console.log(data);
          if (data.status === 200) {
            this.getData();
            this.blockUI.stop();
            this.toastrService.success("Record has been deleted");
            this.router.routeReuseStrategy.shouldReuseRoute = function() {
              return false;
            };
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
          this.blockUI.stop();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      );
    }
  }
  onFinish() {
    this.blockUI.start();
    this.dataservice.finishInvoice(this.editData.id).subscribe(
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
      .fetchData("invoices/" + this.editData.id + "/invoice_details")
      .subscribe(
        data => {
          this.blockUI.start();
          if (data.status === 200) {
            console.log(data.body.invoice_details);
            this.data = data.body.invoice_details;
            this.blockUI.stop();
          } else {
            console.log("the error");
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
  onCancel() {
    this.router.navigate(["invoicing"]);
  }
}
