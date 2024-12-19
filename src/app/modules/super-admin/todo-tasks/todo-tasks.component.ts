import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import Swal from 'sweetalert2';

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
  showAll = false;
  displayedUsers: any[] = [];
  dueDate: FormControl = new FormControl(null);
  categoryList: string[] = ['feasibility', 'bid manager', 'other tasks'];
  selectedCategory: string | undefined;
  dueDateValue: NgbDate | null = null;
  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal,
    private projectManagerService: ProjectManagerService,
    private projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.getTask();
    this.getUserAllList();
  }

  onDueDateChange(date: NgbDate | null) {
    this.dueDateValue = date; // Update the local variable
    this.onChange('dueDate', date); // Pass the 'dueDate' key and the updated value
  }
  
  addTask() {
    if (this.taskDetails.trim()) {
      const payload = {
        discription: this.taskDetails,
        task: this.taskTitle,
        status: 'Todo',
        dueDate: this.dueDate.value
          ? this.formatDate(this.dueDate.value)
          : '',
        assignTo: this.assignTo
      };
      this.superService.createTask(payload).subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess('Task Created Successfully');
            this.getTask();
            // this.activeModal.close();
            window.location.reload();
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

  onChange(paramKey: string, paramValue: any) {
    const params: any = {};
  
    if (paramKey === 'dueDate' && paramValue) {
      params.dueDate = `${paramValue.year}-${paramValue.month}-${paramValue.day}`;
    } else if (paramKey === 'assignTo' && paramValue) {
      params.assignTo = paramValue;
    } else if (paramKey === 'pickACategory' && paramValue) {
      params.pickACategory = paramValue;
    }
  
    this.updateTask(params);
  }
  

  // API call to update the task
  updateTask(params: any) {
    this.superService.updateTask(params, this.modalTask._id).subscribe(
      (response) => {
        console.log('Task updated successfully', response);
        this.getTask();
        this.notificationService.showSuccess('Task updated Successfully');
      },
      (error) => {
        console.error('Error updating task', error);
        this.notificationService.showError('Error updating task');
      }
    );
  }

  modalTask: any = {};

  openTaskModal(task: any) {
    console.log(task);
    this.modalTask = { ...task }; // Deep copy to avoid direct binding
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

  getUserAllList() {
    this.showLoader = true;
    this.projectManagerService.getUserAllList().subscribe(
      (response) => {
        if (response?.status === true) {
          this.userList = response?.data?.filter((user: any) => user?.role !== 'SupplierAdmin');

          this.displayedUsers = this.userList.slice(0, 7);
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

  deleteTask(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.projectService.deleteTask(id).subscribe((response: any) => {
          if (response?.status == true) {
            this.showLoader = false;
            this.notificationService.showSuccess('Task successfully deleted');
            this.getTask();
          } else {
            this.showLoader = false;
            this.notificationService.showError(response?.message);
          }
        }, (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.message);
        });
      }
    });
  }

  toggleView() {
    this.showAll = !this.showAll;
    this.displayedUsers = this.showAll ? this.userList : this.userList.slice(0, 7);
  }

  private formatDate(date: { year: number; month: number; day: number }): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  newComment: string = '';

  // Add a new comment
  addComment() {
    if (this.newComment.trim()) {
      this.modalTask.comments.push({
        user: 'Kishansinh Parmar',
        time: 'Just now',
        text: this.newComment.trim()
      });
      this.newComment = '';
    }
  }

  // Edit a comment
  editComment(index: number) {
    this.newComment = this.modalTask.comments[index].text;
    this.modalTask.comments.splice(index, 1); // Remove old comment
  }

  // Delete a comment
  deleteComment(index: number) {
    this.modalTask.comments.splice(index, 1);
  }


}
