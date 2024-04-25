import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

export enum SupplierAdminEndPoint {
  DASHBOARD_LIST = '/project/dashboard',
  ADD_CASESTUDY = 'case-study/create',
  // PROJECT_DETAILS = '/project/get/',
  MANAGE_USER_LIST = '/user/suplier',
  ADD_USER = '/user/suplier/register'
}

@Injectable({
  providedIn: 'root'
})
export class SupplierAdminService {

  baseUrl!: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.baseUrl = environment.baseUrl;
  }

  getDashboardList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SupplierAdminEndPoint.DASHBOARD_LIST);
  }

  getManageUserList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SupplierAdminEndPoint.MANAGE_USER_LIST);
  }

  addCaseStudy(payload:any) {
    return this.httpClient
      .post<any>(this.baseUrl + SupplierAdminEndPoint.ADD_CASESTUDY, payload);
  }

  addUser(payload:any) {
    return this.httpClient
      .post<any>(this.baseUrl + SupplierAdminEndPoint.ADD_USER, payload);
  }

}
