import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import { ConfirmationDialogService } from "../../services/confirmation-dialog/confirmation-dialog.service";

import * as $ from "jquery";
import "datatables.net";

@Component({
  selector: "app-store",
  templateUrl: "./store.component.html",
  styleUrls: ["./store.component.css"]
})
export class StoreComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public currentActive: any = "GRID";
  public noDataDisplay: any = { emptyMessage: "No data to display" };
  public recordCount = 0;
  searchKey = "";

  searchParams: any = {};
  startdateRange = "";
  enddateRange = "";

  loadingIndicator: any = false;
  title = "angulardatatables";

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

  ngOnInit() {}
  // Load Grid Data
  getData() {
    this.blockUI.start("Loading Stores .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("stores", this.searchParams).subscribe(
      data => {
        //console.log(data);
        if (data.status === 200) {
          //console.log(data.body);
          this.data = JSON.parse(data.body.stores);
          //pagination params
          console.log(this.data);
          this.total_records = data.body.total_records;
          this.page_size = this.data.length;
          this.total_pages = Math.ceil(this.total_records / this.page_size);
          this.blockUI.stop();
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
  onEdit(data) {
    console.log(data);
    this.dataservice.EditFormData = data;
    this.router.navigate(["onboarding/stores/update"]);
  }
  onDelete(record) {
    this.confirmationDialogService
      .confirm(
        "Please confirm..",
        "Do you really want to delete the store record ?"
      )
      .then(confirmed => {
        console.log(record);
        this.blockUI.start("Deleting Partner Record ........");
        console.log(record);
        this.blockUI.start("Deleting Store Record ........");

        this.dataservice.deleteRecord("stores", record.id).subscribe(
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
            console.log(
              "Something Went Wrong, We could not complete the request"
            );
            this.blockUI.stop();
            this.toastrService.error(
              "Something Went Wrong, We could not complete the request"
            );
          }
        );
        // this.router.navigate(['onboarding']);

        console.log("User confirmed:", confirmed);
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  onAdd() {
    this.router.navigate(["stores/create"]);
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
}
