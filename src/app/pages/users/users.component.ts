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
  //pagination
  current_page = 1;
  total_records = 0;
  page_size = 25;
  total_pages = 1;

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
  }

  ngOnInit() {
    this.getData();
  }
  // Load Grid Data
  getData(searchKey = "", currentPage = 1) {
    this.blockUI.start("Loading Users .....");
    this.loadingIndicator = true;
    this.dataservice
      .fetchData("users/stores", searchKey, currentPage)
      .subscribe(
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
          console.log(
            "Something Went Wrong, We could not complete the request"
          );
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
  //.then((confirmed) => console.log('User confirmed:', confirmed))
  //.catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  onDelete(record) {
    this.confirmationDialogService
      .confirm(
        "Please confirm..",
        "Do you really want to delete the user record ?"
      )
      .then(confirmed => {
        console.log(record);
        this.blockUI.start("Deleting User ........");

        this.dataservice.deleteRecord("users/stores", record.id).subscribe(
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
    this.getData(this.searchKey, 1);
  }
  loadPage(i) {
    this.current_page = i;
    this.getData(this.searchKey, i);
  }
}
