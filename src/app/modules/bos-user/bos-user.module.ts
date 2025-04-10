import { TodoTaskViewDetailsComponent } from './todo-task-view-details/todo-task-view-details.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BOSUserRoutingModule } from './bos-user-routing.module';
import { BOSUserComponent } from '../bos-user/bos-user.component';
import { BossUserHomeComponent } from './boss-user-home/boss-user-home.component';
import { BossUserLiveProjectListingComponent } from './boss-user-live-project-listing/boss-user-live-project-listing.component';
import { BossUserAddProjectComponent } from './boss-user-add-project/boss-user-add-project.component';
import { BossUserViewProjectComponent } from './boss-user-view-project/boss-user-view-project.component';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { HeaderComponent } from 'src/app/utility/shared/components/header/header.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FioDocumentListComponent } from './fio-document-list/fio-document-list.component';
import { FioDocumentAddEditComponent } from './fio-document-add-edit/fio-document-add-edit.component';
import { MailScreenshotAddEditComponent } from './mail-screenshot-add-edit/mail-screenshot-add-edit.component';
import { BossUserUploadProjectComponent } from './boss-user-upload-project/boss-user-upload-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewDocumentComponent } from 'src/app/utility/shared/pop-ups/view-document/view-document.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BossUserBulkEntryComponent } from './boss-user-bulk-entry/boss-user-bulk-entry.component';
import { BossUserProfileComponent } from './boss-user-profile/boss-user-profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BosProjectMailSendComponent } from './bos-project-mail-send/bos-project-mail-send.component';
import { TodoTasksComponent } from './todo-tasks/todo-tasks.component';
import { OngoingTodoTaskComponent } from './ongoing-todo-task/ongoing-todo-task.component';
import { MyDayTodoTaskComponent } from './my-day-todo-task/my-day-todo-task.component';
import { CompletedTodoTaskComponent } from './completed-todo-task/completed-todo-task.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgxEditorModule } from 'ngx-editor';
import { BossUserSupplierComponent } from './supplier/boss-user-supplier/boss-user-supplier.component';
import { CaseStudyBulkAddComponent } from './supplier/case-study-bulk-add/case-study-bulk-add.component';
import { SuperadminCommentModalComponent } from './supplier/superadmin-comment-modal/superadmin-comment-modal.component';
import { BossUserAddNewSupplierComponent } from './supplier/add-new-supplier/add-new-supplier.component';
import { BossUserExpertiseViewComponent } from './supplier/boss-user-expertise-view/boss-user-expertise-view.component';
import { BossUserSubExpertiseViewComponent } from './supplier/boss-user-sub-expertise-view/boss-user-sub-expertise-view.component';
import { BossUserSupplierUserProfileComponent } from './supplier/boss-user-supplier-user-profile/boss-user-supplier-user-profile.component';
import { BossUserAdminCaseStudyListComponent } from './supplier/boss-user-admin-case-study-list/boss-user-admin-case-study-list.component';
import { BossUserAddNewCaseStudyComponent } from './supplier/boss-user-add-new-case-study/boss-user-add-new-case-study.component';
import { BossUserExpertiseListComponent } from './supplier/boss-user-expertise-list/boss-user-expertise-list.component';
import { SubExpertiseListComponent } from './supplier/sub-expertise-list/sub-expertise-list.component';
import { BossUserResourcesListComponent } from './supplier/boss-user-resources-list/boss-user-resources-list.component';
import { ResourcesAddBulkComponent } from './supplier/resources-add-bulk/resources-add-bulk.component';
import { BossUserResourcesAddComponent } from './supplier/boss-user-resources-add/boss-user-resources-add.component';
import { BossUserResourcesDetailsComponent } from './supplier/boss-user-resources-details/boss-user-resources-details.component';
import { BossUserSupplierUserProfileEditComponent } from './supplier/boss-user-supplier-user-profile-edit/boss-user-supplier-user-profile-edit.component';
import { BosUserRoleWiseResourcesListComponent } from './resources/bos-user-role-wise-resources-list/bos-user-role-wise-resources-list.component';
import { BosUserRolesListComponent } from './resources/bos-user-roles-list/bos-user-roles-list.component';
import { BosUserAddRolesComponent } from './resources/bos-user-add-roles/bos-user-add-roles.component';
import { BosUserEditRolesComponent } from './resources/bos-user-edit-roles/bos-user-edit-roles.component';
import { BosUserResourcesViewComponent } from './resources/bos-user-resources-view/bos-user-resources-view.component';
import { BosUserResourcesViewDetailsComponent } from './resources/bos-user-resources-view-details/bos-user-resources-view-details.component';
import { BosUserResourcesAddBulkComponent } from './resources/bos-user-resources-add-bulk/bos-user-resources-add-bulk.component';
import { BosUserResourcesCommentModalComponent } from './resources/bos-user-resources-comment-modal/bos-user-resources-comment-modal.component';
@NgModule({
  declarations: [
    BOSUserComponent,
    BossUserHomeComponent,
    BossUserLiveProjectListingComponent,
    BossUserAddProjectComponent,
    BossUserViewProjectComponent,
    HeaderComponent,
    FioDocumentListComponent,
    FioDocumentAddEditComponent,
    MailScreenshotAddEditComponent,
    BossUserUploadProjectComponent,
    ViewDocumentComponent,
    BossUserBulkEntryComponent,
    BossUserProfileComponent,
    BosProjectMailSendComponent,
    TodoTasksComponent,
    OngoingTodoTaskComponent,
    MyDayTodoTaskComponent,
    CompletedTodoTaskComponent,
    ChangePasswordComponent,
    TodoTaskViewDetailsComponent,
    BossUserSupplierComponent,
    CaseStudyBulkAddComponent,
    SuperadminCommentModalComponent,
    BossUserAddNewSupplierComponent,
    BossUserExpertiseViewComponent,
    BossUserSubExpertiseViewComponent,
    BossUserSupplierUserProfileComponent,
    BossUserAdminCaseStudyListComponent,
    BossUserAddNewCaseStudyComponent,
    BossUserExpertiseListComponent,
    SubExpertiseListComponent,
    BossUserResourcesListComponent,
    ResourcesAddBulkComponent,
    BossUserResourcesAddComponent,
    BossUserResourcesDetailsComponent,
    BossUserSupplierUserProfileEditComponent,
    BosUserRoleWiseResourcesListComponent,
    BosUserRolesListComponent,
    BosUserAddRolesComponent,
    BosUserEditRolesComponent,
    BosUserResourcesViewComponent,
    BosUserResourcesViewDetailsComponent,
    BosUserResourcesAddBulkComponent,
    BosUserResourcesCommentModalComponent
  ],
  imports: [
    CommonModule,
    BOSUserRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSliderModule,
    NgxExtendedPdfViewerModule,
    NgxSpinnerModule,
    NgxEditorModule
  ],
  exports: [TodoTasksComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BOSUserModule { }
