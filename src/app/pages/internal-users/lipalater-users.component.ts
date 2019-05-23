import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { DomSanitizer } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { ApiService } from "../../services/api.service";
import { AuthenticationService } from "../../services/authentication.service";
import { ConfirmationDialogService } from "../../services/confirmation-dialog/confirmation-dialog.service";

import * as $ from "jquery";

@Component({
  selector: "app-users",
  templateUrl: "./lipalater-users.component.html",
  styleUrls: ["./lipalater-users.component.css"]
})
export class LipalaterUsersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public currentActive: any = "GRID";
  public noDataDisplay: any = { emptyMessage: "No data to display" };
  public recordCount = 0;
  currentUser: any;

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
    private dataservice: ApiService,
    private authenticationService: AuthenticationService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
    this.router = router;
    this.getData();
  }

  ngOnInit() {}
  // Load Grid Data
  getData() {
    this.blockUI.start("Loading Users .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("users/lipalater", this.searchParams).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.data = JSON.parse(data.body.users);
          //pagination params
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
    // this.blockUI.stop();
    this.loadingIndicator = false;
  }
  onEdit(data) {
    console.log(data);
    this.dataservice.EditFormData = data;
    this.router.navigate(["lipalater-users/update"]);
  }
  onDelete(record) {
    this.confirmationDialogService
      .confirm(
        "Please confirm..",
        "Do you really want to delete the user record ?"
      )
      .then(confirmed => {
        console.log(record);
        this.blockUI.start("Deleting User ........");

        this.dataservice.deleteRecord("users", record.id).subscribe(
          data => {
            console.log(data);
            if (data.status === 200) {
              console.log(data.body);
              this.data = data.body;
              this.blockUI.stop();
              this.toastrService.success("Record has been trashed");
              this.router.routeReuseStrategy.shouldReuseRoute = function() {
                return false;
              };
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
    this.router.navigate(["users/create"]);
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
