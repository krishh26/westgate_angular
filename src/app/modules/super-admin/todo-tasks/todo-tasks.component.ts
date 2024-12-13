import { Component, ElementRef, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-todo-tasks',
  templateUrl: './todo-tasks.component.html',
  styleUrls: ['./todo-tasks.component.scss']
})
export class TodoTasksComponent {
  taskDetails: string = '';
  showLoader: boolean = false;
  taskList: any = [];
  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
  
  ) {
  }

  ngOnInit(): void {
    this.getTask()
  }

  addTask() {
    if (this.taskDetails.trim()) {
      this.showLoader = true;
      const payload={
          "task": this.taskDetails,
          "status": "Todo",
          "dueDate": null,
          "assignTo": null   }
    this.superService.createTask(payload).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.notificationService.showSuccess('Task Create Successfully');
          this.getTask()
      }else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    },
      (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
      
    } else {
     this.notificationService.showError('please Enter Task Details');
  
    }
  }
  getTask() {
  
      this.showLoader = true;
    this.superService.getTask().subscribe(
      (response) => {
        if (response?.status == true) {
          this.taskList=response?.data?.data;
          this.showLoader = false;
          
      }else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    },
      (error) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    ); 
  
}

  

}
