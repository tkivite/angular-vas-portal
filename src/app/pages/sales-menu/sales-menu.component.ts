import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import { ConfirmationDialogService } from "../../services/confirmation-dialog/confirmation-dialog.service";
import { AuthenticationService } from "../../services/authentication.service";
import { Chart } from "chart.js";

@Component({
  selector: "app-sales-menu",
  templateUrl: "./sales-menu.component.html",
  styleUrls: ["./sales-menu.component.css"]
})
export class SalesMenuComponent implements OnInit {
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
  cancelled: any;
  collected: any;
  pending: any;
  collected_count: any;
  pending_count: any;
  cancelled_count: any;
  cancelled_value: any;
  collected_value: any;
  pending_value: any;
  currentUser: any;

  LineChart = [];
  BarChart = [];
  PieChart = [];

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
      this.authenticationService.currentUser.subscribe(
        x => (this.currentUser = x)
      );
    }
  }
  ngOnInit() {
    this.getData();

    this.LineChart = new Chart("lineChart", {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        datasets: [
          {
            label: "Number of Items Sold in Months",
            data: [9, 7, 3, 5, 2, 10, 15, 16, 19, 3, 1, 9],
            fill: true,
            lineTension: 0.2,
            borderColor: "red",
            borderWidth: 1
          }
        ]
      },
      options: {
        title: {
          text: "Line Chart",
          display: true
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    // Bar chart:
    this.BarChart = new Chart("barChart", {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [9, 7, 3, 5, 2, 10],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        title: {
          text: "Bar Chart",
          display: true
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    // pie chart:
    this.PieChart = new Chart("pieChart", {
      type: "pie",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [9, 7, 3, 5, 2, 10],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        title: {
          text: "Bar Chart",
          display: true
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }

  getData() {
    this.blockUI.start("Loading dashboard");

    this.loadingIndicator = true;
    if (
      this.currentUser.user.role == "Lipalater admin" ||
      this.currentUser.user.role == "Lipalater Super admin"
    ) {
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
          if (err.status === 401) {
            this.router.navigate(["login"]);
            this.blockUI.stop();
            this.toastrService.error("Unauthorised");
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
    } else {
      this.getSales();
    }
  }

  getSales() {
    this.loadingIndicator = true;
    let endpoint = "dashboard/salesbystore";
    if (
      this.currentUser.user.role == "Lipalater admin" ||
      this.currentUser.user.role == "Lipalater Super admin"
    ) {
      endpoint = "dashboard/sales";
    }

    this.dataservice.fetchData(endpoint).subscribe(
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

          this.cancelled_count = data.body.cancelled_count;
          this.cancelled_value = data.body.cancelled_value;

          this.blockUI.stop();
        } else {
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
          this.blockUI.stop();
          this.toastrService.error("Unauthorised");
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
  }
}
