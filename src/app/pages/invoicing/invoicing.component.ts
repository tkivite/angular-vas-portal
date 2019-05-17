import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-invoicing",
  templateUrl: "./invoicing.component.html",
  styleUrls: ["./invoicing.component.css"]
})
export class InvoicingComponent {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  searchKey = "";
  current_page = 1;
  total_records = 0;
  page_size = 25;
  total_pages = 1;

  searchParams: any = {};
  startdateRange = "";
  enddateRange = "";

  constructor(
    router: Router,
    public toastrService: ToastrService,
    private dataservice: ApiService
  ) {
    this.router = router;
    this.getData();
  }
  // Load Grid Data
  getData() {
    this.blockUI.start("Loading  invoices.....");
    this.dataservice.fetchData("invoices", this.searchParams).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body.invoices;
          this.total_records = data.body.total_records;
          this.page_size = this.data.length;
          this.total_pages = Math.ceil(this.total_records / this.page_size);
          this.data = data.body.invoices;

          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      },
      err => {
        console.log("Something Went Wrong, We could not complete the request");
        this.blockUI.stop();
        this.toastrService.error(
          "Something Went Wrong, We could not complete the request"
        );
      }
    );
  }
  onView(data) {
    console.log(data);
    this.dataservice.EditFormData = data;
    this.router.navigate(["invoices/view"]);
  }
  onUpdate(data) {
    console.log(data);
    this.dataservice.newInvoice = data;
    this.router.navigate(["invoices/create"]);
  }
  onCreate() {
    this.dataservice.createInvoice().subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.dataservice.newInvoice = data.body;
          this.router.navigate(["invoices/create"]);
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      },
      err => {
        // console.log("Something Went Wrong, We could not complete the request");
        this.blockUI.stop();
        this.toastrService.error(
          "Something Went Wrong, We could not complete the request"
        );
      }
    );
  }
  onSearch() {
    console.log(this.searchKey);
    this.searchParams = {
      searchKey: this.searchKey,
      page: 1,
      startdate: this.startdateRange,
      enddate: this.enddateRange
    };

    this.getData();
  }
  loadPage(i) {
    this.current_page = i;
    this.searchParams = {
      searchKey: this.searchKey,
      page: i,
      startdate: this.startdateRange,
      enddate: this.enddateRange
    };

    this.getData();
  }
  toggleRecordDetails(item) {
    if (item.showDetails) item.showDetails = false;
    else item.showDetails = true;
  }
}
