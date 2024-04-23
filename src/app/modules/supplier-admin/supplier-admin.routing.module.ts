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


const routes: Routes = [
  {
    path: '',
    component: SupplierAdminComponent,
    children: [
      {
        path: "projects-all",
        component: ProjectsAllComponent
      },
      {
        path: "projects-shortlisted",
        component: ProjectsShortlistedComponent
      },
      {
        path: "projects-applied",
        component: ProjectsAppliedComponent
      },
      {
        path: "projects-matched",
        component: ProjectsMatchedComponent
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
