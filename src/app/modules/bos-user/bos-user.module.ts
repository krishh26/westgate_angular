import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BOSUserRoutingModule } from './bos-user-routing.module';
import { BOSUserComponent } from '../bos-user/bos-user.component';
import { BossUserHomeComponent } from './boss-user-home/boss-user-home.component';
import { BossUserLiveProjectListingComponent } from './boss-user-live-project-listing/boss-user-live-project-listing.component';
import { BossUserAddProjectComponent } from './boss-user-add-project/boss-user-add-project.component';
import { BossUserViewProjectComponent } from './boss-user-view-project/boss-user-view-project.component';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { HeaderComponent } from 'src/app/utility/shared/components/header/header.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FioDocumentListComponent } from './fio-document-list/fio-document-list.component';
import { FioDocumentAddEditComponent } from './fio-document-add-edit/fio-document-add-edit.component';
import { MailScreenshotAddEditComponent } from './mail-screenshot-add-edit/mail-screenshot-add-edit.component';
import { BossUserUploadProjectComponent } from './boss-user-upload-project/boss-user-upload-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FoiViewDetailsComponent } from './foi-view-details/foi-view-details.component';

@NgModule({
  declarations: [
    BOSUserComponent,
    BossUserHomeComponent,
    BossUserLiveProjectListingComponent,
    BossUserAddProjectComponent,
    BossUserViewProjectComponent,
    HeaderComponent,
    FioDocumentListComponent,
    FioDocumentAddEditComponent,
    MailScreenshotAddEditComponent,
    BossUserUploadProjectComponent,
    FoiViewDetailsComponent
  ],
  imports: [
    CommonModule,
    BOSUserRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class BOSUserModule { }
