import { HttpClient } from '@angular/common/http';
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
  projectid! : any

  constructor(
    private httpClient: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
    this.projectid = localStorage.getItem('projectID')
  }

  getProjectList(payload: any): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectEndPoint.PROJECT_LIST, payload);
  }

  deleteProject(payload: any): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + ProjectEndPoint.DELETE_PROJECT, payload);
  }

  editProject(projectId:string,payload: any): Observable<any> {
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
  getProjectDetailsById(projectId : string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectEndPoint.PROJECT_DETAILS + projectId);
  }
}
