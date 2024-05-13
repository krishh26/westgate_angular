import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export enum ProjectCoordinatorAPIEndPoint {
  DASHBOARD_LIST = '/project/project-coordinator/dashboard',
}

@Injectable({
  providedIn: 'root'
})
export class ProjectCoordinatorService {
  baseUrl!: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  // Get project manager dashboard data
  getDashboardList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + ProjectCoordinatorAPIEndPoint.DASHBOARD_LIST);
  }
}
