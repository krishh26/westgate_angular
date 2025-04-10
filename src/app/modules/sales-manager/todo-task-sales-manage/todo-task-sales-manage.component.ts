import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-todo-task-sales-manage',
  templateUrl: './todo-task-sales-manage.component.html',
  styleUrls: ['./todo-task-sales-manage.component.scss'],
  providers: [NgbActiveModal],
})
export class TodoTaskSalesManageComponent {
  constructor() {}

  activeComponent: string = 'Ongoing';

  setActiveComponent(component: string): void {
    this.activeComponent = component;
  }
}
