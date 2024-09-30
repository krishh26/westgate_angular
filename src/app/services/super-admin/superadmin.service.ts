import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

export enum SuperAdminEndPoint {
  DASHBOARD_LIST = '/user/admin/dashboard',
  SUPER_Statistics = '/user/admin/suppleir-statictics',
  CATEGORY_LIST = '/category/list',
  INDUSTRY_LIST = '/industry/list',
  SUPPLIER_LIST = '/user/suplier/list'
}


@Injectable({
  providedIn: 'root'
})
export class SuperadminService {

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
      .get<any>(this.baseUrl + SuperAdminEndPoint.DASHBOARD_LIST);
  }

  getsuperstatictics(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SuperAdminEndPoint.SUPER_Statistics);
  }

  getIndustryList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SuperAdminEndPoint.INDUSTRY_LIST);
  }

  getCategoryList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SuperAdminEndPoint.CATEGORY_LIST);
  }

  getSupplierList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SuperAdminEndPoint.SUPPLIER_LIST);
  }

}
