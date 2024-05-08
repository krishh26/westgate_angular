import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectCoOrdinatorComponent } from './project-co-ordinator.component';
import { ProjectCoOrdinatorHomeComponent } from './project-co-ordinator-home/project-co-ordinator-home.component';
import { ProjectCoOrdinatorDetailsComponent } from './project-co-ordinator-details/project-co-ordinator-details.component';
import { ProjectCoOrdinatorQuestionDetailsComponent } from './project-co-ordinator-question-details/project-co-ordinator-question-details.component';
import { ProjectCoOrdinatorChatsComponent } from './project-co-ordinator-chats/project-co-ordinator-chats.component';


const routes: Routes = [
  {
    path: '',
    component: ProjectCoOrdinatorComponent,
    children: [
      {
        path: "project-co-ordinator-home",
        component: ProjectCoOrdinatorHomeComponent
      },
      {
        path: "project-co-ordinator-projects-details",
        component: ProjectCoOrdinatorDetailsComponent
      },
      {
        path: "project-co-ordinator-question-details",
        component: ProjectCoOrdinatorQuestionDetailsComponent
      },
      {
        path: "project-co-ordinator-chats",
        component: ProjectCoOrdinatorChatsComponent
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
export class ProjectCoOrdinateRoutingModule { }
