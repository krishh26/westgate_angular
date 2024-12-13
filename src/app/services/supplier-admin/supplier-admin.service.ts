import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

export enum SupplierAdminEndPoint {
  DASHBOARD_LIST = '/project/dashboard',
  ADD_CASESTUDY = '/case-study/create',
  // PROJECT_DETAILS = '/project/get/',
  MANAGE_USER_LIST = '/user/suplier',
  ADD_USER = '/user/suplier/register',
  UPDATE_USER = '/user/update/',
  CASE_STUDY_LIST = '/case-study/list',
  ADD_CASE_STUDY = '/case-study/create',
  UPDATE_CASE_STUDY = '/case-study/update/',
  DELETE_USER = '/user/delete/',
  DELETE_SUPPLIER_USER = '/user/delete',
  SUPPLIER_DETAILS = '/user/suplier/get',
  SUPPLIER_ACTIVITY = '/user/login-details',
  STATUS_WISE_COUNT_VALUE = '/project/status-count-value'
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

  getCaseStudyList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SupplierAdminEndPoint.CASE_STUDY_LIST);
  }

  getSupplierDetails(supplierId: any): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SupplierAdminEndPoint.SUPPLIER_DETAILS + '/' + supplierId);
  }

  getDataBYStatus(params: {
    startDate?: string;
    endDate?: string;
  }): Observable<any> {
    const url = `${this.baseUrl}${SupplierAdminEndPoint.STATUS_WISE_COUNT_VALUE}`;
    let queryParams = new HttpParams();
  
    if (params.startDate) {
      queryParams = queryParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams = queryParams.set('endDate', params.endDate);
    }
  
    return this.httpClient.get<any>(url, { params: queryParams });
  }
  

  getSupplierActivity(supplierId: any): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SupplierAdminEndPoint.SUPPLIER_ACTIVITY + '/' + supplierId);
  }


  getadminCaseStudyList(params: {
    userId: string,
    page: string,
    limit: string,
  }): Observable<any> {
    const url = `${this.baseUrl}${SupplierAdminEndPoint.CASE_STUDY_LIST}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.set('userId', params?.userId || '');
    queryParams = queryParams.set('page', params?.page);
    queryParams = queryParams.set('limit', params?.limit);
    return this.httpClient.get<any>(url, { params: queryParams });
  }

  getManageUserList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SupplierAdminEndPoint.MANAGE_USER_LIST);
  }

  getsupplierManageUserList(
    params: {
      userId: string,
      page: string,
      limit: string,
    }
  ): Observable<any> {

    const url = `${this.baseUrl}${SupplierAdminEndPoint.MANAGE_USER_LIST}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.set('userId', params?.userId || '');
    queryParams = queryParams.set('page', params?.page);
    queryParams = queryParams.set('limit', params?.limit);
    return this.httpClient.get<any>(url, { params: queryParams });

  }

  addCaseStudy(payload: any) {
    return this.httpClient
      .post<any>(this.baseUrl + SupplierAdminEndPoint.ADD_CASESTUDY, payload);
  }

  updateCaseStudy(payload: any, id: string) {
    return this.httpClient
      .patch<any>(this.baseUrl + SupplierAdminEndPoint.UPDATE_CASE_STUDY
        + id, payload);
  }

  updateSuppilerDetails(payload: any, id: string) {
    return this.httpClient
      .patch<any>(this.baseUrl + SupplierAdminEndPoint.UPDATE_USER
        + id, payload);
  }

  addUser(payload: any) {
    return this.httpClient
      .post<any>(this.baseUrl + SupplierAdminEndPoint.ADD_USER, payload);
  }

  deleteSupplierUser(id: string): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + SupplierAdminEndPoint.DELETE_SUPPLIER_USER + '?id=' + id);
  }

  deleteUser(params: { id: string }): Observable<any> {
    const url = `${this.baseUrl}${SupplierAdminEndPoint.DELETE_USER}`;

    let queryParams = new HttpParams();
    queryParams = queryParams.set('id', params.id || '');
    return this.httpClient.delete<any>(url, { params: queryParams });
  }
}
