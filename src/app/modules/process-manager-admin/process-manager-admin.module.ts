import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessManagerAdminComponent } from './process-manager-admin.component';
import { ProcessManagerAdminRoutingModule } from './process-manager-admin.routing.module';
import { ManagerAdminComponent } from './manager-admin/manager-admin.component';

@NgModule({
  imports: [
    CommonModule,
    ProcessManagerAdminRoutingModule
  ],
  declarations: [
    ProcessManagerAdminComponent,
    ManagerAdminComponent
  ]
})
export class ProcessManagerAdminModule { }
