import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import * as $ from "jquery";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-released",
  templateUrl: "./released.component.html",
  styleUrls: ["./released.component.css"]
})
export class ReleasedComponent implements OnInit {
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
  //pagination
  searchKey = "";
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
    private dataservice: ApiService
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
    this.blockUI.start("Loading Collected Items .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("sales/collected", this.searchParams).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
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
  onDelete(record) {
    console.log(record);
    this.blockUI.start("Deleting Partner Record ........");

    this.dataservice.deleteRecord("sales", record.id).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body;
          this.blockUI.stop();
          this.toastrService.success("Record has been trashed");
        } else {
          this.blockUI.stop();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
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

  onAdd() {
    this.router.navigate(["sales/create"]);
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
}
