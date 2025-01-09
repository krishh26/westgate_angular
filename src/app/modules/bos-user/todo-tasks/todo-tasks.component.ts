import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
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
  modalTask: any = {};
  newComment: string = '';
  loginUser: any;
  dueDate: FormControl = new FormControl('');
  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.getTask();
    // this.getUserAllList();
  }

  openTaskModal(task: any) {
    console.log(task);
    this.modalTask = { ...task };
  }

  addComment(comment: string, id: string) {
    if (comment?.trim().length > 0) {
      this.showLoader = true;
      const payload = { comment: comment.trim() };

      this.superService.addComments(payload, id).subscribe(
        (response) => {
          this.showLoader = false;
          if (response?.status === true) {
            this.notificationService.showSuccess('Comment added successfully');
            window.location.reload();
            const newComment = {
              text: comment.trim(),
            };
            this.modalTask.comments = [...(this.modalTask.comments || []), newComment];

            this.newComment = '';
          } else {
            this.notificationService.showError(response?.message || 'Failed to add comment');
          }
        },
        (error) => {
          this.showLoader = false;
          this.notificationService.showError(error?.message || 'An error occurred');
        }
      );
    } else {
      this.notificationService.showError('Comment cannot be empty');
    }
  }

  projectDetails(projectId: any) {
    this.activeModal.close();
    this.router.navigate(['/boss-user/view-project'], { queryParams: { id: projectId } });
  }

  getTask() {
    this.showLoader = true;
    this.superService.getTaskUserwise(this.loginUser?.id).subscribe(
      (response) => {
        if (response?.status === true) {
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
