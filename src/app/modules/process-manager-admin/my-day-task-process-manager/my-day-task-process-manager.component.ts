import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-my-day-task-process-manager',
  templateUrl: './my-day-task-process-manager.component.html',
  styleUrls: ['./my-day-task-process-manager.component.scss']
})
export class MyDayTaskProcessManagerComponent {
  taskDetails: string = '';
  taskTitle: string = '';
  showLoader: boolean = false;
  taskList: any = [];
  userList: any = [];
  assignTo: any[] = [];
  showAll = false;
  displayedUsers: any[] = [];
  dueDate: FormControl = new FormControl(null);
  categoryList: string[] = ['High', 'Medium', 'Low'];
  statusTaskList: string[] = ['Ongoing', 'Completed'];
  selectedCategory: string | undefined;
  selectedStatus: string | undefined;
  dueDateValue: NgbDate | null = null;
  selectedUserIds: number[] = [];
  selectedtype: any[] = [];
  selectedpriority: any[] = [];
  searchText: any;
  myControl = new FormControl();
  private modalElement!: HTMLElement;
  private modalInstance: any;
  private hiddenEventSubscription!: Subscription;
  selectedtasktypes: any[] = [];
  type: any;
  filterbyDueDate = [
    { projectType: 'Newest to Oldest', value: 'Newest' },
    { projectType: 'Oldest to Newest', value: 'Oldest' }
  ];

  filterbyPriority = [
    { priorityValue: 'High', priorityvalue: 'High' },
    { priorityValue: 'Medium', priorityvalue: 'Medium' },
    { priorityValue: 'Low', priorityvalue: 'Low' }
  ];
  taskType = [
    { taskType: 'Project', taskValue: 'Project' },
    { taskType: 'Other', taskValue: 'Other' }
  ];
  loginUser: any;

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal,
    private projectManagerService: ProjectManagerService,
    private projectService: ProjectService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.getTask();
    this.getUserAllList();
    this.modalElement = document.getElementById('taskDetailsModal') as HTMLElement;

    if (this.modalElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement);

      // Listen for modal close event
      this.modalElement.addEventListener('hidden.bs.modal', this.onModalClose.bind(this));
    }
  }

  onModalClose() {
    this.selectedStatus = "";
  }

  ngOnDestroy() {
    if (this.modalElement) {
      this.modalElement.removeEventListener('hidden.bs.modal', this.onModalClose.bind(this));
    }
  }

  // Function to transform the data
  transformData = (data: any) => {
    let commentsData: any[] = [];
    if (!data) {
      return;
    }
    Object.entries(data).forEach(([commentDate, comments]) => {
      if (Array.isArray(comments)) {
        comments.forEach(comment => {
          commentsData.push({
            commentDate, // Keep the commentDate format
            ...comment
          });
        });
      } else {
        commentsData.push({
          commentDate,
          comment: comments // No comments available case
        });
      }
    });

    return commentsData;
  };

  onDueDateChange(date: NgbDate | null) {
    this.dueDateValue = date; // Update the local variable
    this.onChange('dueDate', date); // Pass the 'dueDate' key and the updated value
  }

  projectDetails(projectId: any) {
    const modalElement = document.getElementById('viewAllProjects');

    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide(); // Close the modal properly
      }
    }

    // Wait a bit to ensure Bootstrap removes modal styles before restoring scrolling
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = ''; // Reset to default behavior
      document.body.style.paddingRight = '';

      // Remove any leftover modal backdrop
      document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());

      // Force scroll to be enabled
      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';

      // Now navigate to the details page
      this.router.navigate(['/process-manager/process-manager-project-details'], { queryParams: { id: projectId } });
    }, 300); // Delay slightly to ensure Bootstrap cleanup is complete
  }

  addTask() {
    if (this.taskDetails.trim()) {
      const payload = {
        discription: this.taskDetails,
        task: this.taskTitle,
        status: 'Ongoing',
        dueDate: this.dueDate.value ? this.formatDate(this.dueDate.value) : '',
        assignTo: this.assignTo,
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
      // Find the deselected users
      const deselectedUsers = this.assignTo.filter(
        (id: string) => !paramValue.includes(id)
      );

      // Find the newly selected users
      const newSelectedUsers = paramValue.filter(
        (id: string) => !this.assignTo.includes(id)
      );

      // Handle the deselected users
      if (deselectedUsers.length > 0) {
        console.log('Deselected User:', deselectedUsers[0]);
        // Example: Pass deselected user to an API
        this.processDeselectedUser(deselectedUsers[0]);
      }

      // Handle the newly selected users
      if (newSelectedUsers.length > 0) {
        console.log('Newly Selected User:', newSelectedUsers[0]);
        // Example: Pass newly selected user to an API
        this.processSelectedUser(newSelectedUsers[0]);
      }

      // Update the assignTo list
      this.assignTo = paramValue;

      // Add updated assignTo list to params
      params.assignTo = this.assignTo;
    } else if (paramKey === 'pickACategory' && paramValue) {
      params.pickACategory = paramValue;
    } else if (paramKey === 'taskStatus' && paramValue) {
      params.status = paramValue;
    } else if (paramKey === 'completedTask') {
      params.completedTask = paramValue; // Ensure it always sends true
    }

    // Call the updateTask method with updated params
    this.updateTask(params);
  }

  processDeselectedUser(userId: string) {
    // Logic to handle deselected user (e.g., API call)
    console.log(`Processing deselected user: ${userId}`);
  }

  processSelectedUser(userId: string) {
    // Logic to handle newly selected user (e.g., API call)
    console.log(`Processing newly selected user: ${userId}`);
  }

  // API call to update the task
  updateTask(params: any) {
    this.superService.updateTask(params, this.modalTask._id).subscribe(
      (response) => {
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
  selectedUsers: any = [];
  openTaskModal(task: any) {
    this.assignTo = [];
    this.selectedUsers = [];
    task?.assignTo?.map((element: any) => {
      this.assignTo.push(element?.userId);
      this.selectedUsers.push(element?.userId);
    });
    this.modalTask = { ...task }; // Deep copy to avoid direct binding
  }

  removeTaskFromMyDay(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want remove task from my day ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.projectService.removeTaskFromMyDay(id, this.loginUser._id).subscribe(
          (response: any) => {
            if (response?.status == true) {
              this.showLoader = false;
              this.notificationService.showSuccess('Task successfully removed from my-day');
              window.location.reload();
              this.getTask();
            } else {
              this.showLoader = false;
              this.notificationService.showError(response?.message);
            }
          },
          (error) => {
            this.showLoader = false;
            this.notificationService.showError(error?.message);
          }
        );
      }
    });
  }

  getTask() {
    this.showLoader = true;
    this.superService.getMyTask(this.selectedUserIds.join(','), true).subscribe(
      (response) => {
        if (response?.status === true) {
          const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

          this.taskList = response?.data?.data.map((task: any) => {
            const todayComments = task?.comments?.filter((comment: any) =>
              comment.date.split("T")[0] === today
            );

            return {
              ...task,
              todayComments: todayComments.length ? todayComments : null, // Assign filtered comments
            };
          });

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

  searchtext() {
    this.showLoader = true;

    // Convert array to string if needed for selectedtype
    const sortType = Array.isArray(this.selectedtype) ? this.selectedtype[0] : this.selectedtype;

    // Ensure selectedpriority is a single value (not an array)
    const priorityType = Array.isArray(this.selectedpriority) ? this.selectedpriority[0] : this.selectedpriority;
    const type = Array.isArray(this.selectedtasktypes) ? this.selectedtasktypes[0] : this.selectedtasktypes || '';
    const keyword = this.searchText;  // The search text to filter by
    this.superService
      .getsuperadmintasks(
        this.selectedUserIds.join(','),
        "",
        sortType,
        priorityType,
        keyword,
        true,
        type
      )
      .subscribe(
        (response) => {
          if (response?.status === true) {
            const today = new Date().toISOString().split("T")[0];

            this.taskList = response?.data?.data.map((task: any) => {
              const todayComments = task?.comments?.filter((comment: any) =>
                comment.date.split("T")[0] === today
              );

              return {
                ...task,
                todayComments: todayComments?.length ? todayComments : null,
              };
            });

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
    const taskcount = true;
    const taskPage = 'myDay'
    this.projectManagerService.getUserallList(taskcount, taskPage).subscribe(
      (response) => {
        if (response?.status === true) {
          this.userList = response?.data?.filter(
            (user: any) => user?.role !== 'SupplierAdmin'
          );
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
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.projectService.deleteTask(id).subscribe(
          (response: any) => {
            if (response?.status == true) {
              this.showLoader = false;
              this.notificationService.showSuccess('Task successfully deleted');
              window.location.reload();
              this.getTask();
            } else {
              this.showLoader = false;
              this.notificationService.showError(response?.message);
            }
          },
          (error) => {
            this.showLoader = false;
            this.notificationService.showError(error?.message);
          }
        );
      }
    });
  }

  enableEdit(comment: any): void {
    comment.isEditing = true;
    comment.updatedComment = comment.comment; // Initialize with the existing comment
  }

  cancelEdit(comment: any): void {
    comment.isEditing = false;
  }

  updateTaskComment(comment: any): void {
    if (comment.updatedComment.trim()) {
      const payload = {
        commentId: comment.commentId,
        comment: comment.updatedComment,
      };

      this.superService.updateComment(payload, comment._id, this.modalTask._id).subscribe(
        (response) => {
          if (response?.status == true) {
            this.notificationService.showSuccess('Comment Updated Successfully');
            this.getTask();
            comment.comment = comment.updatedComment; // Update UI
            comment.isEditing = false; // Exit edit mode
          } else {
            this.notificationService.showError(response?.message || 'Comment cannot be updated after 24 hours');
          }
        },
        (error) => {
          this.notificationService.showError(error?.message || 'Comment cannot be updated after 24 hours');
        }
      );
    } else {
      this.notificationService.showError('Comment cannot be empty');
    }
  }

  toggleView() {
    this.showAll = !this.showAll;
    this.displayedUsers = this.showAll
      ? this.userList
      : this.userList.slice(0, 7);
  }

  private formatDate(date: {
    year: number;
    month: number;
    day: number;
  }): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(
      date.day
    ).padStart(2, '0')}`;
  }

  newComment: string = '';

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

  // Edit a comment
  editComment(index: number) {
    this.newComment = this.modalTask.comments[index].text;
    this.modalTask.comments.splice(index, 1); // Remove old comment
  }

  // Delete a comment
  deleteComment(index: number) {
    this.modalTask.comments.splice(index, 1);
  }

  toggleUserSelection(userId: number): void {
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }
    this.getTask();
  }
}
