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
  title = "angulardatatables";
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
  getData() {
    this.blockUI.start("Loading All Sales .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("sales").subscribe(
      data => {
        if (data.status === 200) {
          console.log(data.body);
          this.data = data.body;
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
}
