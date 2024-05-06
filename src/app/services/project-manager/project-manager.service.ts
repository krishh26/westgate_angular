import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export enum ProjectManagerAPIEndPoint {
  DASHBOARD_LIST = '/project/project-manager/dashboard',
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
}
