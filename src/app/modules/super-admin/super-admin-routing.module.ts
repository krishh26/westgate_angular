import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourcesViewDetailsComponent } from './resources-view-details/resources-view-details.component';

const routes: Routes = [
  {
    path: 'resources-view-details',
    component: ResourcesViewDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
