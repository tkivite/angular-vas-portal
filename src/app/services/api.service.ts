import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/index";
import { AuthenticationService } from "./authentication.service";
import { headersToString } from "selenium-webdriver/http";

@Injectable()
export class ApiService {
  currentUser: any;
  headers: any;
  public EditFormData: any;
  public currentLoggedInUser: any;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
      this.headers = new HttpHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: this.currentUser.auth_token
      });
    });
  }
  baseUrl = "/api/";
  fetchData(resource, searchKey = "", page = 1): Observable<any> {
    return this.http.get<any>(
      this.baseUrl + resource + "?searchkey=" + searchKey + "&page=" + page,
      {
        headers: this.headers,
        observe: "response"
      }
    );
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

  updateRecord(resource, id, record): Observable<any> {
    return this.http.put<any>(this.baseUrl + resource + "/" + id, record, {
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
}
