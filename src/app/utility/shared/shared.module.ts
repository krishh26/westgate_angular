import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NoRecordFoundComponent } from './common/no-record-found/no-record-found.component';
import { CustomValidation } from './constant/custome-validation';
import { FeasibilityManagerHeaderComponent } from './components/feasibility-manager-header/feasibility-manager-header.component';

@NgModule({
  declarations: [
    NoRecordFoundComponent,
    FeasibilityManagerHeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NoRecordFoundComponent,
  ],
  providers: [
    CustomValidation
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
