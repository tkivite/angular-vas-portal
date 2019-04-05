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
    this.blockUI.start("Loading Partners .....");
    this.loadingIndicator = true;
    this.dataservice.fetchData("partners").subscribe(
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
        console.log("SSomething Went Wrong, We could not complete the request");
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
    this.router.navigate(["partners/update"]);
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
}
