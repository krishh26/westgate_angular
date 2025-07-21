import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResourcesViewDetailsComponent } from './resources-view-details/resources-view-details.component';
import { AdminDataExpertiseListComponent } from './admin-data-expertise-list/admin-data-expertise-list.component';
import { AdminDataCandidateListComponent } from './admin-data-candidate-list/admin-data-candidate-list.component';

const routes: Routes = [
  {
    path: 'resources-view-details',
    component: ResourcesViewDetailsComponent
  },
  {
    path: 'admin-data-expertise-list/:expertiseName',
    component: AdminDataExpertiseListComponent
  },
  {
    path: 'admin-data-candidate-list/:technologyName',
    component: AdminDataCandidateListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
