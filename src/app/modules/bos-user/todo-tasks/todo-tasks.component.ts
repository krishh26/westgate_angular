import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  taskTitle: string = '';
  showLoader: boolean = false;
  taskList: any = [];
  userList: any = [];
  assignTo: any[] = [];

  dueDate: FormControl = new FormControl('');
  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.getTask();
    // this.getUserAllList();
  }

  addComment(comment: string, id: string) {
    if (comment.length > 0) {
      this.showLoader = true;
      const payload = {
        comment: comment,
      };
      this.superService.addComments(payload, id).subscribe(
        (response) => {
          if (response?.status == true) {
            this.showLoader = false;
            const task = this.taskList.find((task: any) => task._id === id);
            this.notificationService.showSuccess('Comment added successfully');

            if (task) {
              task.commentDetails = '';
            }
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

  getTask() {
    this.showLoader = true;
    this.superService.getTask().subscribe(
      (response) => {
        if (response?.status == true) {
          this.taskList = response?.data?.data.map((task: any) => ({
            ...task,
            commentDetails: '',
          }));
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

  // getUserAllList() {
  //   this.showLoader = true;
  //   this.projectManagerService.getUserAllList().subscribe(
  //     (response) => {
  //       if (response?.status === true) {
  //         // Filter out users with role 'supplierAdmin'
  //         this.userList = response?.data?.filter((user: any) => user?.role !== 'SupplierAdmin');
  //         console.log(this.userList);

  //         this.showLoader = false;
  //       } else {
  //         this.notificationService.showError(response?.message);
  //         this.showLoader = false;
  //       }
  //     },
  //     (error) => {
  //       this.notificationService.showError(error?.message);
  //       this.showLoader = false;
  //     }
  //   );
  // }
}
