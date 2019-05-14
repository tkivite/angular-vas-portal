import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import * as $ from "jquery";
import { ConfirmationDialogService } from "@app/services/confirmation-dialog/confirmation-dialog.service";
import { routerNgProbeToken } from "@angular/router/src/router_module";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.css"]
})
export class SalesComponent implements OnInit {
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
  constructor(
    router: Router,
    public toastrService: ToastrService,
    private dataservice: ApiService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.router = router;
    this.getData();
  }

  ngOnInit() {
    $(document).ready(function() {
      $(".dataTables_empty").html("");
      $(".dataTables_info").html("");
      $(".dataTables_length").html(
        '<a class="btn btn-infor btn-sm mb-1" (click)="onAdd()" type="button"><i class="fa fa-plus"></i> Add Business Orgnisation</a>'
      );
    });
    this.dtOptions = {
      pagingType: "full_numbers",
      dom: "rtip",
      pageLength: 10,
      processing: true
    };
  }
  // Load Grid Data
  getData(searchKey = "", currentPage = 1) {
    this.blockUI.start("Loading All Sales .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("sales", searchKey, currentPage).subscribe(
      data => {
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
          //console.log(data.body);
          //this.data = data.body;
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
    this.getData(this.searchKey, 1);
  }
  loadPage(i) {
    this.current_page = i;
    this.getData(this.searchKey, i);
  }

  public daterange: any = {};

  /*private selectedDate(value: any) {
    this.daterange.start = value.start;
    this.daterange.end = value.end;
  }*/

  // expected output is an object containing the event and the picker.
  // your method can be named whaterver you want.
  // you can add multiple params to the method and pass them in the template
  public calendarCanceled(e: any) {
    console.log(e);
    // e.event
    // e.picker
  }

  public calendarApplied(e: any) {
    console.log(e);
    // e.event
    // e.picker
    console.log(this.daterange.start);
    console.log(this.daterange.end);
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date the iser selected
    console.log(value);
    console.log(datepicker);
    console.log(datepicker.startDate.format("YYYY-MM-DD"));
    console.log(datepicker.endDate.format("YYYY-MM-DD"));
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label;
  }
}
