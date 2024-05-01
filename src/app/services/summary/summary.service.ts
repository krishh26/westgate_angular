import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';


export enum SummaryEndPoint {
  SUMMARY_ADD = '/summary-question/create',
  DELETE_SUMMARY = '/summary-question/delete/'
}

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  baseUrl!: string;

  constructor(
    private httpClient: HttpClient,
  ) {
    this.baseUrl = environment.baseUrl;
  }

  addSummary(payload: any): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + SummaryEndPoint.SUMMARY_ADD, payload);
  }

  deleteSummary(summaryId: any): Observable<any> {
    return this.httpClient
      .delete<any>(this.baseUrl + SummaryEndPoint.DELETE_SUMMARY + summaryId);
  }

}
