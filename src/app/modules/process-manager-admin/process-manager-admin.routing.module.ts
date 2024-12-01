import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessManagerAdminComponent } from './process-manager-admin.component';
import { ManagerAdminComponent } from './manager-admin/manager-admin.component';




const routes: Routes = [
  {
    path: '',
    component: ProcessManagerAdminComponent,
    children: [
      {
        path: "admin",
        component: ManagerAdminComponent
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
export class ProcessManagerAdminRoutingModule { }
