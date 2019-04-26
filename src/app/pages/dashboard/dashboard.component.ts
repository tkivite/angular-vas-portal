import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import { ConfirmationDialogService } from "../../services/confirmation-dialog/confirmation-dialog.service";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public router: Router;
  public data = [];
  public sales = [];
  public currentActive: any = "GRID";
  public noDataDisplay: any = { emptyMessage: "No data to display" };
  public recordCount = 0;
  reloadAttempts = 0;

  partners: any;
  stores: any;
  store_users: any;
  internal_users: any;
  collected: any;
  pending: any;
  collected_count: any;
  pending_count: any;
  collected_value: any;
  pending_value: any;

  loadingIndicator: any = false;
  title = "angulardatatables";
  dtOptions: DataTables.Settings = {};
  @ViewChild("myTable") table: any;
  constructor(
    router: Router,
    public toastrService: ToastrService,
    private dataservice: ApiService,
    private confirmationDialogService: ConfirmationDialogService,
    private authenticationService: AuthenticationService
  ) {
    this.router = router;

    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(["login"]);
    } else {
    }
  }
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.blockUI.start("Loading dashboard");

    this.loadingIndicator = true;
    this.dataservice.fetchData("dashboard/onboarding").subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body;
          this.partners = data.body.partners;
          this.stores = data.body.stores;
          this.store_users = data.body.store_users;
          this.internal_users = data.body.internal_users;
          this.getSales();
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

  getSales() {
    this.loadingIndicator = true;
    this.dataservice.fetchData("dashboard/sales").subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.sales = data.body;
          this.pending = data.body.pending;
          this.collected = data.body.collected;
          this.pending_count = data.body.pending_count;
          this.pending_value = data.body.pending_value;
          this.collected_count = data.body.collected_count;
          this.collected_value = data.body.collected_value;

          this.blockUI.stop();
        } else {
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      },
      err => {
        console.log("Something Went Wrong, We could not complete the request");

        this.toastrService.error(
          "Something Went Wrong, We could not complete the request"
        );
      }
    );
  }
}
