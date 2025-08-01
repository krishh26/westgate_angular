import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { environment } from 'src/environment/environment';
import { Observable } from 'rxjs';

export enum SuperAdminEndPoint {
  DASHBOARD_LIST = '/user/admin/dashboard',
  SUPER_Statistics = '/user/admin/suppleir-statictics',
  CATEGORY_LIST = '/category/list',
  INDUSTRY_LIST = '/industry/list',
  SUPPLIER_LIST = '/user/suplier/list',
  SUPPLIER_REGISTER = '/web-user/register',
  SUPPLIERUSER_LIST = '/user/suplier/list',
  PROJECT_MAIL_SEND = '/project/new-project-mail',
  CREATE_TASK = '/task/create',
  GET_TASK = '/task/list',
  TASK_GRAPH = '/task/graph',
  ADD_COMMENTS = '/task/add-comment/',
  UPDATE_TASK = '/task/update',
  UPDATE_COMMENT = '/task/update-comment',
  DELETE_NO_SUPPLIER_COMMENT = '/task/delete-comment',
  APPOINT_FEASIBLITY_USER = '/project/update/appoint-user',
  APPOINT_BID_USER = '/project/update/appoint-bidmanager',
  APPROVE_OR_REJECT = '/project/update/approve-reject',
  APPROVE_OR_REJECT_SUPERADMIN = '/project/update/approve-reject-admin',
  ADD_IMAGE_PROJECT_DETAILS = '/project-detail-title/update/',
  GET_GAP_ANALYSIS = '/project/gap-analysis',
  GET_GAP_ANALYSIS_DROPPERD_AFTER_FEASIBILITY = '/project/gap-analysis-dafstatus-reason',
  GET_GAP_ANALYSIS_NO_SUPPLIER_MATCHED = '/project/gap-analysis-nosuppliermatched-reason',
  EXPORT_EXCEL = '/project/export-csv',
  EXPORT_DATABASE = '/database/export',
  UPLOAD_BY_TAGS = '/web-user/uploadByTag',
  DELETE_EXPERTISE_DOCUMENT = '/web-user/deleteFile',
  EXPERTISE_LIST = '/web-user/expertise-list',
  GET_SUPPLIER_EXPERTISE = '/web-user/get-suppliers',
  USER_UPDATE = '/user/update',
  CANDIDATE_ADD = '/candidate/add',
  CANDIDATE_GET = '/candidate/get',
  CANDIDATE_GET_LIST = '/candidate/get-list',
  CANDIDATE_SUPPLIER_WISE = '/candidate/get/',
  CANDIDATE_LIST = '/candidate/list',
  ADD_EXPERTISE_AND_SUBEXPERTISE = '/web-user/add-expertise',
  ROLES_LIST = '/roles/get-all',
  ROLES_GET_LIST = '/roles/get-list',
  ROLES_ADD = '/roles/add',
  ROLES_DELETE = '/roles/delete',
  ROLES_CANDIDATES = '/roles/candidates',
  DELETE_CANDIDATE = '/candidate/delete',
  CANDIDATE_UPDATE = '/candidate/update',
  GET_SUBTASKS = '/task/subtasks',
  SELECT_FROM_SORTLIST = '/project/select-from-sortlist',
  REMOVE_FROM_SHORTLIST = '/project/remove-from-sortlist',
  GET_EXPERTISE_DROPDOWN = '/web-user/drop-down',
  GET_EXPERTISE_DROPDOWN_LIST = '/web-user/drop-down-list',
  SUB_EXPERTISE_DROPDOWN = '/web-user/sub-expertise/list',
  ADD_SUB_EXPERTISE = '/web-user/add-sub-expertise',
  CREATE_CUSTOM_EXPERTISE = '/web-user/masterlist/custom',
  DELETE_EXPERTISE = '/web-user/expertise',
  DELETE_SUB_EXPERTISE = '/web-user/expertise/:id/subexpertise',
  DELETE_SUB_EXPERTISE_BY_ID = '/sub-expertise/delete',
  GET_TECHNOLOGIES = '/tech-language/technologies',
  CREATE_TECHNOLOGY = '/tech-language/create',
  DELETE_TECHNOLOGY = '/tech-language/technologies/_id',
  GET_CANDIDATES_BY_TECHNOLOGY = '/tech-language/:technology/candidates',
  DELETE_CASE_STUDY = '/case-study/delete/',
  WITHOUT_SUPPLIER_SUB_EXPERTISE_DROPDOWN = '/sub-expertise/list',
  PROMOTE_EXPERTISE = '/web-user/masterlist/promote',
  USER_LIST = '/user/list',
  USER_REGISTER = '/user/register',
  USER_DELETE = '/user/delete',
  POUND_RATE_GET = '/pound-rate',
  POUND_RATE_UPDATE = '/pound-rate',
  UPDATE_ATTENDEE = '/project/update-attendee',
  GET_TAGS = '/tags',
  ADD_TAG = '/tags/add',
  DELETE_TAG = '/tags/delete'
}

@Injectable({
  providedIn: 'root',
})
export class SuperadminService {
  private baseUrl = 'https://api.westgateithub.com/api/v1';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    // this.baseUrl = environment.baseUrl; // This line is removed as per the new_code
  }

  exportProjects() {
    window.open(this.baseUrl + SuperAdminEndPoint.EXPORT_EXCEL, "_blank");
  }

  exportDatabase() {
    window.open(this.baseUrl + SuperAdminEndPoint.EXPORT_DATABASE, "_blank");
  }

  getDashboardList(params: any): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.DASHBOARD_LIST,
      { params }
    );
  }

  getSupplierListsExpertiseWise(params: any): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_SUPPLIER_EXPERTISE,
      { params }
    );
  }


  getGapAnalysis(params: HttpParams): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_GAP_ANALYSIS,
      { params }
    );
  }


  getGapAnalysisNosupplierMatched(params: any): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_GAP_ANALYSIS_NO_SUPPLIER_MATCHED,
      { params }
    );
  }

  getGapAnalysisDroppedafterFeasibility(params: any): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_GAP_ANALYSIS_DROPPERD_AFTER_FEASIBILITY,
      { params }
    );
  }

  getsuperstatictics(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.SUPER_Statistics
    );
  }

  projectMailSend(): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.PROJECT_MAIL_SEND,
      {}
    );
  }

  getIndustryList(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.INDUSTRY_LIST
    );
  }

  getCategoryList(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.CATEGORY_LIST
    );
  }

  getSupplierList(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.SUPPLIER_LIST
    );
  }

  supplierregister(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.SUPPLIER_REGISTER,
      payload
    );
  }

  getSUpplierList(params: any): Observable<any> {
    const url = `${this.baseUrl}${SuperAdminEndPoint.SUPPLIERUSER_LIST}`;
    let queryParams = new HttpParams();

    if (params?.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params?.limit) {
      queryParams = queryParams.set('limit', params.limit);
    }
    if (params?.startDate) {
      queryParams = queryParams.set('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams = queryParams.set('endDate', params.endDate);
    }
    if (params?.search) {
      queryParams = queryParams.set('search', params.search);
    }

    // Add status parameter for active/inactive filter
    if (params?.active !== undefined) {
      queryParams = queryParams.set('status', String(params.active));
    }

    // Add resource sharing filter
    if (params?.resourceSharingSupplier !== undefined) {
      queryParams = queryParams.set('resourceSharing', String(params.resourceSharingSupplier));
    }

    // Add subcontracting filter
    if (params?.subcontractingSupplier !== undefined) {
      queryParams = queryParams.set('subContracting', String(params.subcontractingSupplier));
    }

    // Add isDeleted filter
    if (params?.isDeleted !== undefined) {
      queryParams = queryParams.set('isDeleted', String(params.isDeleted));
    }

    // Add inHold filter
    if (params?.inHold !== undefined) {
      queryParams = queryParams.set('inHold', String(params.inHold));
    }

    // Add countOnly parameter to get just the count when we're paginating
    if (params?.countOnly !== undefined) {
      queryParams = queryParams.set('countOnly', String(params.countOnly));
    }

    return this.httpClient.get<any>(url, { params: queryParams });
  }

  createTask(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.CREATE_TASK,
      payload
    );
  }

  uploadByTag(payload: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.UPLOAD_BY_TAGS,
      payload
    );
  }

  getExpertiseList(params: any = {}): Observable<any> {
    const url = `${this.baseUrl}${SuperAdminEndPoint.EXPERTISE_LIST}`;
    let queryParams = new HttpParams();

    // if (params?.page) {
    //   queryParams = queryParams.set('page', params.page);
    // }
    // if (params?.limit) {
    //   queryParams = queryParams.set('limit', params.limit);
    // }
    if (params?.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params?.startDate) {
      queryParams = queryParams.set('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams = queryParams.set('endDate', params.endDate);
    }

    return this.httpClient.get<any>(url, { params: queryParams });
  }

  deleteDocumentExpertise(fileId: string): Observable<any> {
    const url = `${this.baseUrl}${SuperAdminEndPoint.DELETE_EXPERTISE_DOCUMENT}`;
    const body = { fileId };

    return this.httpClient.request<any>('DELETE', url, { body });
  }


  updateTask(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.UPDATE_TASK + '/' + id,
      payload
    );
  }

  updateComment(payload: any, taskId?: string, userId?: string): Observable<any> {
    if (taskId) {
      return this.httpClient.patch<any>(
        this.baseUrl + SuperAdminEndPoint.UPDATE_COMMENT + '/' + taskId,
        payload
      );
    }
    return this.httpClient.put<any>(
      this.baseUrl + '/tasks/comments/' + payload.commentId,
      payload
    );
  }

  getTask(assignId: string): Observable<any> {
    let params = new HttpParams();
    if (assignId) {
      params = params.set('assignTo', assignId);
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TASK,
      { params }
    );
  }

  getsuperadmintasks(assignId: string, status?: string, sort?: string, pickACategory?: string, keyword?: string, myDay?: boolean, type?: string, page?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();

    if (page && pageSize) {
      params = params.set('page', Number(page));
      params = params.set('limit', Number(pageSize));
    }

    if (assignId) {
      params = params.set('assignTo', assignId);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (sort) { // Add sorting parameter
      params = params.set('sort', sort);
    }
    if (pickACategory) {
      params = params.set('pickACategory', pickACategory);
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (myDay) {
      params = params.set('myDay', myDay.toString());
    }
    if (type) {
      params = params.set('type', type.toString());
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TASK,
      { params }
    );
  }


  getMyTask(assignId: string, myDay: boolean, sort?: string, pickACategory?: string, keyword?: string, page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();

    if (page && limit) {
      params = params.set('page', Number(page));
      params = params.set('limit', Number(limit));
    }

    if (assignId) {
      params = params.set('assignTo', assignId);
    }
    if (myDay) {
      params = params.set('myDay', myDay.toString());
    }
    if (sort) { // Add sorting parameter
      params = params.set('sort', sort);
    }
    if (pickACategory) {
      params = params.set('pickACategory', pickACategory);
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TASK,
      { params }
    );
  }

  getTaskUserwise(queryParams: { [key: string]: any }, page?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();

    if (page && pageSize) {
      params = params.set('page', Number(page));
      params = params.set('limit', Number(pageSize));
    }

    Object.entries(queryParams).forEach(([key, value]) => {
      params = params.set(key, value.toString());
    });
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TASK,
      { params }
    );
  }

  addComments(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.ADD_COMMENTS + id,
      payload
    );
  }

  appointFeasibilityUser(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.APPOINT_FEASIBLITY_USER + '/' + id,
      payload
    );
  }

  appointBidUser(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.APPOINT_BID_USER + '/' + id,
      payload
    );
  }

  approveOrRejectProject(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.APPROVE_OR_REJECT + '/' + id,
      payload
    );
  }

  approveOrRejectProjectsuperAdmin(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.APPROVE_OR_REJECT_SUPERADMIN + '/' + id,
      payload
    );
  }

  updateProjectDetails(payload: any, id: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.ADD_IMAGE_PROJECT_DETAILS + id,
      payload
    );
  }

  updateSupplierExpertise(supplierId: string, expertiseData: any): Observable<any> {
    const headers = { 'supplierId': supplierId };

    return this.httpClient.patch<any>(
      `${this.baseUrl}${SuperAdminEndPoint.USER_UPDATE}/${supplierId}`,
      expertiseData,
      { headers }
    );
  }

  addCandidate(candidateData: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.baseUrl}${SuperAdminEndPoint.CANDIDATE_ADD}`,
      candidateData
    );
  }

  addExpertiseandSubExpertise(candidateData: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.baseUrl}${SuperAdminEndPoint.ADD_EXPERTISE_AND_SUBEXPERTISE}`,
      candidateData
    );
  }


  getCandidatesBySupplier(supplierId: string): Observable<any> {
    return this.httpClient.get<any>(
      `${this.baseUrl}${SuperAdminEndPoint.CANDIDATE_GET}/${supplierId}`
    );
  }

  getCandidatesList(page: number, limit: number, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.httpClient.get<any>(
      `${this.baseUrl}${SuperAdminEndPoint.CANDIDATE_GET_LIST}`,
      { params }
    );
  }

  getCandidatesByListId(listId: string, page: number, limit: number, isExecutive?: boolean): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (isExecutive !== undefined) {
      params = params.set('executive', isExecutive.toString());
    }

    return this.httpClient.get<any>(
      `${this.baseUrl}${SuperAdminEndPoint.CANDIDATE_LIST}/${listId}`,
      { params }
    );
  }

  getRolesList(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();

    if (params.startDate) {
      queryParams = queryParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams = queryParams.set('endDate', params.endDate);
    }
    if (params.search) {
      queryParams = queryParams.set('search', params.search);
    }

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.ROLES_LIST,
      { params: queryParams }
    );
  }

  getRolesListNew(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();

    if (params.startDate) {
      queryParams = queryParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams = queryParams.set('endDate', params.endDate);
    }
    if (params.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params.page) {
      queryParams = queryParams.set('page', params.page.toString());
    }
    if (params.limit) {
      queryParams = queryParams.set('limit', params.limit.toString());
    }

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.ROLES_GET_LIST,
      { params: queryParams }
    );
  }

  addRole(roleData: { name: string }): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.ROLES_ADD,
      roleData
    );
  }

  deleteRole(roleId: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.baseUrl + SuperAdminEndPoint.ROLES_DELETE + '/' + roleId
    );
  }

  deleteDocumentResource(fileId: string) {
    return this.httpClient.delete(`${this.baseUrl}/delete-document-resource/${fileId}`);
  }

  getCandidatesByRole(roleIdWithParams: string): Observable<any> {
    // The method already receives the full URL with query parameters appended
    // We're simply passing it through
    return this.httpClient.get<any>(
      `${this.baseUrl}${SuperAdminEndPoint.ROLES_CANDIDATES}/${roleIdWithParams}`
    );
  }

  getRoleById(roleId: string) {
    return this.httpClient.get(`${this.baseUrl}/roles/${roleId}`);
  }

  updateRole(roleId: string, data: any) {
    return this.httpClient.patch(`${this.baseUrl}/roles/update/${roleId}`, data);
  }

  deleteCandidate(candidateId: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.baseUrl + SuperAdminEndPoint.DELETE_CANDIDATE + '/' + candidateId
    );
  }

  updateCandidate(candidateId: string, payload: any): Observable<any> {
    return this.httpClient.patch(`${this.baseUrl}/candidate/update/${candidateId}`, payload);
  }

  updateCommentPin(taskId: string, commentId: string, payload: any) {
    return this.httpClient.patch(`${this.baseUrl}/task/${taskId}/comments/${commentId}/pin`, payload);
  }

  // Toggle pin status of a comment
  togglePinComment(payload: any, taskId: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/tasks/${taskId}/comments/toggle-pin`, payload);
  }

  // Delete a comment
  deleteComment(commentId: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/tasks/comments/${commentId}`);
  }

  addSubtask(taskId: string, subtaskData: any) {
    return this.httpClient.post(`${this.baseUrl}/task/${taskId}/subtasks/add`, subtaskData);
  }

  getCandidateList() {
    return this.httpClient.get(`${this.baseUrl}/candidate/get-list`);
  }

  getSubtasks(taskId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}${SuperAdminEndPoint.GET_SUBTASKS}/${taskId}`);
  }

  deleteSubtask(taskId: string, subtaskId: string) {
    return this.httpClient.delete(`${this.baseUrl}/task/${taskId}/subtasks/${subtaskId}`);
  }

  logoutTask() {
    return this.httpClient.post(`${this.baseUrl}/task/logout`, {});
  }

  selectFromSortlist(data: { userId: string; projectId: string; isSelected: boolean }): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.SELECT_FROM_SORTLIST,
      data
    );
  }

  removeFromShortlist(userId: string, projectId: string): Observable<any> {
    const payload = {
      userId,
      projectId
    };
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.REMOVE_FROM_SHORTLIST,
      payload
    );
  }

  // Get task details by ID
  getTaskDetails(taskId: string) {
    return this.httpClient.get(`${this.baseUrl}/task/detail/${taskId}`);
  }

  getExpertiseDropdown(type?: string): Observable<any> {
    let params = new HttpParams();

    if (type) {
      params = params.set('type', type);
    }

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_EXPERTISE_DROPDOWN,
      { params }
    );
  }

  getExpertiseDropdownList(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();

    // Always add role=admin as a static parameter
    queryParams = queryParams.set('role', 'admin');

    if (params.type) {
      queryParams = queryParams.set('type', params.type);
    }
    if (params.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params.limit) {
      queryParams = queryParams.set('limit', params.limit);
    }
    if (typeof params.isSystem !== 'undefined') {
      queryParams = queryParams.set('isSystem', String(params.isSystem));
    }

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_EXPERTISE_DROPDOWN,
      { params: queryParams }
    );
  }

  getExpertiseDropdownByType(type: string): Observable<any> {
    let params = new HttpParams();

    // Set type and role=admin as required parameters
    params = params.set('type', type);
    params = params.set('role', 'admin');

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_EXPERTISE_DROPDOWN,
      { params }
    );
  }

  getSubExpertiseDropdownList(searchText?: string): Observable<any> {
    let params = new HttpParams();

    if (searchText) {
      params = params.set('search', searchText);
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.SUB_EXPERTISE_DROPDOWN,
      { params }
    );
  }

  getWithoutSupplierSubExpertiseDropdownList(searchText?: string): Observable<any> {
    let params = new HttpParams();

    if (searchText) {
      params = params.set('search', searchText);
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.WITHOUT_SUPPLIER_SUB_EXPERTISE_DROPDOWN,
      { params }
    );
  }

  addSubExpertise(subExpertiseData: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.ADD_SUB_EXPERTISE,
      subExpertiseData
    );
  }

  createCustomExpertise(expertiseData: { name: string; type: string; value?: string }): Observable<any> {
    // If value is not provided, use name as the value
    const payload = {
      ...expertiseData,
      value: expertiseData.value || expertiseData.name
    };
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.CREATE_CUSTOM_EXPERTISE,
      payload
    );
  }

  deleteExpertise(expertiseId: string, supplierId: string): Observable<any> {
    const url = `${this.baseUrl}${SuperAdminEndPoint.DELETE_EXPERTISE}/${expertiseId}`;
    return this.httpClient.request<any>('DELETE', url, {
      body: { supplierId }
    });
  }

  deleteExpertiseWithoutSupplier(expertiseId: string): Observable<any> {
    const url = `${this.baseUrl}${SuperAdminEndPoint.DELETE_EXPERTISE}/${expertiseId}`;
    return this.httpClient.request<any>('DELETE', url);
  }

  deleteSubExpertise(expertiseId: string, subExpertise: string, supplierId: string): Observable<any> {
    const url = `${this.baseUrl}${SuperAdminEndPoint.DELETE_SUB_EXPERTISE.replace(':id', expertiseId)}`;
    const body = { subExpertise, supplierId };

    return this.httpClient.request<any>('DELETE', url, { body });
  }

  getTechnologies(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();

    if (params.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params.limit) {
      queryParams = queryParams.set('limit', params.limit);
    }

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TECHNOLOGIES,
      { params: queryParams }
    );
  }

  getAllRoles(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();

    if (params?.search) {
      queryParams = queryParams.set('search', params.search);
    }
    // Add type=main parameter
    queryParams = queryParams.set('type', 'main');

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.ROLES_LIST,
      { params: queryParams }
    );
  }

  getRolesListByAdmin(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();

    if (params?.search) {
      queryParams = queryParams.set('search', params.search);
    }
    // Add role=admin parameter
    queryParams = queryParams.set('role', 'admin');
    if (params?.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params?.limit) {
      queryParams = queryParams.set('limit', params.limit);
    }
    if (params?.type) {
      queryParams = queryParams.set('type', params.type);
    }

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.ROLES_GET_LIST,
      { params: queryParams }
    );
  }

  deleteCaseStudy(caseStudyId: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.baseUrl + SuperAdminEndPoint.DELETE_CASE_STUDY + caseStudyId
    );
  }

  createTechnology(technologyData: { name: string }): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.CREATE_TECHNOLOGY,
      { name: technologyData.name }
    );
  }

  deleteTechnology(technologyId: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.baseUrl + SuperAdminEndPoint.DELETE_TECHNOLOGY.replace('_id', technologyId)
    );
  }

  deleteSubExpertiseById(subExpertiseId: string): Observable<any> {
    return this.httpClient.delete<any>(
      this.baseUrl + SuperAdminEndPoint.DELETE_SUB_EXPERTISE_BY_ID + '/' + subExpertiseId
    );
  }

  addSubExpertiseByName(name: string): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + '/sub-expertise/add',
      { name }
    );
  }

  getTaskGraph(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();

    // Add params to HttpParams
    Object.keys(params).forEach(key => {
      if (key === 'userIds' && params[key]) {
        // Fix leading/trailing comma issues
        let userIds = params[key];

        // Clean up userIds by removing any leading or trailing commas
        userIds = userIds.replace(/^,|,$/g, '');

        // Only add the parameter if there are actually userIds after cleaning
        if (userIds.length > 0) {
          queryParams = queryParams.set('userIds', userIds);
        }
      } else {
        queryParams = queryParams.set(key, params[key]);
      }
    });

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.TASK_GRAPH,
      { params: queryParams }
    );
  }

  promoteExpertise(payload: { itemId: string, promoteToType?: string, isMandatory?: boolean }): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.PROMOTE_EXPERTISE,
      payload
    );
  }

  // User Management Methods
  getAllUsers(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();

    if (params?.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params?.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params?.limit) {
      queryParams = queryParams.set('limit', params.limit);
    }
    if (params?.userRoles) {
      queryParams = queryParams.set('userRoles', params.userRoles);
    }

    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.USER_LIST,
      { params: queryParams }
    );
  }

  registerUser(userData: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.USER_REGISTER,
      userData
    );
  }

  deleteUser(userId: string): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('id', userId);

    return this.httpClient.delete<any>(
      this.baseUrl + SuperAdminEndPoint.USER_DELETE,
      { params: queryParams }
    );
  }

  updateUser(userData: any) {
    return this.httpClient.patch(`${this.baseUrl}/user/update/${userData._id}`, userData);
  }

  // Pound Rate Methods
  /**
   * Get current pound rate
   * GET /pound-rate
   * Expected response: { status: boolean, data: { rate: number } } or { status: boolean, rate: number }
   */
  getPoundRate(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.POUND_RATE_GET
    );
  }

  /**
   * Update pound rate
   * POST /pound-rate
   * Payload: { rate: number }
   */
  updatePoundRate(data: { rate: number }): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.POUND_RATE_UPDATE,
      data
    );
  }

  updateAttendee(payload: { projectId: string, supplierId: string, attendee: boolean, comment?: string }): Observable<any> {
    return this.httpClient.patch<any>(
      this.baseUrl + SuperAdminEndPoint.UPDATE_ATTENDEE,
      payload
    );
  }

  getTags(options: { params?: HttpParams } = {}): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_TAGS,
      options
    );
  }

  addTag(tagData: { name: string }): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + SuperAdminEndPoint.ADD_TAG,
      tagData
    );
  }

  deleteTag(tagId: string): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.baseUrl}${SuperAdminEndPoint.DELETE_TAG}/${tagId}`
    );
  }

  updateTag(tagId: string, data: { name: string }): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}/tags/update/${tagId}`,
      data
    );
  }

  deleteNoSupplierComment(taskId: string, commentId: number): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}${SuperAdminEndPoint.DELETE_NO_SUPPLIER_COMMENT}/${taskId}`,
      { commentId }
    );
  }

  updateTechnology(technologyId: string, data: { name: string }): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}${SuperAdminEndPoint.GET_TECHNOLOGIES}/${technologyId}`,
      data
    );
  }

  updateSubExpertise(subExpertiseId: string, data: { name: string }): Observable<any> {
    return this.httpClient.patch<any>(
      `${this.baseUrl}/sub-expertise/update/${subExpertiseId}`,
      data
    );
  }

  getSupplierDetails(id: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/user/suplier/get/${id}`);
  }

  getSuppliersByExpertise(expertiseName: string) {
    return this.httpClient.get<any>(
      `${this.baseUrl}/web-user/expertise/${encodeURIComponent(expertiseName)}/suppliers`
    );
  }

  getCandidatesByTechnology(technologyName: string, page: number = 1, limit: number = 10): Observable<any> {
    const url = this.baseUrl + SuperAdminEndPoint.GET_CANDIDATES_BY_TECHNOLOGY.replace(':technology', technologyName);
    let queryParams = new HttpParams();
    queryParams = queryParams.set('page', page.toString());
    queryParams = queryParams.set('limit', limit.toString());
    return this.httpClient.get<any>(url, { params: queryParams });
  }

  /**
   * Get Other Expertise List (isSystem=false)
   */
  getOtherExpertiseList(params: any = {}): Observable<any> {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('isSystem', 'false');
    if (params.type) {
      queryParams = queryParams.set('type', params.type);
    }
    if (params.search) {
      queryParams = queryParams.set('search', params.search);
    }
    if (params.page) {
      queryParams = queryParams.set('page', params.page);
    }
    if (params.limit) {
      queryParams = queryParams.set('limit', params.limit);
    }
    return this.httpClient.get<any>(
      this.baseUrl + SuperAdminEndPoint.GET_EXPERTISE_DROPDOWN_LIST,
      { params: queryParams }
    );
  }
}
