import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import * as $ from "jquery";
import { ConfirmationDialogService } from "@app/services/confirmation-dialog/confirmation-dialog.service";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.css"]
})
export class SalesComponent {
  startdate: NgbDateStruct;
  enddate: NgbDateStruct;
  date: { year: number; month: number };

  selectToday() {
    this.startdate = this.calendar.getToday();
  }
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public recordCount = 0;
  loadingIndicator: any = false;
  searchKey = "";
  //pagination
  current_page = 1;
  requested_page = 1;
  total_records = 0;
  page_size = 25;
  total_pages = 1;
  searchParams: any = {};
  startdateRange = "";
  enddateRange = "";

  constructor(
    private calendar: NgbCalendar,
    router: Router,
    public toastrService: ToastrService,
    private dataservice: ApiService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.router = router;
    let today = new Date();
    let dd = today.getDate();
    let ddPast = new Date();
    this.enddate = this.calendar.getToday();
    ddPast.setDate(ddPast.getDate() - 30);
    this.startdate = {
      day: ddPast.getDate(),
      month: ddPast.getMonth() + 1,
      year: ddPast.getFullYear()
    };

    this.startdateRange =
      this.startdate.year +
      "-" +
      this.startdate.month +
      "-" +
      this.startdate.day;
    this.enddateRange =
      this.enddate.year + "-" + this.enddate.month + "-" + this.enddate.day;

    this.getData();
  }

  // Load Grid Data
  getData() {
    this.blockUI.start("Loading All Sales .....");
    console.log(this.searchParams);
    this.dataservice.fetchData("sales", this.searchParams).subscribe(
      data => {
        if (data.status === 200) {
          this.current_page = this.requested_page;
          console.log(data.body);
          this.data = data.body.sales;
          //pagination params
          this.total_records = data.body.total_records;
          this.page_size = this.data.length;
          this.total_pages = Math.ceil(this.total_records / this.page_size);
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      },
      err => {
        if (err.status == 401) {
          this.router.navigate(["login"]);
        } else {
          console.log(
            "Something Went Wrong, We could not complete the request"
          );
          this.blockUI.stop();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      }
    );
    // this.blockUI.stop();
  }
  downloadApps() {
    this.blockUI.start("Downloading recent sales .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("sales/fetchapps").subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          this.getData();
          this.blockUI.stop();
          this.toastrService.success(data.body.msg);
        } else if (data.status === 204) {
          console.log(data.body);
          this.data = data.body;
          this.getData();
          this.blockUI.stop();
          this.toastrService.info("There are no recent sales");
        } else {
          this.getData();
          this.blockUI.stop();
          this.toastrService.warning(
            "We could not download recent sales.Check the connection to core."
          );
        }
      },
      err => {
        if (err.status == 401) {
          this.router.navigate(["login"]);
        } else {
          console.log(err);
          console.log("Something Went Wrong");
          this.blockUI.stop();
          this.toastrService.warning(
            "We could not download recent sales.Check the connection to core."
          );
        }
      }
    );
    // this.blockUI.stop();
  }
  onSearch() {
    console.log(this.searchKey);
    console.log(this.startdate);
    console.log(this.enddate);
    this.startdateRange =
      this.startdate.year +
      "-" +
      this.startdate.month +
      "-" +
      this.startdate.day;
    this.enddateRange =
      this.enddate.year + "-" + this.enddate.month + "-" + this.enddate.day;
    this.searchParams = {
      searchKey: this.searchKey,
      action: "display",
      page: 1,
      startdate: this.startdateRange,
      enddate: this.enddateRange
    };
    this.requested_page = 1;
    this.getData();
  }
  loadPage(i) {
    this.requested_page = i;
    this.searchParams = {
      searchKey: this.searchKey,
      action: "display",
      page: i,
      startdate: this.startdateRange,
      enddate: this.enddateRange
    };
    this.getData();
  }
  download() {
    this.confirmationDialogService
      .confirm(
        "Download Sales",
        "You will receive an email with attachment of the sales data in csv format"
      )
      .then(confirmed => {
        this.searchParams = {
          searchKey: this.searchKey,
          action: "download",
          page: 1,
          startdate: this.startdateRange,
          enddate: this.enddateRange
        };

        this.getData();
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }
}
