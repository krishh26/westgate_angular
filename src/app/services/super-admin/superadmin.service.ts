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
  PROJECT_MAIL_SEND = '/project/new-project-mail',
  CREATE_TASK = '/task/create',
  GET_TASK = '/task/list',
  ADD_COMMENTS = '/task/add-comment/',
  UPDATE_TASK = '/task/update',
}

@Injectable({
  providedIn: 'root',
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
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.DASHBOARD_LIST,
      { params }
    );
  }

  getsuperstatictics(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.SUPER_Statistics
    );
  }

  projectMailSend(): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.PROJECT_MAIL_SEND,
      {}
    );
  }

  getIndustryList(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.INDUSTRY_LIST
    );
  }

  getCategoryList(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.CATEGORY_LIST
    );
  }

  getSupplierList(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.SUPPLIER_LIST
    );
  }

  supplierregister(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.SUPPLIER_REGISTER,
      payload
    );
  }

  getSUpplierList(params: { page: string; limit: string }): Observable<any> {
    const url = `${this.baseUrl}${SuperAdminEndPoint.SUPPLIERUSER_LIST}`;
    let queryParams = new HttpParams();
    queryParams = queryParams.set('page', params?.page);
    queryParams = queryParams.set('limit', params?.limit);
    return this.httpClient.get<any>(url, { params: queryParams });
  }

  createTask(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.CREATE_TASK,
      payload
    );
  }

  updateTask(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.UPDATE_TASK + '/' + id,
      payload
    );
  }

  getTask(assignId: string): Observable<any> {
    let params = new HttpParams();
    if (assignId) {
      params = params.set('assignTo', assignId);
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TASK,
      { params }
    );
  }

  getTaskUserwise(userId: string): Observable<any> {
    const params = new HttpParams().set('assignTo', userId);
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TASK,
      { params }
    );
  }

  addComments(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.ADD_COMMENTS + id,
      payload
    );
  }
}
