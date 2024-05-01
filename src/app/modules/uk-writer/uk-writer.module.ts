import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UkWriterComponent } from './uk-writer.component';
import { UkWriterRoutingModule } from './uk-writer.routing.module';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    UkWriterRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  declarations: [UkWriterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UkWriterModule { }
