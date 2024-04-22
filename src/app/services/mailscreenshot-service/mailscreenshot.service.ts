import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

export enum MailScreenshotEndPoint {
  MAILSCREENSHOT_LIST = '/mail-screenshot/list',
  ADD_MAILSCREENSHOT = '/mail-screenshot/create',
  MAILSCREENSHOT_EDIT = '/mail-screenshot/update',
  DELETE_MAILSCREENSHOT = '/mail-screenshot/delete',
  // PROJECT_DETAILS = '/project/get/'
}
@Injectable({
  providedIn: 'root'
})
export class MailscreenshotService {

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
      .get<any>(this.baseUrl + MailScreenshotEndPoint.MAILSCREENSHOT_LIST, payload);
  }

  deleteProject(payload: any): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + MailScreenshotEndPoint.DELETE_MAILSCREENSHOT, payload);
  }

  editProject(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + MailScreenshotEndPoint.MAILSCREENSHOT_EDIT, payload);
  }

  addProject(payload: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseUrl + MailScreenshotEndPoint.ADD_MAILSCREENSHOT, payload);
  }




}
