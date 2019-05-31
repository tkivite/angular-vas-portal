import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import * as $ from "jquery";

@Component({
  selector: "app-pending",
  templateUrl: "./pending.component.html",
  styleUrls: ["./pending.component.css"]
})
export class PendingComponent implements OnInit {
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
    router: Router,
    public toastrService: ToastrService,
    private dataservice: ApiService
  ) {
    this.router = router;
    this.getData();
  }

  ngOnInit() {}
  // Load Grid Data
  getData() {
    this.blockUI.start("Loading Pending Items .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("sales/pending", this.searchParams).subscribe(
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
  onDelete(record) {
    console.log(record);
    this.blockUI.start("Deleting Partner Record ........");

    this.dataservice.deleteRecord("sales/pending", record.id).subscribe(
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
}
