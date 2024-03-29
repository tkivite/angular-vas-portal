import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import * as $ from "jquery";

@Component({
  selector: "app-shoppers",
  templateUrl: "./shoppers.component.html",
  styleUrls: ["./shoppers.component.css"]
})
export class ShoppersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public recordCount = 0;
  loadingIndicator: any = false;
  searchKey = "";

  searchParams: any = {};
  startdateRange = "";
  enddateRange = "";
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
    private dataservice: ApiService
  ) {
    this.router = router;
    this.getData();
  }

  ngOnInit() {}
  // Load Grid Data
  getData() {
    this.blockUI.start("Loading  .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("shoppers", this.searchParams).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body.shoppers;
          //pagination params
          this.total_records = data.body.total_records;
          this.page_size = this.data.length;
          this.total_pages = Math.ceil(this.total_records / this.page_size);
          this.data = data.body.shoppers;

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
  onUpdate(data) {
    console.log(data);
    this.blockUI.start("Updating Record ........");
    this.dataservice.updateRecord("shoppers", data.id, data).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.router.navigate(["shoppers"]);
          this.data = data.body.shoppers;
          this.blockUI.stop();
          this.toastrService.success("Success", "Record has been updated", {
            timeOut: 10000
          });
          data.showDetails = false;
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
  onDelete(record) {
    console.log(record);
    this.blockUI.start("Updating Record ........");

    this.dataservice.deleteRecord("shoppers/update", record.id).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body;
          this.blockUI.stop();
          this.toastrService.success("Record has been updated");
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
  toggleRecordDetails(item) {
    if (item.showDetails) item.showDetails = false;
    else item.showDetails = true;

    $("#togg").toggleClass("slideup slidedown");
  }
}
