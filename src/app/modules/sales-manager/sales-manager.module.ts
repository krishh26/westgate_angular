import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SalesManagerRoutingModule } from './sales-manager-routing.module';
import { SalesManagerComponent } from './sales-manager.component';
import { OngoingTodoTaskSalesManagerComponent } from './ongoing-todo-task/ongoing-todo-task.component';
import { MydayTodoTaskSalesManagerComponent } from './myday-todo-task/myday-todo-task.component';
import { CompletedTodoTaskSalesManagerComponent } from './completed-todo-task/completed-todo-task.component';
import { NgxEditorModule } from 'ngx-editor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from 'src/app/utility/shared/shared.module';
import { SalesManagerHeaderComponent } from 'src/app/utility/shared/components/sales-manager-header/sales-manager-header.component';
import { TodoTaskSalesManageComponent } from './todo-task-sales-manage/todo-task-sales-manage.component';
@NgModule({
  declarations: [
    SalesManagerComponent,
    TodoTaskSalesManageComponent,
    OngoingTodoTaskSalesManagerComponent,
    MydayTodoTaskSalesManagerComponent,
    CompletedTodoTaskSalesManagerComponent,
    SalesManagerHeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    SalesManagerRoutingModule,
    NgxPaginationModule,
    NgbModule,
    NgSelectModule,
    NgxSliderModule,
    NgxExtendedPdfViewerModule,
    NgxSpinnerModule,
    NgxEditorModule
  ],
  exports: [TodoTaskSalesManageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SalesManagerModule { }
