import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-todo-tasks',
  templateUrl: './todo-tasks.component.html',
  styleUrls: ['./todo-tasks.component.scss'],
  providers: [NgbActiveModal], // Add here
})
export class TodoTasksComponent {
  constructor() {}

  activeComponent: string = 'Ongoing'; 

  setActiveComponent(component: string): void {
    this.activeComponent = component;
  }
}
