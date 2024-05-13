import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuperAdminComponent } from './super-admin.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { SuperAdminProjectsAllComponent } from './super-admin-projects-all/super-admin-projects-all.component';
import { SuperAdminSupplierComponent } from './super-admin-supplier/super-admin-supplier.component';
import { SuperAdminSupplierProjectViewComponent } from './super-admin-supplier-project-view/super-admin-supplier-project-view.component';



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
