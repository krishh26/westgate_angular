import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminProjectsAllComponent } from './super-admin-projects-all/super-admin-projects-all.component';
import { SuperAdminSupplierComponent } from './super-admin-supplier/super-admin-supplier.component';
import { SuperAdminSupplierProjectViewComponent } from './super-admin-supplier-project-view/super-admin-supplier-project-view.component';
import { SuperAdminProjectDetailsComponent } from './super-admin-project-details/super-admin-project-details.component';
import { SuperAdminSupplierDetailsComponent } from './super-admin-supplier-details/super-admin-supplier-details.component';
import { SuperadminAddProjectComponent } from './superadmin-add-project/superadmin-add-project.component';
import { RegisterNewSupplierComponent } from './register-new-supplier/register-new-supplier.component';
import { AdminCaseStudiesListComponent } from './admin-case-studies-list/admin-case-studies-list.component';
import { CaseStudyBulkAddComponent } from './case-study-bulk-add/case-study-bulk-add.component';
import { AdminAddCaseStudyComponent } from './admin-add-case-study/admin-add-case-study.component';
import { SupplierManageUserListComponent } from './supplier-manage-user-list/supplier-manage-user-list.component';
import { SupplierUserProfileDataComponent } from './supplier-user-profile-data/supplier-user-profile-data.component';
import { SupplierUserActivityComponent } from './supplier-user-activity/supplier-user-activity.component';
import { SupplierUserProfileEditComponent } from './supplier-user-profile-edit/supplier-user-profile-edit.component';
import { TodoTasksComponent } from './todo-tasks/todo-tasks.component';
import { StatusWiseTrackerComponent } from './status-wise-tracker/status-wise-tracker.component';



const routes: Routes = [
  {
    path: '',
    component: SuperAdminComponent,
    children: [
      {
        path: "super-admin-dashboard",
        component: SuperAdminDashboardComponent
      },
      {
        path: "super-admin-supplier",
        component: SuperAdminSupplierComponent
      },
      {
        path: "super-admin-projects-all",
        component: SuperAdminProjectsAllComponent
      },
      {
        path: "super-admin-supplier-project-view",
        component: SuperAdminSupplierProjectViewComponent
      },
      {
        path: "super-admin-supplier-users-list",
        component: SupplierManageUserListComponent
      },
      {
        path: "super-admin-project-details",
        component: SuperAdminProjectDetailsComponent
      },
      {
        path: "super-admin-supplier-project-details",
        component: SuperAdminSupplierDetailsComponent
      },
      {
        path: "super-admin-add-project",
        component: SuperadminAddProjectComponent
      },
      {
        path: "add-new-supplier",
        component: RegisterNewSupplierComponent
      },

      {
        path: "add-new-case-study",
        component: AdminAddCaseStudyComponent
      },
      {
        path: "add-bulk-case-study",
        component: CaseStudyBulkAddComponent
      },
      {
        path: "admin-case-study-list",
        component: AdminCaseStudiesListComponent
      },
      {
        path: "supplier-user-profile",
        component: SupplierUserProfileDataComponent
      },
      {
        path: "supplier-user-profile-edit",
        component: SupplierUserProfileEditComponent
      },
      {
        path: "supplier-user-activity",
        component: SupplierUserActivityComponent
      },
      {
        path: "todo-tasks",
        component: TodoTasksComponent
      },
      {
        path: "status-wise-tracker",
        component: StatusWiseTrackerComponent
      },

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
export class SuperAdminRoutingModule { }
