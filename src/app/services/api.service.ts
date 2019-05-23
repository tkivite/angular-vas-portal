import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpResponse
} from "@angular/common/http";
import { Observable, throwError, of } from "rxjs/index";
import { catchError } from "rxjs/operators";
import { AuthenticationService } from "./authentication.service";
import { headersToString } from "selenium-webdriver/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable()
export class ApiService {
  currentUser: any;
  todate: any = "";
  datePast: any = "";
  headers: any;
  public EditFormData: any;
  public newInvoice: any;
  public currentLoggedInUser: any;
  public router: Router;
  baseUrl = "https://partner-portal-backend.herokuapp.com/";
  //baseUrl = "/api/";

  constructor(
    private http: HttpClient,
    router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.router = router;
    console.log(environment.apiUrl);
    console.log(environment);
    console.log(environment.production);
    let today = new Date();
    let dd = today.getDate();
    let ddPast = new Date();
    ddPast.setDate(ddPast.getDate() - 30);
    let stdd = "";
    let stmm = "";
    let stddPast = "";
    let stmmPast = "";
    let sttoday = "";

    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    let dayPast = ddPast.getDate();
    let mmPast = ddPast.getMonth() + 1;
    let yyyyPast = ddPast.getFullYear();

    if (dd < 10) {
      stdd = "0" + dd;
    }

    if (mm < 10) {
      stmm = "0" + mm;
    }
    this.todate = yyyy + "-" + mm + "-" + dd;
    this.datePast = yyyyPast + "-" + mmPast + "-" + dayPast;

    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      if (this.currentUser) {
        this.headers = new HttpHeaders({
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: this.currentUser.auth_token
        });
      } else {
        this.router.navigate(["login"]);
      }
    });
  }
  fetchData(
    resource,
    searchParams = {
      searchKey: "",
      action: "display",
      page: 1,
      startdate: this.datePast,
      enddate: this.todate
    }
  ): Observable<any> {
    if (this.isEmpty(searchParams)) {
      searchParams = {
        searchKey: "",
        action: "display",
        page: 1,
        startdate: this.datePast,
        enddate: this.todate
      };
    }
    console.log(searchParams);
    return this.http
      .get<any>(
        this.baseUrl + resource + "?dataparams=" + JSON.stringify(searchParams),
        {
          headers: this.headers,
          observe: "response"
        }
      )
      .pipe(catchError(this.handleError("fetchData", [])));
  }

  getRecordById(resource, id): Observable<any> {
    return this.http.get<any>(this.baseUrl + resource + "/" + id, {
      headers: this.headers,
      observe: "response"
    });
  }

  postData(resource, payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + resource, payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  createInvoice(payload = {}): Observable<any> {
    return this.http.post<any>(this.baseUrl + "invoices", payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  finishInvoice(id, payload = {}): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + "invoices/" + id + "/finish",
      payload,
      {
        headers: this.headers,
        observe: "response"
      }
    );
  }

  updateRecord(resource, id, record): Observable<any> {
    return this.http.put<any>(this.baseUrl + resource + "/" + id, record, {
      headers: this.headers,
      observe: "response"
    });
  }
  updateOneRecord(resource, id, record): Observable<any> {
    return this.http.put<any>(this.baseUrl + resource, record, {
      headers: this.headers,
      observe: "response"
    });
  }
  deleteRecord(resource, id): Observable<any> {
    return this.http.delete<any>(this.baseUrl + resource + "/" + id, {
      headers: this.headers,
      observe: "response"
    });
  }
  login(resource, payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + resource, payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  forgotpassword(payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + "passwords/forgot", payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  resendpassword(payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + "passwords/resend", payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  fetchforgotpasswordcode(payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + "passwords/send_pin", payload, {
      headers: this.headers,
      observe: "response"
    });
  }

  resetpassword(resource, payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + "passwords/reset", payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  changepassword(payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + "passwords/reset", payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  fetchpickupverificationCode(payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + "customer_pickup", payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  fetchstaffverificationCode(payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + "lipalater_pickup", payload, {
      headers: this.headers,
      observe: "response"
    });
  }
  completepickup(payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + "complete_pickup", payload, {
      headers: this.headers,
      observe: "response"
    });
  }

  private handleError1(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
  handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 401) {
        this.router.navigate(["login"]);
        return of(result as T);
        //console.error(error); // log to console
      } else {
        return of(result as T);
      }
    };
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }
}
