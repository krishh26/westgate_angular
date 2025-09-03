import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessManagerAdminComponent } from './process-manager-admin.component';
import { ToDoTasksProcessManagerComponent } from './to-do-tasks-process-manager/to-do-tasks-process-manager.component';
import { ProcessManagerTrackerComponent } from './process-manager-tracker/process-manager-tracker.component';
import { ProcessManagerTrackerProjectDetailsComponent } from './process-manager-tracker-project-details/process-manager-tracker-project-details.component';
import { MyDayTaskProcessManagerComponent } from './my-day-task-process-manager/my-day-task-process-manager.component';
import { CompletedTaskProcessManagerComponent } from './completed-task-process-manager/completed-task-process-manager.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ProcessManagerUserProfileComponent } from './process-manager-user-profile/process-manager-user-profile.component';
import { PmAdminChangePasswordComponent } from './pm-admin-change-password/pm-admin-change-password.component';
import { DashboardProcessManagerComponent } from './dashboard-process-manager/dashboard-process-manager.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { TypeWiseProjectDetailsComponent } from './type-wise-project-details/type-wise-project-details.component';
import { TodoTaskViewDetailsPageComponent } from './todo-task-view-details-page/todo-task-view-details-page.component';
import { ProcessManagerCaseStudiesComponent } from './process-manager-case-studies/process-manager-case-studies.component';
import { TaskDetailsProcessManagerComponent } from './task-details-process-manager/task-details-process-manager.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessManagerAdminComponent,
    children: [
      {
        path: "date-picker",
        component: DatePickerComponent
      },
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
      {
        path: "my-day-tasks",
        component: MyDayTaskProcessManagerComponent
      },
      {
        path: "completed-tasks",
        component: CompletedTaskProcessManagerComponent
      },
      {
        path: "add-project",
        component: AddProjectComponent
      },
      {
        path: "process-manager-user-profile",
        component: ProcessManagerUserProfileComponent
      },
      {
        path: "change-password",
        component: PmAdminChangePasswordComponent
      },
      {
        path: "dashboard-process-manager",
        component: DashboardProcessManagerComponent
      },
      {
        path: "type-wise-project-list",
        component: TypeWiseProjectDetailsComponent
      },
      {
        path: "todo-task-view-details/:id",
        component: TodoTaskViewDetailsPageComponent
      },
      {
        path: "case-studies",
        component: ProcessManagerCaseStudiesComponent
      },
      {
        path: "task-details-process-manager",
        component: TaskDetailsProcessManagerComponent
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
