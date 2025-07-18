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
import { TrackerWiseProjectDetailsComponent } from './tracker-wise-project-details/tracker-wise-project-details.component';
import { GapAnalysisComponent } from './gap-analysis/gap-analysis.component';
import { MyDayTasksComponent } from './my-day-tasks/my-day-tasks.component';
import { CompletedTasksComponent } from './completed-tasks/completed-tasks.component';
import { ApproveRejectProjectComponent } from './approve-reject-project/approve-reject-project.component';
import { SuperAdminUserProfileComponent } from './super-admin-user-profile/super-admin-user-profile.component';
import { SuperAdminChangePasswordComponent } from './super-admin-change-password/super-admin-change-password.component';
import { DropAfterFesibilityProjectsComponent } from './drop-after-fesibility-projects/drop-after-fesibility-projects.component';
import { NoSupplierMatchProjectsComponent } from './no-supplier-match-projects/no-supplier-match-projects.component';
import { ApproveRejectProjectDetailsComponent } from './approve-reject-project-details/approve-reject-project-details.component';
import { TypeWiseProjectListComponent } from './type-wise-project-list/type-wise-project-list.component';
import { FailAproveRejectComponent } from './fail-aprove-reject/fail-aprove-reject.component';
import { ExpertiseListComponent } from './expertise-list/expertise-list.component';
import { ExpertiseViewComponent } from './expertise-view/expertise-view.component';
import { SubExpertiseListComponent } from './sub-expertise-list/sub-expertise-list.component';
import { ResourcesListComponent } from './resources-list/resources-list.component';
import { ResourcesAddComponent } from './resources-add/resources-add.component';
import { ResourcesViewComponent } from './resources-view/resources-view.component';
import { ResourcesDetailsComponent } from './resources-details/resources-details.component';
import { AddRolesComponent } from './add-roles/add-roles.component';
import { RolesListComponent } from './roles-list/roles-list.component';
import { SubExpertiseViewComponent } from './sub-expertise-view/sub-expertise-view.component';
import { ResourcesViewDetailsComponent } from './resources-view-details/resources-view-details.component';
import { RoleWiseResourcesListComponent } from './role-wise-resources-list/role-wise-resources-list.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';
import { ResourcesProductivityViewComponent } from './resources-productivity-view/resources-productivity-view.component';
import { TeamProductivityViewComponent } from './team-productivity-view/team-productivity-view.component';
import { TodoTaskViewPageComponent } from './todo-task-view-page/todo-task-view-page.component';
import { SupplierWiseProjectListComponent } from './supplier-wise-project-list/supplier-wise-project-list.component';
import { AdminDataSettingsComponent } from './admin-data-settings/admin-data-settings.component';
import { AdminDataExpertiseListComponent } from './admin-data-expertise-list/admin-data-expertise-list.component';

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
        path: "super-admin-user-profile",
        component: SuperAdminUserProfileComponent
      },
      {
        path: "supplier-user-profile-edit/:id",
        component: SupplierUserProfileEditComponent
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
        path: "todo-task-view-page/:id",
        component: TodoTaskViewPageComponent
      },
      {
        path: "my-day-tasks",
        component: MyDayTasksComponent
      },
      {
        path: "completed-tasks",
        component: CompletedTasksComponent
      },
      {
        path: "status-wise-tracker",
        component: StatusWiseTrackerComponent
      },
      {
        path: "tracker-wise-project-details",
        component: TrackerWiseProjectDetailsComponent
      },
      {
        path: "gap-analysis",
        component: GapAnalysisComponent
      },
      {
        path: "approve-reject-projects",
        component: ApproveRejectProjectComponent
      },
      {
        path: "change-password",
        component: SuperAdminChangePasswordComponent
      },
      {
        path: "drop-after-fesibility-projects",
        component: DropAfterFesibilityProjectsComponent
      },
      {
        path: "no-supplier-match-projects",
        component: NoSupplierMatchProjectsComponent
      },
      {
        path: "approve-reject-project-details",
        component: ApproveRejectProjectDetailsComponent
      },
      {
        path: "expertise-list",
        component: ExpertiseListComponent
      },
      {
        path: "sub-expertise-list",
        component: SubExpertiseListComponent
      },
      {
        path: "type-wise-project-list",
        component: TypeWiseProjectListComponent
      },
      {
        path: "fail-approve-reject-project-list",
        component: FailAproveRejectComponent
      },
      {
        path: "expertise-view",
        component: ExpertiseViewComponent
      },
      {
        path: "resources-view",
        component: ResourcesViewComponent
      },
      {
        path: "resources-add",
        component: ResourcesAddComponent
      },
      {
        path: "resources-list",
        component: ResourcesListComponent
      },
      {
        path: "resources-details",
        component: ResourcesDetailsComponent
      },
      {
        path: "add-roles",
        component: AddRolesComponent
      },
      {
        path: "roles-list",
        component: RolesListComponent
      },
      {
        path: "sub-expertise-view",
        component: SubExpertiseViewComponent
      },
      {
        path: "resources-view-details",
        component: ResourcesViewDetailsComponent
      },
      {
        path: "role-wise-resources-list",
        component: RoleWiseResourcesListComponent
      },
      {
        path: "edit-roles/:id",
        component: EditRolesComponent
      },
      {
        path: "resources-productivity-view",
        component: ResourcesProductivityViewComponent
      },
      {
        path: "team-productivity-view",
        component: TeamProductivityViewComponent
      },
      {
        path: "supplier-wise-project-list",
        component: SupplierWiseProjectListComponent
      },
      {
        path: "admin-data-settings",
        component: AdminDataSettingsComponent
      },
      {
        path: 'admin-data-expertise-list/:expertiseName',
        component: AdminDataExpertiseListComponent
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
export class SuperAdminRoutingModule { }
