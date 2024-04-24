import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export enum ProjectEndPoint {
  PROJECT_LIST = '/project/list',
  ADD_PROJECT = '/project/create',
  PROJECT_EDIT = '/project/update',
  DELETE_PROJECT = '/project/delete',
  PROJECT_DETAILS = '/project/get/'
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

  // getProjectList(payload: any): Observable<any> {
  //   return this.httpClient
  //     .get<any>(this.baseUrl + ProjectEndPoint.PROJECT_LIST, payload);
  // }

  getProjectList(params: { keyword: string, page: string, limit: string }): Observable<any> {
    const url = `${this.baseUrl}${ProjectEndPoint.PROJECT_LIST}`;

    let queryParams = new HttpParams();
    queryParams = queryParams.set('keyword', params.keyword || '');
    queryParams = queryParams.set('page', params.page);
    queryParams = queryParams.set('limit', params.limit);

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

  // Darshan
  getProjectDetailsById(projectId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectEndPoint.PROJECT_DETAILS + projectId);
  }
}
