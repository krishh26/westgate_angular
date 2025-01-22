import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

@Component({
  selector: 'app-completed-todo-task',
  templateUrl: './completed-todo-task.component.html',
  styleUrls: ['./completed-todo-task.component.scss'],
})
export class CompletedTodoTaskComponent {
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
  failStatusReason: FormControl = new FormControl('');
  status: string = 'Expired';
  statusComment: FormControl = new FormControl('');
  commentData: any[] = [];
  documentUploadType: any = {
    subContractDocument: 'SubContract',
    economicalPartnershipQuery: 'economicalPartnershipQuery',
    economicalPartnershipResponse: 'economicalPartnershipResponse',
    clientDocument: 'clientDocument',
    loginDetailDocument: 'loginDetailDocument',
    otherQueryDocument: 'otherQueryDocument',
    otherDocument: 'otherDocument',
    failStatusImage: 'failStatusImage',
    westgatedocument: 'westgatedocument',
  };
  statusDate: FormControl = new FormControl('');
  FeasibilityOtherDocuments: any = [];
  logs: any = [];
  subContracting: boolean = true;
  loginModalMode: boolean = true;
  isEditing = false;
  projectId: string = '';
  projectDetail: any = [];

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private router: Router,
    private feasibilityService: FeasibilityService,
    private projectManagerService: ProjectManagerService,
    private projectService: ProjectService
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
            this.modalTask.comments = [
              ...(this.modalTask.comments || []),
              newComment,
            ];

            this.newComment = '';
          } else {
            this.notificationService.showError(
              response?.message || 'Failed to add comment'
            );
          }
        },
        (error) => {
          this.showLoader = false;
          this.notificationService.showError(
            error?.message || 'An error occurred'
          );
        }
      );
    } else {
      this.notificationService.showError('Comment cannot be empty');
    }
  }

  projectDetails(projectId: any) {
    this.activeModal.close();
    this.router.navigate(['/boss-user/view-project'], {
      queryParams: { id: projectId },
    });
  }

  getTask() {
    this.showLoader = true;
    const payload = { assignTo: this.loginUser?.id, status: 'Completed' };
    this.superService.getTaskUserwise(payload).subscribe(
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

  summaryDetail(type: string) {
    this.saveChanges(type);
  }

  statusChange(status: string) {
    this.status = status;
    this.commentData = [];
    this.statusComment.reset();
  }

  pushStatus() {
    if (!this.statusComment.value) {
      this.notificationService.showError('Please enter a status comment');
      return;
    }

    // Create a new date instance for the current date and time
    const currentDate = new Date();

    this.commentData.push({
      comment: this.statusComment.value,
      date: currentDate.toISOString(), // ISO format for standardization (optional)
      status: this.status,
      userId: this.loginUser?._id
    });

    // Reset the comment input field
    this.statusComment.reset();
  }

  saveChanges(type?: string, contractEdit?: boolean) {
    let payload: any = {};

    if (!contractEdit) {
      // Validation for status
      if (!this.status) {
        return this.notificationService.showError('Please select a status.');
      }

      // Validation for comment
      if (
        !this.statusComment.value &&
        !this.commentData.some((item) => item.status === this.status)
      ) {
        return this.notificationService.showError(
          'Please provide a comment for the selected status.'
        );
      }

      // Add the comment to commentData only if it's provided
      if (this.statusComment.value && this.statusDate.value) {
        this.commentData.push({
          comment: this.statusComment.value,
          date: this.statusDate.value,
          status: this.status,
          userId: this.loginUser?._id
        });
        this.statusComment.reset(); // Clear the comment field after adding
      }

      // Prepare payload
      payload = {
        status: this.status || '',
        statusComment: this.commentData,
      };

      // Add fail reason if applicable
      if (this.failStatusReason?.value) {
        payload['failStatusReason'] = [this.failStatusReason?.value] || [];
      }
    }

    // API call to update project details
    this.feasibilityService
      .updateProjectDetails(payload, this.modalTask?.project?._id)
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              'Project updated successfully'
            );
            this.isEditing = false;
            //  this.getProjectDetails();
          } else {
            this.notificationService.showError(
              response?.message || 'Failed to update project'
            );
          }
        },
        (error) => {
          this.notificationService.showError('Failed to update project');
        }
      );
  }

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.projectDetail = response?.data;

          // Assign only the first 3 logs to the logs property
          this.logs = response?.data?.logs?.slice(0, 3) || [];
          this.status = this.projectDetail?.status;
          this.commentData = this.projectDetail?.statusComment;
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
