import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BossUserHomeComponent } from './boss-user-home/boss-user-home.component';
import { BossUserAddProjectComponent } from './boss-user-add-project/boss-user-add-project.component';
import { BossUserLiveProjectListingComponent } from './boss-user-live-project-listing/boss-user-live-project-listing.component';
import { BossUserViewProjectComponent } from './boss-user-view-project/boss-user-view-project.component';
import { BOSUserComponent } from './bos-user.component';
import { MailScreenshotAddEditComponent } from './mail-screenshot-add-edit/mail-screenshot-add-edit.component';
import { FioDocumentListComponent } from './fio-document-list/fio-document-list.component';
import { FioDocumentAddEditComponent } from './fio-document-add-edit/fio-document-add-edit.component';
import { BossUserBulkEntryComponent } from './boss-user-bulk-entry/boss-user-bulk-entry.component';
import { BossUserProfileComponent } from './boss-user-profile/boss-user-profile.component';
import { TodoTasksComponent } from './todo-tasks/todo-tasks.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TodoTaskViewDetailsComponent } from './todo-task-view-details/todo-task-view-details.component';
import { BossUserSupplierComponent } from './supplier/boss-user-supplier/boss-user-supplier.component';
import { BossUserAddNewSupplierComponent } from './supplier/add-new-supplier/add-new-supplier.component';
import { BossUserExpertiseViewComponent } from './supplier/boss-user-expertise-view/boss-user-expertise-view.component';
import { BossUserSubExpertiseViewComponent } from './supplier/boss-user-sub-expertise-view/boss-user-sub-expertise-view.component';
import { BossUserSupplierUserProfileComponent } from './supplier/boss-user-supplier-user-profile/boss-user-supplier-user-profile.component';
import { BossUserAdminCaseStudyListComponent } from './supplier/boss-user-admin-case-study-list/boss-user-admin-case-study-list.component';
import { BossUserAddNewCaseStudyComponent } from './supplier/boss-user-add-new-case-study/boss-user-add-new-case-study.component';
import { BossUserExpertiseListComponent } from './supplier/boss-user-expertise-list/boss-user-expertise-list.component';
import { SubExpertiseListComponent } from './supplier/sub-expertise-list/sub-expertise-list.component';
import { BossUserResourcesListComponent } from './supplier/boss-user-resources-list/boss-user-resources-list.component';
import { BossUserResourcesAddComponent } from './supplier/boss-user-resources-add/boss-user-resources-add.component';
import { BossUserResourcesDetailsComponent } from './supplier/boss-user-resources-details/boss-user-resources-details.component';
import { BossUserSupplierUserProfileEditComponent } from './supplier/boss-user-supplier-user-profile-edit/boss-user-supplier-user-profile-edit.component';
import { BosUserResourcesViewComponent } from './resources/bos-user-resources-view/bos-user-resources-view.component';
import { BosUserResourcesAddComponent } from './resources/bos-user-resources-add/bos-user-resources-add.component';
import { BosUserResourcesListComponent } from './resources/bos-user-resources-list/bos-user-resources-list.component';
import { BosUserResourcesDetailsComponent } from './resources/bos-user-resources-details/bos-user-resources-details.component';
import { BosUserRolesListComponent } from './resources/bos-user-roles-list/bos-user-roles-list.component';
import { BosUserResourcesViewDetailsComponent } from './resources/bos-user-resources-view-details/bos-user-resources-view-details.component';
import { BosUserRoleWiseResourcesListComponent } from './resources/bos-user-role-wise-resources-list/bos-user-role-wise-resources-list.component';
import { BosUserAddRolesComponent } from './resources/bos-user-add-roles/bos-user-add-roles.component';
import { BosUserEditRolesComponent } from './resources/bos-user-edit-roles/bos-user-edit-roles.component';
import { BosUserProjectDetailsComponent } from './bos-user-project-details/bos-user-project-details.component';

const routes: Routes = [
  {
    path: '',
    component: BOSUserComponent,
    children: [
      {
        path: "home",
        component: BossUserHomeComponent
      },
      {
        path: "add-project",
        component: BossUserAddProjectComponent
      },
      {
        path: "project-list",
        component: BossUserLiveProjectListingComponent
      },
      {
        path: "todo-task",
        component: TodoTasksComponent
      },
      {
        path: "todo-task-view-details",
        component: TodoTaskViewDetailsComponent
      },
      {
        path: "change-password",
        component: ChangePasswordComponent
      },
      {
        path: "view-project",
        component: BossUserViewProjectComponent
      },
      {
        path: "foi-document-list",
        component: FioDocumentListComponent
      },
      {
        path: "foi-document-add",
        component: FioDocumentAddEditComponent
      },
      {
        path: "mail-screenhot-add",
        component: MailScreenshotAddEditComponent
      },
      {
        path: "boss-user-bulk-entry",
        component: BossUserBulkEntryComponent
      },
      {
        path: "boss-user-profile",
        component: BossUserProfileComponent
      },
      {
        path: "supplier",
        component: BossUserSupplierComponent
      },
      {
        path: "add-new-supplier",
        component: BossUserAddNewSupplierComponent
      },
      {
        path: "expertise-view",
        component: BossUserExpertiseViewComponent
      },
      {
        path: "sub-expertise-view",
        component: BossUserSubExpertiseViewComponent
      },
      {
        path: "supplier-user-profile",
        component: BossUserSupplierUserProfileComponent
      },
      {
        path: "admin-case-study-list",
        component: BossUserAdminCaseStudyListComponent
      },
      {
        path: "add-new-case-study",
        component: BossUserAddNewCaseStudyComponent
      },
      {
        path: "expertise-list",
        component: BossUserExpertiseListComponent
      },
      {
        path: "sub-expertise-list",
        component: SubExpertiseListComponent
      },
      {
        path: "resources-list",
        component: BossUserResourcesListComponent
      },
      {
        path: "resources-add",
        component: BossUserResourcesAddComponent
      },
      {
        path: "resources-details",
        component: BossUserResourcesDetailsComponent
      },
      {
        path: "supplier-user-profile-edit/:id",
        component: BossUserSupplierUserProfileEditComponent
      },
      {
        path: "bos-user-resources-view",
        component: BosUserResourcesViewComponent
      },
      {
        path: "bos-user-resources-add",
        component: BosUserResourcesAddComponent
      },
      {
        path: "bos-user-resources-list",
        component: BosUserResourcesListComponent
      },
      {
        path: "bos-user-resources-details",
        component: BosUserResourcesDetailsComponent
      },
      {
        path: "bos-user-resources-view-details",
        component: BosUserResourcesViewDetailsComponent
      },
      {
        path: "bos-user-roles-wise-resources-list",
        component: BosUserRoleWiseResourcesListComponent
      },
      {
        path: "bos-user-roles-list",
        component: BosUserRolesListComponent
      },
      {
        path: "bos-user-add-roles",
        component: BosUserAddRolesComponent
      },
      {
        path: "bos-user-edit-roles/:id",
        component: BosUserEditRolesComponent
      },
      {
        path: "bos-user-project-details",
        component: BosUserProjectDetailsComponent
      }
    ]
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BOSUserRoutingModule { }
