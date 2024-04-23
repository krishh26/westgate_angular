import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierAdminComponent } from './supplier-admin.component';
import { TotalProjectsInCategoryComponent } from './total-projects-in-category/total-projects-in-category.component';
import { SupplierHomeComponent } from './supplier-home/supplier-home.component';
import { ProjectsAppliedComponent } from './projects-applied/projects-applied.component';
import { ProjectsShortlistedComponent } from './projects-shortlisted/projects-shortlisted.component';
import { ProjectsAllComponent } from './projects-all/projects-all.component';
import { ProjectsMatchedComponent } from './projects-matched/projects-matched.component';
import { SupplierRoutingModule } from './supplier-admin.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/utility/shared/shared.module';



@NgModule({
  declarations: [
    SupplierAdminComponent,
    TotalProjectsInCategoryComponent,
    SupplierHomeComponent,
    ProjectsAppliedComponent,
    ProjectsShortlistedComponent,
    ProjectsAllComponent,
    ProjectsMatchedComponent
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SupplierAdminModule { }
