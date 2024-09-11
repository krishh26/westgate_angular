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
    keyword: string, page: string, limit: string, applied: boolean, sortlist: boolean, match: string, status: string, category?: string,
    industry?: string,
    projectType?: string,
    clientType?: string,
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
    if (params?.match) {
      queryParams = queryParams.set('match', params?.match);
    }
    if (params?.status) {
      queryParams = queryParams.set('status', params?.status);
    }
    if (params?.category) {
      queryParams = queryParams.set('category', params?.category);
    }
    if (params?.industry) {
      queryParams = queryParams.set('industry', params?.industry);
    }
    if (params?.projectType) {
      queryParams = queryParams.set('projectType', params?.projectType);
    }
    if (params?.clientType) {
      queryParams = queryParams.set('clientType', params?.clientType);
    }
    return this.httpClient.get<any>(url, { params: queryParams });
  }

  deleteProject(payload: any): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + ProjectEndPoint.DELETE_PROJECT, payload);
  }

  editProject(projectId: string, payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.PROJECT_EDIT + `/${projectId}`, payload);
  }

  addProject(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + ProjectEndPoint.ADD_PROJECT, payload);
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

  getQuestionDetailsById(projectId: string): Observable<any> {
    const params = new HttpParams().set('projectId', projectId);
    return this.httpClient.get<any>(this.baseUrl + ProjectEndPoint.QUESTION_DETAILS, { params });
  }

  projectApply(payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectEndPoint.APPLY_PROJECT, payload);
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
}
