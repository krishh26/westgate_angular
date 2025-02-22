import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export enum ProjectEndPoint {
  PROJECT_LIST = '/project/list',
  ADD_PROJECT = '/project/create',
  PROJECT_EDIT = '/project/update',
  DELETE_PROJECT = '/project/delete',
  PROJECT_DETAILS = '/project/get/',
  APPLY_PROJECT = "/project/apply",
  SORT_LIST_PROJECT = "/project/sortlist",
  SUMMARYQUESTION_LIST = "/summary-question/list/",
  QUESTION_DETAILS = '/summary-question/list/',
  UPDATE_MANAGER = '/project/update/project-manager/',
  UPDATE_PROJECTMANAGER_SUPPLIER_STATUS = '/project/add-status',
  DELETE_BULK_PROJECT = '/project/delete-multiple',
  ADD_BULK_CASESTUDY = '/case-study/create-multiple',
  CREATE_CATEGORY = '/category/create',
  CREATE_INDUSTRY = '/industry/create',
  DELETE_TASK = '/task/delete',
  REMOVE_TASK_MY_DAY = '/task/remove-myday',
  DELETE_COMMENT = '/task/delete-comment',
  PROJECT_LOGS = '/project/logs/',
  CREATE_STRIP = '/project-detail-title/create',
  PROJECT_STRIP_LIST = '/project-detail-title/list',
  ADD_TO_MY_LIST = '/project/update/my-list/',
  DELETE_STRIPS = '/project-detail-title/delete',
  DELETE_FES_BID_COMMENT = '/project/delete-comment',
  DELETE_FAILED_REASON = '/project/delete-failreason',
  DELETE_DROPPED_REASON = '/project/delete-dafstatusreason',
  DELETE_BID_COMMENT = '/project/delete-bidstatuscomment'
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  baseUrl!: string;
  projectid!: any

  constructor(
    private httpClient: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
    this.projectid = localStorage.getItem('projectID')
  }

  getProjectList(params: {
    keyword: string, page: string,
    limit: string,
    applied: boolean,
    sortlist: boolean,
    match: string,
    status: string,
    bidManagerStatus: string,
    category?: string,
    supplierId?: string,
    industry?: string,
    projectType?: string,
    clientType?: string,
    publishDateRange?: string,
    SubmissionDueDateRange?: string,
    valueRange?: any,
    selectedSupplier?: boolean // Add this line
    expired?: boolean,
    supplierStatus?: string,
    appointed?: string,
    myList?: string,
    notAppointed?: string,
    adminReview?: string,
    statusNotInclude?: string,
    startCreatedDate?: string,
    endCreatedDate?: string,
    categorisation?: string
  }): Observable<any> {
    const url = `${this.baseUrl}${ProjectEndPoint.PROJECT_LIST}`;

    let queryParams = new HttpParams();
    queryParams = queryParams.set('keyword', params?.keyword || '');
    queryParams = queryParams.set('page', params?.page);
    queryParams = queryParams.set('limit', params?.limit);
    if (params?.applied) {
      queryParams = queryParams.set('applied', params?.applied);
    }
    if (params?.sortlist) {
      queryParams = queryParams.set('sortlist', params?.sortlist);
    }
    if (params?.statusNotInclude) {
      queryParams = queryParams.set('statusNotInclude', params?.statusNotInclude);
    }
    if (params?.adminReview) {
      queryParams = queryParams.set('adminReview', params?.adminReview);
    }
    if (params?.match) {
      queryParams = queryParams.set('match', params?.match);
    }
    if (params?.status) {
      queryParams = queryParams.set('status', params?.status);
    }
    if (params?.bidManagerStatus) {
      queryParams = queryParams.set('bidManagerStatus', params?.bidManagerStatus);
    }
    if (params?.supplierStatus) {
      queryParams = queryParams.set('supplierStatus', params?.supplierStatus);
    }
    if (params?.category) {
      queryParams = queryParams.set('category', params?.category);
    }
    if (params?.supplierId) {
      queryParams = queryParams.set('supplierId', params?.supplierId);
    }
    if (params?.appointed) {
      queryParams = queryParams.set('appointed', params?.appointed);
    }
    if (params?.notAppointed) {
      queryParams = queryParams.set('notAppointed', params?.notAppointed);
    }
    if (params?.myList) {
      queryParams = queryParams.set('myList', params?.myList);
    }
    if (params?.industry) {
      queryParams = queryParams.set('industry', params?.industry);
    }

    // Ensure projectType is always passed in the URL
    if (params?.projectType !== undefined && params?.projectType !== null) {
      queryParams = queryParams.set('projectType', params.projectType.trim());
    } else {
      queryParams = queryParams.set('projectType', ''); // Ensures it's always passed
    }

    // Ensure categorisation is always passed in the URL
    if (params?.categorisation !== undefined && params?.categorisation !== null) {
      queryParams = queryParams.set('categorisation', params.categorisation.trim());
    } else {
      queryParams = queryParams.set('categorisation', ''); // Ensures it's always passed
    }


    if (params?.clientType) {
      queryParams = queryParams.set('clientType', params?.clientType);
    }
    if (params?.publishDateRange) {
      queryParams = queryParams.set('publishDateRange', params?.publishDateRange);
    }
    if (params?.SubmissionDueDateRange) {
      queryParams = queryParams.set('SubmissionDueDateRange', params?.SubmissionDueDateRange);
    }
    if (params?.startCreatedDate) {
      queryParams = queryParams.set('startCreatedDate', params?.startCreatedDate);
    }
    if (params?.endCreatedDate) {
      queryParams = queryParams.set('endCreatedDate', params?.endCreatedDate);
    }
    if (params?.valueRange) {
      queryParams = queryParams.set('valueRange', params?.valueRange);
    }
    if (params?.selectedSupplier) { // Add this condition
      queryParams = queryParams.set('selectedSupplier', params?.selectedSupplier);
    } if (params?.expired) { // Add this condition
      queryParams = queryParams.set('expired', params?.expired);
    }
    return this.httpClient.get<any>(url, { params: queryParams });
  }


  createCategory(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + ProjectEndPoint.CREATE_CATEGORY, payload);
  }

  createIndustry(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + ProjectEndPoint.CREATE_INDUSTRY, payload);
  }

  deleteProject(id: any): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + ProjectEndPoint.DELETE_PROJECT + '/' + id);
  }

  deleteTask(id: any): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + ProjectEndPoint.DELETE_TASK + '/' + id);
  }

  removeTaskFromMyDay(id: any, userId: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.REMOVE_TASK_MY_DAY + '/' + id, { userId });
  }

  deleteStrip(id: any): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + ProjectEndPoint.DELETE_STRIPS + '/' + id);
  }

  deleteComment(payload: any, id: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.DELETE_COMMENT + '/' + id, payload);
  }

  deleteFeasiblityBidComment(payload: any, id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}${ProjectEndPoint.DELETE_FES_BID_COMMENT}/${id}`,
      { body: payload }
    );
  }

  deleteBidComment(payload: any, id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}${ProjectEndPoint.DELETE_BID_COMMENT}/${id}`,
      { body: payload }
    );
  }

  deleteFailedReason(payload: any, id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}${ProjectEndPoint.DELETE_FAILED_REASON}/${id}`,
      { body: payload }
    );
  }

  deletedroppedReason(payload: any, id: any): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}${ProjectEndPoint.DELETE_DROPPED_REASON}/${id}`,
      { body: payload }
    );
  }



  deleteBulkProject(): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + ProjectEndPoint.DELETE_BULK_PROJECT);
  }

  editProject(projectId: string, payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.PROJECT_EDIT + `/${projectId}`, payload);
  }

  addProject(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + ProjectEndPoint.ADD_PROJECT, payload);
  }

  addBulkCaseStudy(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + ProjectEndPoint.ADD_BULK_CASESTUDY, payload);
  }

  getProjectDetails(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectEndPoint.PROJECT_DETAILS + this.projectid);
  }

  getSummaryQuestionList(projectId: string): Observable<any> {
    const params = new HttpParams().set('projectId', projectId);
    return this.httpClient.get<any>(this.baseUrl + ProjectEndPoint.SUMMARYQUESTION_LIST, { params });
  }

  // Darshan
  getProjectDetailsById(projectId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectEndPoint.PROJECT_DETAILS + projectId);
  }

  getProjectLogs(projectId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectEndPoint.PROJECT_LOGS + projectId);
  }

  getprojectStrips(projectId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectEndPoint.PROJECT_STRIP_LIST + '?projectId=' + projectId);
  }

  getQuestionDetailsById(projectId: string): Observable<any> {
    const params = new HttpParams().set('projectId', projectId);
    return this.httpClient.get<any>(this.baseUrl + ProjectEndPoint.QUESTION_DETAILS, { params });
  }

  projectApply(payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.APPLY_PROJECT, payload);
  }

  addToMyListBid(payload: any, projectId: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.ADD_TO_MY_LIST + projectId, payload);
  }

  changeProjectSupplierStatus(payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.UPDATE_PROJECTMANAGER_SUPPLIER_STATUS, payload);
  }

  projectSortList(payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.SORT_LIST_PROJECT, payload);
  }

  addSupplier(supplierId: any, payload: any) {
    return this.httpClient
      .patch<any>(this.baseUrl + `${ProjectEndPoint.UPDATE_MANAGER}${supplierId}`, payload, {
      });
  }

  createStrip(payload: any) {
    return this.httpClient
      .post<any>(this.baseUrl + `${ProjectEndPoint.CREATE_STRIP}`, payload, {
      });
  }

}
