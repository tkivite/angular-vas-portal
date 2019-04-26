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
import "datatables.net";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"]
})
export class UsersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public currentActive: any = "GRID";
  public noDataDisplay: any = { emptyMessage: "No data to display" };
  public recordCount = 0;
  currentUser: any;

  searchKey = "";
  /* currentPage = 1;
  dataSize = 1000;
  pageSize = 25;
  pages = 0; */

  loadingIndicator: any = false;
  title = "angulardatatables";
  dtOptions: DataTables.Settings = {};
  @ViewChild("myTable") table: any;
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

  ngOnInit() {
    $(document).ready(function() {
      $(".dataTables_empty").html("");
      $(".dataTables_info").html("");
      $(".dataTables_length").html(
        '<a class="btn btn-infor btn-sm mb-1" (click)="onAdd()" type="button"><i class="fa fa-plus"></i> Add user</a>'
      );
    });
    this.dtOptions = {
      dom: "rtip",
      pageLength: 20,
      serverSide: false,
      processing: false,
      paging: true,
      pagingType: "full_numbers"
    };
    $("#users-table").DataTable(this.dtOptions);
  }
  // Load Grid Data
  getData(searchKey = "", currentPage = 1) {
    this.blockUI.start("Loading Users .............");

    this.loadingIndicator = true;
    this.dataservice.fetchData("users/stores", searchKey).subscribe(
      data => {
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body;
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
    this.router.navigate(["users/update"]);
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
    this.getData(this.searchKey);
  }
  // loadPage(n) {
  //   this.currentPage = n;
  //   //console.log("Loading Page: " + n);
  //   this.getData(this.searchKey, this.currentPage);
  // }
}
