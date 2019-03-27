import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/index';
import { AuthenticationService } from './authentication.service';
import { headersToString } from 'selenium-webdriver/http';

@Injectable()

export class ApiService {
 currentUser: any;
 headers: any;
 public EditFormData: any;
 public currentLoggedInUser: any;

 constructor(private http: HttpClient,private  authenticationService: AuthenticationService){
  this.authenticationService.currentUser.subscribe(x => {
    this.currentUser = x;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.currentUser.auth_token
  });
   // this.headers.append('Authorization', this.currentUser.auth_token);
   // this.headers.append('Content-Type', 'application/json');
  });
 }
  baseUrl = '/api/';
  //baseUrl = 'https://partner-portal-backend.herokuapp.com/';

  fetchData( resource ): Observable<any> {
    return this.http.get<any>(this.baseUrl + resource, {headers: this.headers, observe: 'response'});
   }

  getRecordById( resource, id ): Observable<any> {
    return this.http.get<any>(this.baseUrl + resource + '/' + id, { headers: this.headers, observe: 'response'});
  }

  postData(resource,payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + resource, payload, { headers: this.headers, observe: 'response'});
  }

  updateRecord(resource, id, record): Observable<any> {
    return this.http.put<any>(this.baseUrl + resource + '/' + id, record,{headers: this.headers, observe: 'response'});
  }
  deleteRecord(resource,id): Observable<any> {
    return this.http.delete<any>(this.baseUrl + resource + '/' + id, {headers: this.headers, observe: 'response'});
  }
  login(resource,payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + resource, payload, { headers: this.headers, observe: 'response'});
  }
}


