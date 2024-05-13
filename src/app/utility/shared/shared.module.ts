import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectManagerHeaderComponent } from './components/project-manager-header/project-manager-header.component';
import { ProjectMangerHeaderTwoComponent } from './components/project-manger-header-two/project-manger-header-two.component';
import { ProjectNotificationComponent } from './common/project-notification/project-notification.component';
import { SuperadminHeaderComponent } from './components/superadmin-header/superadmin-header.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
