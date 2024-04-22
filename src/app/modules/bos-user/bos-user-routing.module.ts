import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BossUserHomeComponent } from './boss-user-home/boss-user-home.component';
import { BossUserAddProjectComponent } from './boss-user-add-project/boss-user-add-project.component';
import { BossUserLiveProjectListingComponent } from './boss-user-live-project-listing/boss-user-live-project-listing.component';
import { BossUserViewProjectComponent } from './boss-user-view-project/boss-user-view-project.component';
import { BOSUserComponent } from './bos-user.component';
import { FioDocumentListComponent } from './fio-document-list/fio-document-list.component';
import { FioDocumentAddEditComponent } from './fio-document-add-edit/fio-document-add-edit.component';
import { MailScreenshotListComponent } from './mail-screenshot-list/mail-screenshot-list.component';
import { MailScreenshotAddEditComponent } from './mail-screenshot-add-edit/mail-screenshot-add-edit.component';
import { FoiViewDetailsComponent } from './foi-view-details/foi-view-details.component';

const routes: Routes = [
  {
    path: '',
    component: BOSUserComponent,
    children: [
      {
        path: "home",
        component: BossUserHomeComponent
      },
      {
        path: "add-project",
        component: BossUserAddProjectComponent
      },
      {
        path: "project-list",
        component: BossUserLiveProjectListingComponent
      },
      {
        path: "view-project",
        component: BossUserViewProjectComponent
      },
      {
        path: "foi-document-list",
        component: FioDocumentListComponent
      },
      {
        path: "foi-document-add",
        component: FioDocumentAddEditComponent
      },
      {
        path: "foi-document-details",
        component: FoiViewDetailsComponent
      },
      {
        path: "mail-screenhot-list",
        component: MailScreenshotListComponent
      },
      {
        path: "mail-screenhot-add",
        component: MailScreenshotAddEditComponent
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
export class BOSUserRoutingModule { }
