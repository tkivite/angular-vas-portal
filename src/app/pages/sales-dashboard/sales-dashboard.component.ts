import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import { ConfirmationDialogService } from "../../services/confirmation-dialog/confirmation-dialog.service";
import { AuthenticationService } from "../../services/authentication.service";
import { Chart } from "chart.js";

@Component({
  selector: "app-sales-dashboard",
  templateUrl: "./sales-dashboard.component.html",
  styleUrls: ["./sales-dashboard.component.css"]
})
export class SalesDashboardComponent implements OnInit {
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
  currentUser: any;

  LineChart = [];
  LineChart2 = [];
  loadedSalesByNumber = false;
  loadedSalesByValue = false;
  loadedOnboarding = false;
  loadedSales = false;

  labels = [];
  salesNumbers = [];
  salesValues = [];

  BarChart = [];
  PieChart = [];

  loadingIndicator: any = false;
  title = "angulardatatables";
  dtOptions: DataTables.Settings = {};

  @ViewChild("lineChart") private chartRef;
  chart: any;

  @ViewChild("lineChart2") private chartRef2;
  chart2: any;

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
  }

  getData() {
    //this.blockUI.start("Loading dashboard");

    this.loadingIndicator = true;
    if (
      this.currentUser.user.role == "Lipalater admin" ||
      this.currentUser.user.role == "Lipalater Super admin"
    ) {
      this.dataservice.fetchData("dashboard/sales_monthly_numbers").subscribe(
        data => {
          console.log(data);
          if (data.status === 200) {
            console.log(data.body);
            this.getSalesByValue();
            this.data = data.body;
            let sales_numbers = [];
            sales_numbers = data.body.sales_numbers;
            let sales_months = sales_numbers.map(e => e.mmyyyy);
            let sales_all_stats = sales_numbers.map(e => e.all_stats);
            let sales_pending = sales_numbers.map(e => e.pending);
            let sales_collected = sales_numbers.map(e => e.collected);

            this.salesNumbers = sales_collected.reverse();
            this.loadedSalesByNumber = true;
            let labels = sales_months
              .reverse()
              .map(e => this.dataservice.monthNumToName(e.split("-")[1]));
            this.chart = new Chart(this.chartRef.nativeElement, {
              type: "line",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "All Items Sold",
                    data: this.salesNumbers,
                    fill: false,
                    lineTension: 0.2,
                    borderColor: "#7BA73A",
                    backgroundColor: "#7BA73A",
                    borderWidth: 1
                  },
                  {
                    label: "All Pending Items",
                    data: sales_pending.reverse(),
                    fill: false,
                    lineTension: 0.2,
                    borderColor: "#DB5F8A",
                    backgroundColor: "#DB5F8A",
                    borderWidth: 1
                  },
                  {
                    label: "All Items Added",
                    data: sales_all_stats.reverse(),
                    fill: false,
                    lineTension: 0.2,
                    borderColor: "#E2AE9D",
                    backgroundColor: "#E2AE9D",
                    borderWidth: 1
                  }
                ]
              },
              options: {
                title: {
                  text: "Sales Item Chart",
                  display: true
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true
                      }
                    }
                  ],
                  xAxes: [
                    {
                      display: true,
                      scaleLabel: {
                        display: true,
                        labelString: "Last 12 months"
                      }
                    }
                  ]
                }
              }
            });

            // this.blockUI.stop();
          } else {
            // this.blockUI.stop();
            this.toastrService.error(
              "Something Went Wrong, We could not complete the request"
            );
          }
        },
        err => {
          if (err.status === 401) {
            this.router.navigate(["login"]);
            //this.blockUI.stop();
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
  getSalesByValue() {
    //  this.blockUI.start("Loading dashboard");

    this.loadingIndicator = true;
    if (
      this.currentUser.user.role == "Lipalater admin" ||
      this.currentUser.user.role == "Lipalater Super admin"
    ) {
      this.dataservice.fetchData("dashboard/sales_monthly_value").subscribe(
        data => {
          console.log(data);
          if (data.status === 200) {
            console.log(data.body);
            //this.data = data.body;
            let sales_values = [];
            sales_values = data.body.sales_value;
            let sales_months = sales_values.map(v => v.mmyyyy);
            let sales_all_stats = sales_values.map(v => v.all_stats);
            let sales_pending = sales_values.map(v => v.pending);
            let value_collected = sales_values.map(v => v.collected);

            this.salesValues = value_collected.reverse();
            this.loadedSalesByValue = true;
            this.getStats();
            let labels = sales_months
              .reverse()
              .map(e => this.dataservice.monthNumToName(e.split("-")[1]));

            this.chart2 = new Chart(this.chartRef2.nativeElement, {
              type: "line",
              data: {
                labels: labels,
                datasets: [
                  {
                    label: "All Sales By Value",
                    data: this.salesValues,
                    fill: false,
                    lineTension: 0.2,
                    borderColor: "#7BA73A",
                    backgroundColor: "#7BA73A",
                    borderWidth: 1
                  },
                  {
                    label: "All Pending Sales",
                    data: sales_pending.reverse(),
                    fill: false,
                    lineTension: 0.2,
                    borderColor: "#DB5F8A",
                    backgroundColor: "#DB5F8A",
                    borderWidth: 1
                  },
                  {
                    label: "All Value Added",
                    data: sales_all_stats.reverse(),
                    fill: false,
                    lineTension: 0.2,
                    borderColor: "#E2AE9D",
                    backgroundColor: "#E2AE9D",
                    borderWidth: 1
                  }
                ]
              },
              options: {
                title: {
                  text: "Sales Value Chart",
                  display: true
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true
                      }
                    }
                  ],
                  xAxes: [
                    {
                      display: true,
                      scaleLabel: {
                        display: true,
                        labelString: "Last 12 months"
                      }
                    }
                  ]
                }
              }
            });
          } else {
            // this.blockUI.stop();
            this.toastrService.error(
              "Something Went Wrong, We could not complete the request"
            );
          }
        },
        err => {
          if (err.status === 401) {
            this.router.navigate(["login"]);
            // this.blockUI.stop();
            this.toastrService.error("Unauthorised");
          } else {
            console.log(
              "Something Went Wrong, We could not complete the request"
            );
            // this.blockUI.stop();
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

  getStats() {
    //  this.blockUI.start("Loading dashboard");

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
            //this.blockUI.stop();
            this.loadedOnboarding = true;
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
            //this.blockUI.stop();
            this.toastrService.error("Unauthorised");
          } else {
            console.log(
              "Something Went Wrong, We could not complete the request"
            );
            // this.blockUI.stop();
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
          this.pending = data.body.pending.slice(0, 5);
          this.collected = data.body.collected.slice(0, 5);
          this.pending_count = data.body.pending_count;
          this.pending_value = data.body.pending_value;
          this.collected_count = data.body.collected_count;
          this.collected_value = data.body.collected_value;
          //this.blockUI.stop();
          this.loadedSales = true;
        } else {
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      },
      err => {
        if (err.status === 401) {
          this.router.navigate(["login"]);
          //this.blockUI.stop();
          this.toastrService.error("Unauthorised");
        } else {
          console.log(
            "Something Went Wrong, We could not complete the request"
          );
          // this.blockUI.stop();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      }
    );
  }
}
