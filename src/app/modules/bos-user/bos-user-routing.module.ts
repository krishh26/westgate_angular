import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BossUserHomeComponent } from './boss-user-home/boss-user-home.component';
import { BossUserAddProjectComponent } from './boss-user-add-project/boss-user-add-project.component';
import { BossUserLiveProjectListingComponent } from './boss-user-live-project-listing/boss-user-live-project-listing.component';
import { BossUserViewProjectComponent } from './boss-user-view-project/boss-user-view-project.component';
import { BOSUserComponent } from './bos-user.component';

const routes: Routes = [
  {
    path: '',
    component: BOSUserComponent,
    children: [
      {
        path : "home",
        component : BossUserHomeComponent
      },
      {
        path : "add-project",
        component : BossUserAddProjectComponent
      },
      {
        path : "project-list",
        component : BossUserLiveProjectListingComponent
      },
      {
        path : "view-project",
        component : BossUserViewProjectComponent
      },
    ]
  },
  {
    path : "**",
    pathMatch : "full",
    redirectTo : ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BOSUserRoutingModule { }
