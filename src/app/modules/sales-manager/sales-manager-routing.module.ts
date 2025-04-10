import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesManagerComponent } from './sales-manager.component';
import { OngoingTodoTaskSalesManagerComponent } from './ongoing-todo-task/ongoing-todo-task.component';
import { MydayTodoTaskSalesManagerComponent } from './myday-todo-task/myday-todo-task.component';
import { CompletedTodoTaskSalesManagerComponent } from './completed-todo-task/completed-todo-task.component';

const routes: Routes = [
  {
    path: '',
    component: SalesManagerComponent,
    children: [
      {
        path: 'ongoing-todo-task-sales-manager',
        component: OngoingTodoTaskSalesManagerComponent
      },
      {
        path: 'myday-todo-task-sales-manager',
        component: MydayTodoTaskSalesManagerComponent
      },
      {
        path: 'completed-todo-task-sales-manager',
        component: CompletedTodoTaskSalesManagerComponent
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
export class SalesManagerRoutingModule { }
