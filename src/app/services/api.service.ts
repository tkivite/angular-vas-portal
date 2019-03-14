import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs/index";

@Injectable()
export class ApiService {

 public EditFormData: any;

  constructor(private http: HttpClient) { }
  baseUrl: string = '/api/';

  fetchData(resource): Observable<any> {
    return this.http.get<any>(this.baseUrl+resource, {observe: 'response'});
  }

  getRecordById(resource,id): Observable<any> {
    return this.http.get<any>(this.baseUrl + resource + '/'+id, {observe: 'response'});
  }

  postData(resource,payload): Observable<any> {
    return this.http.post<any>(this.baseUrl + resource, payload,{observe: 'response'});
  }

  updateRecord(resource,id,record): Observable<any> {
    return this.http.put<any>(this.baseUrl + resource + '/'+id, record,{observe: 'response'});
  }
  deleteRecord(resource,id): Observable<any> {
    return this.http.delete<any>(this.baseUrl + resource + '/'+id, {observe: 'response'});
  }
}


