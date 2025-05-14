import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Observable } from 'rxjs';

export enum AuthEndPoint {
  LOGIN_USER = '/user/login',
  CHANGE_PASSWORD = '/user/change-password',
  FORGOT_PASSWORD = '/user/forgot',
  USER_LIST = '/user/list',
  USER_DATA = '/user/get',
  SUPPLIER_USER_DATA = "/web-user/get",
  UPDATE_USER = '/user/update',
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl!: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.baseUrl = environment.baseUrl;
  }

  getHeader(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return headers;
  }

  loginUser(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + AuthEndPoint.LOGIN_USER, payload, { headers: this.getHeader() });
  }

  logout(): void {
    this.localStorageService.clearStorage();
    this.router.navigateByUrl('/');
  }

  forgotPassword(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + AuthEndPoint.FORGOT_PASSWORD, payload);
  }

  changePassword(payload: any , id:any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + AuthEndPoint.CHANGE_PASSWORD + '/' + id, payload );
  }

  getUserList(userRoles: string, additionalParams?: any): Observable<any> {
    // Construct parameters
    let params = new HttpParams().set('userRoles', userRoles);

    // Add additional parameters if provided
    if (additionalParams) {
      // Add date filter parameters if present
      if (additionalParams.startDate) {
        params = params.set('startDate', additionalParams.startDate);
      }
      if (additionalParams.endDate) {
        params = params.set('endDate', additionalParams.endDate);
      }

      // Add any other additional parameters that might be in the payload
      Object.keys(additionalParams).forEach(key => {
        if (key !== 'role' && key !== 'startDate' && key !== 'endDate') {
          params = params.set(key, additionalParams[key]);
        }
      });
    }

    // Make the GET request with parameters
    return this.httpClient.get<any>(this.baseUrl + '/user/list', { params: params });
  }

  getUserData(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + AuthEndPoint.USER_DATA);
  }

  // Function to get supplier admin data
  getSupplierAdminUserData(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + AuthEndPoint.SUPPLIER_USER_DATA);
  }

  updateUser(userId:string,payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + AuthEndPoint.UPDATE_USER + `/${userId}`, payload);
  }
}
