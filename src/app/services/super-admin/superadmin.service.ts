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
  UPDATE_COMMENT = '/task/update-comment',
  APPOINT_FEASIBLITY_USER = '/project/update/appoint-user',
  APPOINT_BID_USER = '/project/update/appoint-bidmanager',
  APPROVE_OR_REJECT = '/project/update/approve-reject',
  APPROVE_OR_REJECT_SUPERADMIN = '/project/update/approve-reject-admin',
  ADD_IMAGE_PROJECT_DETAILS = '/project-detail-title/update/',
  GET_GAP_ANALYSIS = '/project/gap-analysis',
  GET_GAP_ANALYSIS_DROPPERD_AFTER_FEASIBILITY = '/project/gap-analysis-dafstatus-reason',
  GET_GAP_ANALYSIS_NO_SUPPLIER_MATCHED = '/project/gap-analysis-nosuppliermatched-reason',
  EXPORT_EXCEL = '/project/export-csv'
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

  exportProjects() {
    window.open(this.baseUrl + SuperAdminEndPoint.EXPORT_EXCEL, "_blank");
  }

  getDashboardList(params: any): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.DASHBOARD_LIST,
      { params }
    );
  }

  getGapAnalysis(params: HttpParams): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_GAP_ANALYSIS,
      { params }
    );
  }


  getGapAnalysisNosupplierMatched(params: any): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_GAP_ANALYSIS_NO_SUPPLIER_MATCHED,
      { params }
    );
  }

  getGapAnalysisDroppedafterFeasibility(params: any): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_GAP_ANALYSIS_DROPPERD_AFTER_FEASIBILITY,
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

  updateComment(payload: any, id: string, taskID: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.UPDATE_COMMENT + '/' + taskID,
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

  getsuperadmintasks(assignId: string, status?: string, sort?: string, pickACategory?: string, keyword?: string, myDay?: boolean, type?: string): Observable<any> {
    let params = new HttpParams();

    if (assignId) {
      params = params.set('assignTo', assignId);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (sort) { // Add sorting parameter
      params = params.set('sort', sort);
    }
    if (pickACategory) {
      params = params.set('pickACategory', pickACategory);
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (myDay) {
      params = params.set('myDay', myDay.toString());
    }
    if (type) {
      params = params.set('type', type.toString());
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TASK,
      { params }
    );
  }


  getMyTask(assignId: string, myDay: boolean, sort?: string, pickACategory?: string, keyword?: string): Observable<any> {
    let params = new HttpParams();
    if (assignId) {
      params = params.set('assignTo', assignId);
    }
    if (myDay) {
      params = params.set('myDay', myDay.toString());
    }
    if (sort) { // Add sorting parameter
      params = params.set('sort', sort);
    }
    if (pickACategory) {
      params = params.set('pickACategory', pickACategory);
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TASK,
      { params }
    );
  }

  getTaskUserwise(queryParams: { [key: string]: any }): Observable<any> {
    let params = new HttpParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
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

  appointFeasibilityUser(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.APPOINT_FEASIBLITY_USER + '/' + id,
      payload
    );
  }

  appointBidUser(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.APPOINT_BID_USER + '/' + id,
      payload
    );
  }

  approveOrRejectProject(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.APPROVE_OR_REJECT + '/' + id,
      payload
    );
  }

  approveOrRejectProjectsuperAdmin(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.APPROVE_OR_REJECT_SUPERADMIN + '/' + id,
      payload
    );
  }

  updateProjectDetails(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.ADD_IMAGE_PROJECT_DETAILS + id,
      payload
    );
  }
}
