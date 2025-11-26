import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import Swal from 'sweetalert2';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

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
  assignProject: string | undefined;
  selectedTaskType: string | undefined;
  showAll = false;
  displayedUsers: any[] = [];
  dueDate: FormControl = new FormControl(null);
  categoryList: string[] = ['High', 'Medium', 'Low'];
  statusTaskList: string[] = ['Ongoing', 'Completed'];
  taskTypeList: string[] = ['Project', 'Other'];
  selectedCategory: string | undefined;
  selectedStatus: string | undefined;
  dueDateValue: NgbDate | null = null;
  selectedUserIds: number[] = [];
  projectList: any = [];
  statusComment: FormControl = new FormControl('');
  commentData: any[] = [];
  status: string = 'Expired';
  failStatusReason: FormControl = new FormControl('');
  statusDate: FormControl = new FormControl('');
  isEditing = false;
  loginUser: any;
  selectedtype: any[] = [];
  selectedpriority: any[] = [];
  selectedtasktypes: any[] = [];
  searchText: any;
  myControl = new FormControl();
  type: any;
  page: number = 1;
  pagesize: number = 50;
  totalRecords: number = 0;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  taskType = [
    { taskType: 'Project', taskValue: 'Project' },
    { taskType: 'Other', taskValue: 'Other' }
  ];

  filterbyDueDate = [
    { projectType: 'Newest to Oldest', value: 'Newest' },
    { projectType: 'Oldest to Newest', value: 'Oldest' }
  ];

  filterbyPriority = [
    { priorityValue: 'High', priorityvalue: 'High' },
    { priorityValue: 'Medium', priorityvalue: 'Medium' },
    { priorityValue: 'Low', priorityvalue: 'Low' }
  ];

  private modalElement!: HTMLElement;
  private modalInstance: any;
  private hiddenEventSubscription!: Subscription;
  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal,
    private projectManagerService: ProjectManagerService,
    private projectService: ProjectService,
    private router: Router,
    private feasibilityService: FeasibilityService,
    private localStorageService: LocalStorageService,
    private spinner: NgxSpinnerService
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.getTask();
    this.getUserAllList();
    this.getProjectList();
    this.modalElement = document.getElementById('taskDetailsModal') as HTMLElement;

    if (this.modalElement) {
      this.modalInstance = new bootstrap.Modal(this.modalElement);

      // Listen for modal close event
      this.modalElement.addEventListener('hidden.bs.modal', this.onModalClose.bind(this));
    }
  }

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500)
      )
      .subscribe(value => {
        this.searchText = value;
        this.searchtext(); // Call your search method
      });
  }

  // Navigate to task detail page instead of opening modal
  navigateToTaskDetail(task: any) {
    if (task && task._id) {
      this.router.navigate(['/process-manager/todo-task-view-details', task._id]);
    } else {
      this.notificationService.showError('Task ID not found');
    }
  }

  transformData = (data: any) => {
    let commentsData: any[] = [];
    if (!data) {
      return;
    }
    Object.entries(data).forEach(([commentDate, comments]) => {
      if (commentDate === 'pinnedComments') {
        return;
      }
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

  onModalClose() {
    this.selectedStatus = "";
  }

  ngOnDestroy() {
    if (this.modalElement) {
      this.modalElement.removeEventListener('hidden.bs.modal', this.onModalClose.bind(this));
    }
  }

  onDueDateChange(date: NgbDate | null) {
    this.dueDateValue = date; // Update the local variable
    this.onChange('dueDate', date); // Pass the 'dueDate' key and the updated value
  }

  getProjectList() {
    this.showLoader = true;
    this.projectService.getProjectList(Payload.projectList).subscribe((response) => {
      this.projectList = [];
      if (response?.status == true) {
        this.showLoader = false;
        this.projectList = response?.data?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.error?.message || error?.message);
      this.showLoader = false;
    });
  }

  statusChange(status: string) {
    this.status = status;
    this.commentData = [];
    this.statusComment.reset();
  }

  summaryDetail(type: string) {
    this.saveChanges(type);
  }

  saveChanges(type?: string, contractEdit?: boolean) {
    let payload: any = {};

    if (!contractEdit) {
      // Validation for status
      if (!this.status) {
        return this.notificationService.showError('Please select a status.');
      }

      // Validation for comment
      if (!this.statusComment.value && !this.commentData.some(item => item.status === this.status)) {
        return this.notificationService.showError('Please provide a comment for the selected status.');
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

    }

    // API call to update project details
    this.feasibilityService.updateProjectDetails(payload, this.modalTask?.project?._id).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Project updated successfully');
          this.isEditing = false;
          //  this.getProjectDetails();
        } else {
          this.notificationService.showError(response?.message || 'Failed to update project');
        }
      },
      (error) => {
        this.notificationService.showError('Failed to update project');
      }
    );
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
      this.router.navigate(['/super-admin/tracker-wise-project-details'], { queryParams: { id: projectId } });
    }, 300); // Delay slightly to ensure Bootstrap cleanup is complete
  }

  addTask() {
    if (this.taskDetails.trim()) {
      const payload = {
        discription: this.taskDetails,
        task: this.taskTitle,
        status: 'Ongoing',
        dueDate: this.dueDate ? this.formatDate(this.dueDate) : null,
        assignTo: this.assignTo,
        type: this.type
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
          this.notificationService.showError(error?.error?.message || error?.message);
        }
      );
    } else {
      this.notificationService.showError('Please Enter Task Details');
    }
  }

  onChange(paramKey: string, paramValue: any) {
    const params: any = {};

    if (paramKey === 'dueDate' && paramValue) {
      // ✅ Since `type="date"` gives a string (YYYY-MM-DD), use it directly
      params.dueDate = paramValue;
    }
    else if (paramKey === 'assignTo' && paramValue) {
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
        this.processDeselectedUser(deselectedUsers[0]);
      }

      // Handle the newly selected users
      if (newSelectedUsers.length > 0) {
        console.log('Newly Selected User:', newSelectedUsers[0]);
        this.processSelectedUser(newSelectedUsers[0]);
      }

      // Update the assignTo list
      this.assignTo = paramValue;
      params.assignTo = this.assignTo;
    } else if (paramKey === 'pickACategory' && paramValue) {
      params.pickACategory = paramValue;
    } else if (paramKey === 'taskStatus' && paramValue) {
      params.status = paramValue;
    } else if (paramKey === 'assignProjectId' && paramValue) {
      params.project = paramValue;
    } else if (paramKey === 'completedTask') {
      params.completedTask = paramValue;
    } else if (paramKey === 'type') {
      params.type = paramValue;
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
  expandedComments: { [key: string]: boolean } = {}; // Track expanded state of comments

  openTaskModal(task: any) {
    this.assignTo = [];
    this.selectedUsers = [];
    task?.assignTo?.map((element: any) => {
      this.assignTo.push(element?.userId);
      this.selectedUsers.push(element?.userId);
    });
    this.modalTask = { ...task }; // Deep copy to avoid direct binding
  }

  toggleCommentExpansion(commentId: string): void {
    this.expandedComments[commentId] = !this.expandedComments[commentId];
  }

  isCommentExpanded(commentId: string): boolean {
    return !!this.expandedComments[commentId];
  }

  shouldShowViewMoreButton(comment: string): boolean {
    // Check if comment has more than 3 lines worth of content
    // Rough estimate: if comment is longer than ~150 characters, show button
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = comment;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.length > 150;
  }

  getTask() {
    this.showLoader = true;
    this.spinner.show();
    this.superService.getMyTask(this.selectedUserIds.join(','), true, '', '', '', this.page, this.pagesize).subscribe(
      (response) => {
        if (response?.status === true) {
          this.totalRecords = response?.data?.meta_data?.items || 0;

          const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

          this.taskList = response?.data?.data.map((task: any) => {
            const todayComments = task?.comments?.filter((comment: any) =>
              comment.date.split("T")[0] === today
            );

            return {
              ...task,
              todayComments: todayComments?.length ? todayComments : null, // Assign filtered comments
            };
          });

          this.showLoader = false;
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
        this.spinner.hide();
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
        this.spinner.hide();
      }
    );
  }

  searchtext() {
    // Reset page to 1 when searching
    this.page = 1;

    this.showLoader = true;
    const sortType = Array.isArray(this.selectedtype) ? this.selectedtype[0] : this.selectedtype;
    const priorityType = Array.isArray(this.selectedpriority) ? this.selectedpriority[0] : this.selectedpriority;
    const type = Array.isArray(this.selectedtasktypes) ? this.selectedtasktypes[0] : this.selectedtasktypes || '';
    const keyword = this.searchText ? this.searchText.trim().toLowerCase() : '';  // Ensure keyword is properly formatted

    console.log('Searching for:', keyword);
    this.spinner.show();

    // Use the same parameters for consistency between initial load and search
    this.superService
      .getsuperadmintasks(
        this.selectedUserIds.join(','),  // assignId
        "",                              // status
        sortType,                        // sort
        priorityType,                    // pickACategory
        keyword,                         // keyword
        true,                            // myDay
        type,                            // type
        this.page,                       // page - reset to 1 on search
        this.pagesize                    // pagesize
      )
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.totalRecords = response?.data?.meta_data?.items || 0;
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
          } else {
            this.notificationService.showError(response?.message);
            this.taskList = [];  // Clear the list on error
          }
          this.showLoader = false;
          this.spinner.hide();
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || error?.message);
          this.showLoader = false;
          this.spinner.hide();
          this.taskList = [];  // Clear the list on error
        }
      );

    this.getUserAllList();
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
        this.notificationService.showError(error?.error?.message || error?.message);
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
            this.notificationService.showError(error?.error?.message || error?.message);
          }
        );
      }
    });
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
            this.notificationService.showError(error?.error?.message || error?.message);
          }
        );
      }
    });
  }


  deleteComment(id: any, task: any) {
    let param = {
      commentId: id
    };
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete this comment?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.projectService.deleteComment(param, task._id).subscribe(
          (response: any) => {
            if (response?.status === true) {
              this.showLoader = false;
              this.notificationService.showSuccess('Comment successfully deleted');
              window.location.reload();
            } else {
              this.showLoader = false;
              this.notificationService.showError(response?.message);
            }
          },
          (error) => {
            this.showLoader = false;
            this.notificationService.showError(error?.error?.message || error?.message);
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

  formatDate(date: any): string {
    if (!date) return ''; // Handle null case

    if (typeof date === 'string') {
      return date; // If already in YYYY-MM-DD format, return as is
    } else if (typeof date === 'object' && date.year && date.month && date.day) {
      // If using NgbDate object
      return `${date.year}-${this.padZero(date.month)}-${this.padZero(date.day)}`;
    }

    // Convert Date object to YYYY-MM-DD
    const d = new Date(date);
    return `${d.getFullYear()}-${this.padZero(d.getMonth() + 1)}-${this.padZero(d.getDate())}`;
  }

  // Helper function to add leading zero to single-digit months/days
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
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
  // deleteComment(index: number) {
  //   this.modalTask.comments.splice(index, 1);
  // }

  toggleUserSelection(userId: number): void {
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }
    this.getTask();
  }

  togglePinComment(comment: any, task: any) {
    if (!comment?.commentId || !task?._id) {
      this.notificationService.showError('Missing required data for pinning comment');
      return;
    }

    const payload = {
      pin: !comment.pinnedAt
    };

    this.superService.updateCommentPin(task._id, comment.commentId, payload).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess(comment.pinnedAt ? 'Comment unpinned successfully' : 'Comment pinned successfully');
          // Update the comment's pinned status
          comment.pinnedAt = comment.pinnedAt ? null : new Date().toISOString();

          // Store current scroll position
          const currentScrollPosition = window.scrollY;

          // Refresh the task list
          this.showLoader = true;
          this.spinner.show();
          this.superService.getMyTask(this.selectedUserIds.join(','), true, '', '', '', this.page, this.pagesize)
            .subscribe(
              (response) => {
                if (response?.status === true) {
                  const today = new Date().toISOString().split("T")[0];
                  this.totalRecords = response?.data?.meta_data?.items || 0;
                  this.taskList = response?.data?.data.map((task: any) => {
                    const todayComments = task?.comments?.filter((comment: any) =>
                      comment.date.split("T")[0] === today
                    );
                    return {
                      ...task,
                      todayComments: todayComments?.length ? todayComments : null,
                    };
                  });
                  // Restore scroll position after data is loaded
                  window.scrollTo(0, currentScrollPosition);
                } else {
                  this.notificationService.showError(response?.message);
                }
                this.showLoader = false;
                this.spinner.hide();
              },
              (error) => {
                this.notificationService.showError(error?.error?.message || error?.message);
                this.showLoader = false;
                this.spinner.hide();
              }
            );
        } else {
          this.notificationService.showError(response?.message || 'Failed to update comment pin status');
        }
      },
      (error: any) => {
        this.notificationService.showError(error?.message || 'Failed to update comment pin status');
      }
    );
  }

  paginate(page: number) {
    this.page = page;
    this.getTask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
