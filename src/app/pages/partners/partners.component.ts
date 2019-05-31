import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import * as $ from "jquery";

import { ConfirmationDialogService } from "../../services/confirmation-dialog/confirmation-dialog.service";

@Component({
  selector: "app-partners",
  templateUrl: "./partners.component.html",
  styleUrls: ["./partners.component.css"]
})
export class PartnerComponent implements OnInit {
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
  searchParams: any = {};
  startdateRange = "";
  enddateRange = "";

  @ViewChild("myTable") table: any;
  constructor(
    router: Router,
    public toastrService: ToastrService,
    private dataservice: ApiService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.router = router;
  }

  ngOnInit() {
    this.getData();
  }
  // Load Grid Data
  getData() {
    this.blockUI.start("Loading Partners .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("partners", this.searchParams).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body.partners;
          //pagination params
          this.total_records = data.body.total_records;
          this.page_size = this.data.length;
          this.total_pages = Math.ceil(this.total_records / this.page_size);

          this.blockUI.stop();
        } else if (data.status === 401) {
          this.router.navigate(["login"]);
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.toastrService.error(data.message);
        }
      },
      err => {
        console.log(err);
        if (err.status === 401) {
          this.router.navigate(["login"]);
          this.blockUI.stop();
        } else {
          console.log(
            "Something Went Wrong, We could not complete the request"
          );
          this.blockUI.stop();
          this.toastrService.error(
            err.statusText ||
              "Something Went Wrong, We could not complete the request"
          );
        }
      }
    );
    // this.blockUI.stop();
  }
  onEdit(data) {
    console.log(data);
    this.dataservice.EditFormData = data;
    this.router.navigate(["onboarding/partners/update"]);
  }
  onView(data) {
    console.log(data);
    this.dataservice.EditFormData = data;
    this.router.navigate(["partners/view"]);
  }
  onDelete(record) {
    this.confirmationDialogService
      .confirm(
        "Please confirm..",
        "Do you really want to delete the partner record ?"
      )
      .then(confirmed => {
        console.log(record);
        this.blockUI.start("Deleting Partner Record ........");

        this.dataservice.deleteRecord("partners", record.id).subscribe(
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

        console.log("User confirmed:", confirmed);
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  onAdd() {
    this.router.navigate(["partners/create"]);
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
