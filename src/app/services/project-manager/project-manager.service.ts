import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export enum ProjectManagerAPIEndPoint {
  DASHBOARD_LIST = '/project/project-manager/dashboard',
  USER_LIST = '/user/list/',
  DROP_USER = '/project/update/project-manager/'
}

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {
  baseUrl!: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  // Get project manager dashboard data
  getDashboardList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectManagerAPIEndPoint.DASHBOARD_LIST);
  }
  getUserList(userRoles: string): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectManagerAPIEndPoint.USER_LIST + `?userRoles=${userRoles}`);
  }

  getUserAllList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectManagerAPIEndPoint.USER_LIST);
  }

  getUserallList(taskCount: any, taskPage: any,pickACategory? :any, type? :any): Observable<any> {
    let params = new HttpParams().set('taskPage', taskPage); // Always set taskPage

    if (taskCount) {
      params = params.set('taskCount', taskCount);
    }

    if (type) {
      params = params.set('type', type);
    }

    if (pickACategory) {
      params = params.set('pickACategory', pickACategory);
    }

    return this.httpClient.get<any>(
      this.baseUrl + ProjectManagerAPIEndPoint.USER_LIST,
      { params }
    );
  }


  getUserListProjectManager(userRoles: string, projectId: any): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}${ProjectManagerAPIEndPoint.USER_LIST}?userRoles=${userRoles}&projectId=${projectId}`
    );
  }


  dropUser(payload: any, id: string): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + ProjectManagerAPIEndPoint.DROP_USER + id, payload);
  }
}
