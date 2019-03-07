import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs/index";

class ApiResponse {
    status: number;
    message: string;
    result: any;
    }
  
@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }
  baseUrl: string = '/api/';

  fetchData(resource): Observable<any> {
    return this.http.get<any>(this.baseUrl+resource);
  }

  getRecordById(resource,id): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + resource + id);
  }

  postData(resource,payload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, payload);
  }

  updateRecord(resource,record): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + resource, record);
  }
  deleteRecord(resource,id): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + resource + id);
  }
}


