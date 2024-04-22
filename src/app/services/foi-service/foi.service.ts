import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

export enum FOIEndPoint {
  FOI_LIST = '/foi/list',
  ADD_FOI = '/foi/create',
  FOI_EDIT = '/foi/update',
  DELETE_FOI = '/foi/delete',
  // PROJECT_DETAILS = '/project/get/'
}

@Injectable({
  providedIn: 'root'
})
export class FoiService {


  baseUrl!: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.baseUrl = environment.baseUrl;
  }

  getProjectList(payload: any): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + FOIEndPoint.FOI_LIST, payload);
  }

  deleteProject(payload: any): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + FOIEndPoint.DELETE_FOI, payload);
  }

  editProject(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + FOIEndPoint.FOI_EDIT, payload);
  }

  addProject(payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + FOIEndPoint.ADD_FOI, payload);
  }
}
