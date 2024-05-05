import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierAdminComponent } from './supplier-admin.component';
import { ProjectsAllComponent } from './projects-all/projects-all.component';
import { ProjectsShortlistedComponent } from './projects-shortlisted/projects-shortlisted.component';
import { ProjectsAppliedComponent } from './projects-applied/projects-applied.component';
import { ProjectsMatchedComponent } from './projects-matched/projects-matched.component';
import { SupplierDashboardComponent } from './supplier-dashboard/supplier-dashboard.component';
import { SupplierHomeComponent } from './supplier-home/supplier-home.component';
import { TotalProjectsInCategoryComponent } from './total-projects-in-category/total-projects-in-category.component';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { ProjectsDetailsComponent } from './projects-details/projects-details.component';
import { ExpiredProjectComponent } from './expired-project/expired-project.component';
import { AppliedProjectsDetailsComponent } from './applied-projects-details/applied-projects-details.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
import { AddCaseStudyComponent } from './add-case-study/add-case-study.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SupplierAdminProjectListingComponent } from './supplier-admin-project-listing/supplier-admin-project-listing.component';
import { SuppilerAdminChatComponent } from './suppiler-admin-chat/suppiler-admin-chat.component';
import { SupplierDashboardValueComponent } from './supplier-dashboard-value/supplier-dashboard-value.component';


const routes: Routes = [
  {
    path: '',
    component: SupplierAdminComponent,
    children: [
      // {
      //   path: "projects-all",
      //   component: ProjectsAllComponent
      // },
      // {
      //   path: "projects-shortlisted",
      //   component: ProjectsShortlistedComponent
      // },
      // {
      //   path: "projects-applied",
      //   component: ProjectsAppliedComponent
      // },
      // {
      //   path: "projects-matched",
      //   component: ProjectsMatchedComponent
      // },
      {
        path: "project-list",
        component: SupplierAdminProjectListingComponent
      },
      {
        path: "supplier-dashboard",
        component: SupplierDashboardComponent
      },
      {
        path: "supplier-home",
        component: SupplierHomeComponent
      },
      {
        path: "total-projects-in-category",
        component: TotalProjectsInCategoryComponent
      },
      {
        path: "applied-project-details",
        component: AppliedProjectsDetailsComponent
      },
      {
        path: "expired-project",
        component: ExpiredProjectComponent
      },
      {
        path: "projects-details",
        component: ProjectsDetailsComponent
      },
      {
        path: "question-details",
        component: QuestionDetailsComponent
      },
      {
        path: "manage-user",
        component: ManageUserComponent
      },
      {
        path: "add-user",
        component: AddUserComponent
      },
      {
        path: "case-studies-list",
        component: CaseStudiesComponent
      },
      {
        path: "supplier-user-profile",
        component: UserProfileComponent
      },
      {
        path: "chat",
        component: SuppilerAdminChatComponent
      },
      {
        path: "supplier-dashboard-value",
        component: SupplierDashboardValueComponent
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
export class SupplierRoutingModule { }
