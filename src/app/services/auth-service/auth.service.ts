import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Observable } from 'rxjs';

export enum AuthEndPoint {
  LOGIN_USER = '/user/login',
  CHANGE_PASSWORD = '/user/change-password/',
  FORGOT_PASSWORD = '/user/forgot'
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
      .post<any>(this.baseUrl + AuthEndPoint.LOGIN_USER, payload ,{ headers: this.getHeader() });
  }

  forgotPassword(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + AuthEndPoint.FORGOT_PASSWORD, payload);
  }

  changePassword(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + AuthEndPoint.CHANGE_PASSWORD, payload);
  }

}
