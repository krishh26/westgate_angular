import { HttpClient, HttpParams } from '@angular/common/http';
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
  SUPPLIER_LIST = '/user/suplier/list',
  SUPPLIER_REGISTER = '/web-user/register',
  SUPPLIERUSER_LIST = '/user/suplier/list',
  PROJECT_MAIL_SEND = '/project/new-project-mail'
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

  getDashboardList(params: any): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SuperAdminEndPoint.DASHBOARD_LIST, { params });
  }

  getsuperstatictics(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SuperAdminEndPoint.SUPER_Statistics);
  }

  projectMailSend(): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + SuperAdminEndPoint.PROJECT_MAIL_SEND, {});
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

  supplierregister(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + SuperAdminEndPoint.SUPPLIER_REGISTER, payload);
  }


  getSUpplierList(
    params: {
      page: string,
      limit: string,
    }): Observable<any> {
    const url = `${this.baseUrl}${SuperAdminEndPoint.SUPPLIERUSER_LIST}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.set('page', params?.page);
    queryParams = queryParams.set('limit', params?.limit);
    return this.httpClient.get<any>(url, { params: queryParams });
  }

}
