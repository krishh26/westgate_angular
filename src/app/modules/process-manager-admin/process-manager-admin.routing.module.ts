import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessManagerAdminComponent } from './process-manager-admin.component';
import { ToDoTasksProcessManagerComponent } from './to-do-tasks-process-manager/to-do-tasks-process-manager.component';




const routes: Routes = [
  {
    path: '',
    component: ProcessManagerAdminComponent,
    children: [
      {
        path: "to-do-tasks-process-manager",
        component: ToDoTasksProcessManagerComponent
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
