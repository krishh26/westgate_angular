import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessManagerAdminComponent } from './process-manager-admin.component';
import { ToDoTasksProcessManagerComponent } from './to-do-tasks-process-manager/to-do-tasks-process-manager.component';
import { ProcessManagerTrackerComponent } from './process-manager-tracker/process-manager-tracker.component';
import { ProcessManagerTrackerProjectDetailsComponent } from './process-manager-tracker-project-details/process-manager-tracker-project-details.component';




const routes: Routes = [
  {
    path: '',
    component: ProcessManagerAdminComponent,
    children: [
      {
        path: "to-do-tasks-process-manager",
        component: ToDoTasksProcessManagerComponent
      },
      {
        path: "process-manager-tracker",
        component: ProcessManagerTrackerComponent
      },
      {
        path: "process-manager-project-details",
        component: ProcessManagerTrackerProjectDetailsComponent
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
