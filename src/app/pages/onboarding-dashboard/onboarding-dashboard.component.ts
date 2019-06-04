import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ApiService } from "../../services/api.service";
import { ConfirmationDialogService } from "../../services/confirmation-dialog/confirmation-dialog.service";
import { AuthenticationService } from "../../services/authentication.service";
import { Chart } from "chart.js";
import { reduce } from "rxjs/operators";

@Component({
  selector: "app-onboarding-dashboard",
  templateUrl: "./onboarding-dashboard.component.html",
  styleUrls: ["./onboarding-dashboard.component.css"]
})
export class OnboardingDashboardComponent implements OnInit {
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
  partnersdata: any;
  loadedPartnersData = false;
  loadedStoresData = false;
  storesdata: any;

  LineChart = [];
  BarChart = [];
  PieChart = [];

  loadingIndicator: any = false;
  title = "angulardatatables";
  dtOptions: DataTables.Settings = {};
  @ViewChild("lineChart3") private chartRef;
  chart3: any;

  @ViewChild("lineChart4") private chartRef2;
  chart4: any;

  searchParams: any = {};
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
    this.getPartnerGraphData();
    this.getPartnersData();
    this.getStoresData();
  }

  getData() {
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
            this.blockUI.stop();
            // this.toastrService.error("Unauthorised");
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
    }
  }

  getPartnerGraphData() {
    console.log("partnerGraph");
    this.loadingIndicator = true;
    let endpoint = "dashboard/partners_monthly_numbers";
    console.log(endpoint);

    this.dataservice.fetchData(endpoint).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          this.getStoreGraphData();
          console.log(data.body);
          this.sales = data.body;
          let partner_numbers = data.body.partner_trend;
          let partner_monthly_numbers = partner_numbers.map(
            e => e.partner_count
          );
          let sales_months = partner_numbers.map(e => e.mmyyyy);

          let labels = sales_months
            .reverse()
            .map(e => this.dataservice.monthNumToName(e.split("-")[1]));

          this.chart3 = new Chart(this.chartRef.nativeElement, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Number of Partners Added per Month",
                  data: partner_monthly_numbers.reverse(),
                  fill: true,
                  lineTension: 0.2,
                  borderColor: "#C83D71",
                  backgroundColor: "#DB5F8A",
                  borderWidth: 1
                }
              ]
            },
            options: {
              title: {
                text: "Partners Chart",
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

          this.blockUI.stop();
        } else {
          this.getStoreGraphData();
          this.toastrService.error(
            "Something Went Wrong, We could not complete the request"
          );
        }
      },
      err => {
        this.getStoreGraphData();
        if (err.status === 401) {
          this.router.navigate(["login"]);
          this.blockUI.stop();
          // this.toastrService.error("Unauthorised");
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

  getStoreGraphData() {
    this.loadingIndicator = true;
    let endpoint = "dashboard/stores_monthly_numbers";
    // if (
    //   this.currentUser.user.role == "Lipalater admin" ||
    //   this.currentUser.user.role == "Lipalater Super admin"
    // ) {
    //   endpoint = "dashboard/sales";
    // }

    this.dataservice.fetchData(endpoint).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.sales = data.body;

          let store_numbers = [];
          store_numbers = data.body.store_trend;
          let store_monthly_numbers = store_numbers.map(e => e.store_count);
          let store_months = store_numbers.map(e => e.mmyyyy);

          let labels = store_months
            .reverse()
            .map(e => this.dataservice.monthNumToName(e.split("-")[1]));

          this.chart4 = new Chart(this.chartRef2.nativeElement, {
            type: "line",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Number of Stores Added per Month",
                  data: store_monthly_numbers.reverse(),
                  fill: true,
                  lineTension: 0.2,
                  borderColor: "#C83D71",
                  backgroundColor: "#E2AE9D",
                  borderWidth: 1
                }
              ]
            },
            options: {
              title: {
                text: "Stores Chart",
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
  getPartnersData() {
    this.dataservice.fetchData("partners", this.searchParams).subscribe(
      data => {
        console.log(data);
        if (data.status === 200) {
          console.log(data.body);
          this.partnersdata = data.body.partners.slice(0, 5);
          this.loadedPartnersData = true;
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
  }

  getStoresData() {
    this.dataservice.fetchData("stores", this.searchParams).subscribe(
      data => {
        if (data.status === 200) {
          this.storesdata = JSON.parse(data.body.stores).slice(0, 5);
          this.loadedStoresData = true;
          console.log(this.data);

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
}
