import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";

import { ConfirmationDialogService } from "@app/services/confirmation-dialog/confirmation-dialog.service";
import * as $ from "jquery";

@Component({
  selector: "app-cancelled",
  templateUrl: "./cancelled.component.html",
  styleUrls: ["./cancelled.component.css"]
})
export class CancelledComponent implements OnInit {
  startdate: NgbDateStruct;
  enddate: NgbDateStruct;
  date: { year: number; month: number };

  selectToday() {
    this.startdate = this.calendar.getToday();
  }

  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public currentActive: any = "GRID";
  public noDataDisplay: any = { emptyMessage: "No data to display" };
  public recordCount = 0;
  loadingIndicator: any = false;
  searchKey = "";
  title = "angulardatatables";
  //pagination
  current_page = 1;
  total_records = 0;
  page_size = 25;
  total_pages = 1;
  dtOptions: DataTables.Settings = {};
  @ViewChild("myTable") table: any;

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

    this.getData();
  }

  ngOnInit() {}
  // Load Grid Data
  getData() {
    this.blockUI.start("Loading Cancelled Items .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("sales/cancelled", this.searchParams).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body.sales;
          //pagination params
          this.total_records = data.body.total_records;
          this.page_size = this.data.length;
          this.total_pages = Math.ceil(this.total_records / this.page_size);
          this.data = data.body.sales;

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
    // this.blockUI.stop();
  }
  onEdit(data) {
    console.log(data);
    this.dataservice.EditFormData = data;
    this.router.navigate(["sales/update"]);
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

    this.getData();
  }
  loadPage(i) {
    this.current_page = i;
    this.searchParams = {
      searchKey: this.searchKey,
      action: "display",
      page: i,
      startdate: this.startdateRange,
      enddate: this.enddateRange
    };
    this.getData();
  }
  downloadApps() {
    this.confirmationDialogService
      .confirm(
        "Download Cancelled Sales",
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
