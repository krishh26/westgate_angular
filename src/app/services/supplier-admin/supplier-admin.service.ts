import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

export enum SupplierAdminEndPoint {
  DASHBOARD_LIST = '/project/dashboard',
  ADD_FOI = '/foi/create',
  FOI_EDIT = '/foi/update',
  DELETE_FOI = '/foi/delete',
  // PROJECT_DETAILS = '/project/get/'
}

@Injectable({
  providedIn: 'root'
})
export class SupplierAdminService {

  baseUrl!: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.baseUrl = environment.baseUrl;
  }

  getDashboardList(): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + SupplierAdminEndPoint.DASHBOARD_LIST);
  }



}
