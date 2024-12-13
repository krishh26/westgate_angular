import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-todo-tasks',
  templateUrl: './todo-tasks.component.html',
  styleUrls: ['./todo-tasks.component.scss'],
  providers: [NgbActiveModal], // Add here
})
export class TodoTasksComponent {
  taskDetails: string = '';
  taskTitle : string = '';
  showLoader: boolean = false;
  taskList: any = [];
  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit(): void {
    this.getTask()
  }

  addTask() {
    if (this.taskDetails.trim()) {
      const payload = {
        discription: this.taskDetails,
        task : this.taskTitle,
        status: 'Todo',
        dueDate: '',
        assignTo: ''
      };
      this.superService.createTask(payload).subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess('Task Created Successfully');
            this.getTask();
            this.activeModal.close();
          } else {
            this.notificationService.showError(response?.message);
          }
        },
        (error) => {
          this.notificationService.showError(error?.message);
        }
      );
    } else {
      this.notificationService.showError('Please Enter Task Details');
    }
  }


  getTask() {
    this.showLoader = true;
    this.superService.getTask().subscribe(
      (response) => {
        if (response?.status == true) {
          this.taskList = response?.data?.data;
          this.showLoader = false;

        } else {
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
