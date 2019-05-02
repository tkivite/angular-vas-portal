﻿import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  baseUrl: string;
  //baseUrl = "https://partner-portal-backend.herokuapp.com/";

  constructor(private http: HttpClient) {
    console.log(environment.apiUrl);
    if (environment.production) {
      this.baseUrl = "https://partner-portal-backend.herokuapp.com/";
    } else {
      this.baseUrl = "/api/";
    }
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(postData) {
    return this.http.post<any>(this.baseUrl + "authenticate", postData).pipe(
      map(user => {
        console.log("from api" + user);
        // login successful if there's a jwt token in the response
        if (user && user.auth_token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          user.passsword = postData.password;
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
