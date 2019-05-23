import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import * as $ from "jquery";
import { ConfirmationDialogService } from "@app/services/confirmation-dialog/confirmation-dialog.service";
import { routerNgProbeToken } from "@angular/router/src/router_module";

@Component({
  selector: "app-collections",
  templateUrl: "./collections.component.html",
  styleUrls: ["./collections.component.css"]
})
export class CollectionsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public currentActive: any = "GRID";
  public noDataDisplay: any = { emptyMessage: "No data to display" };
  public recordCount = 0;
  loadingIndicator: any = false;
  title = "angulardatatables";
  dtOptions: DataTables.Settings = {};
  @ViewChild("myTable") table: any;
  //search and pagination
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
    private dataservice: ApiService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.router = router;
    this.getData();
  }

  ngOnInit() {}
  // Load Grid Data
  getData() {
    this.blockUI.start("Loading All Collections .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("collections", this.searchParams).subscribe(
      data => {
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body.collections;
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
  newpickup() {}

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
}
