import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export enum FeasibilityEndPoint {
  DOCUMENT_UPLOAD = '/project/upload',
  UPDATE_PROJECT_FESIBILITY = "/project/update/Feasibility/",
  UPDATE_PROJECT_BID = '/project/update/'

}
@Injectable({
  providedIn: 'root'
})
export class FeasibilityService {
  baseUrl!: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  // Get project manager dashboard data
  uploadDocument(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + FeasibilityEndPoint.DOCUMENT_UPLOAD, payload);
  }

  // update project API
  updateProjectDocs(payload: any, projectId: string): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + FeasibilityEndPoint.DOCUMENT_UPLOAD + projectId, payload);
  }

  updateProjectDetails(payload: any, projectId: string): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + FeasibilityEndPoint.UPDATE_PROJECT_FESIBILITY + projectId, payload);
  }

  updateProjectDetailsBid(payload: any, projectId: string): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + FeasibilityEndPoint.UPDATE_PROJECT_BID + projectId, payload);
  }

}
