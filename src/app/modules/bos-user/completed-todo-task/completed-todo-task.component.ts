import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as bootstrap from 'bootstrap';
import { Editor } from 'ngx-editor';
import { Toolbar } from 'ngx-editor';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Payload } from 'src/app/utility/shared/constant/payload.const';

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
  searchText: any;
  myControl = new FormControl();
  selectedtype: any[] = [];
  selectedpriority: any[] = [];
  selectedUserIds: number[] = [];
  page: number = 1;
  pagesize: number = 50;
  totalRecords: number = 0;
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
  bidStatus: string = 'Expired';
  bidCommentData: any[] = [];
  bidManagerStatusComment: FormControl = new FormControl('');
  projectList: any = [];
  timeMinutes: number | null = null;
  minutesOptions: { value: number; label: string }[] = [];
  timeError: string = '';

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  editor!: Editor;
  commentForm!: FormGroup;

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
    this.getProjectList();
    this.editor = new Editor();
    this.initializeMinutesOptions();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  initializeMinutesOptions() {
    // Clear existing options if any
    this.minutesOptions = [];

    // Individual minutes: 1, 2, 3, 4, 5
    for (let i = 1; i <= 5; i++) {
      this.minutesOptions.push({
        label: `${i} min`,
        value: i
      });
    }

    // 5-minute intervals from 10 to 60 minutes
    for (let i = 10; i <= 60; i += 5) {
      this.minutesOptions.push({
        label: `${i} min`,
        value: i
      });
    }

    // Keep existing intervals: 10-minute intervals from 70 to 180 minutes (3 hours)
    for (let i = 70; i <= 180; i += 10) {
      this.minutesOptions.push({
        label: i < 60 ? `${i} min` : `${Math.floor(i / 60)} hour${i % 60 === 0 ? '' : ` ${i % 60} min`}`,
        value: i
      });
    }

    // Keep existing intervals: 30-minute intervals from 3.5 hours to 24 hours
    for (let i = 210; i <= 1440; i += 30) {
      this.minutesOptions.push({
        label: `${Math.floor(i / 60)} hour${i % 60 === 0 ? '' : ` ${i % 60} min`}`,
        value: i
      });
    }
  }

  validateTimeInput(): boolean {
    if (this.loginUser?.role === 'ProjectManager' && this.timeMinutes === null) {
      this.timeError = 'Time spent is required for Project Managers';
      return false;
    }

    this.timeError = '';
    return true;
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
          const currentScrollPosition = window.pageYOffset;

          // Refresh the task list
          this.showLoader = true;
          this.superService.getsuperadmintasks(this.selectedUserIds.join(','), 'Ongoing')
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
                  // Restore scroll position after data is loaded
                  window.scrollTo(0, currentScrollPosition);
                } else {
                  this.notificationService.showError(response?.message);
                }
                window.location.reload();
                this.showLoader = false;
              },
              (error) => {
                this.notificationService.showError(error?.error?.message || error?.message);
                this.showLoader = false;
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


  statusBidChange(status: string) {
    this.bidStatus = status;
    this.bidCommentData = [];
    this.bidManagerStatusComment.reset();
  }

  getProjectList() {
    this.showLoader = true;
    this.projectService.getProjectList(Payload.projectList).subscribe(
      (response) => {
        this.projectList = [];
        if (response?.status == true) {
          this.showLoader = false;
          this.projectList = response?.data?.data;
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

  searchtext() {
    this.showLoader = true;
    const sortType = Array.isArray(this.selectedtype) ? this.selectedtype[0] : this.selectedtype;
    const priorityType = Array.isArray(this.selectedpriority) ? this.selectedpriority[0] : this.selectedpriority;
    const assignTo = this.loginUser?.id;
    // Pass the searchText (keyword) in the API call
    const keyword = this.searchText;  // The search text to filter by

    this.superService
      .getsuperadmintasks(
        assignTo,
        'Completed',
        sortType,
        priorityType,
        keyword
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
          this.notificationService.showError(error?.error?.message || error?.message);
          this.showLoader = false;
        }
      );
  }

  pushBidStatus() {
    if (!this.bidManagerStatusComment.value) {
      this.notificationService.showError('Please enter a status comment');
      return;
    }

    // Create a new date instance for the current date and time
    const currentDate = new Date();

    this.bidCommentData.push({
      comment: this.bidManagerStatusComment.value,
      date: currentDate.toISOString(), // ISO format for standardization (optional)
      bidManagerStatus: this.bidStatus,
      userId: this.loginUser?._id,
    });

    // Reset the comment input field
    this.bidManagerStatusComment.reset();
  }

  saveBidStatus(type?: string, contractEdit?: boolean) {
    let payload: any = {};
    if (!contractEdit) {
      if (!this.bidStatus) {
        return this.notificationService.showError('Please select a status.');
      }

      if (this.bidManagerStatusComment.value) {
        return this.notificationService.showError(
          'Please click the "Add" button to save your comment.'
        );
      }

      // Check if the status has at least one comment
      const hasExistingComment = this.bidCommentData.some(
        (item) => item.bidManagerStatus === this.bidStatus
      );
      if (!hasExistingComment && !this.bidManagerStatusComment.value) {
        return this.notificationService.showError(
          'Please provide a comment for the selected status.'
        );
      }
      payload = {
        bidManagerStatus: this.bidStatus || '',
        bidManagerStatusComment: [
          ...this.bidCommentData,
          // ...this.projectDetails?.bidManagerStatusComment,
        ],
      };
    }

    // API call to update project details
    this.feasibilityService
      .updateProjectDetailsBid(payload, this.modalTask?.project?._id)
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              'Project updated successfully'
            );
            this.isEditing = false;
            // this.getProjectDetails();
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

  isBidCommentValid(): boolean {
    // Validate if a comment exists for the selected status or is added
    const hasComment = this.bidCommentData.some(
      (item) => item.bidManagerStatus === this.bidStatus
    );
    const hasUnaddedComment = this.bidManagerStatusComment.value && !hasComment;
    return this.bidStatus && (hasComment || hasUnaddedComment);
  }


  openTaskModal(task: any) {
    console.log(task);
    this.modalTask = { ...task };
  }

  addComment(comment: string, id: string) {
    if (comment?.trim().length > 0) {
      if (!this.validateTimeInput()) {
        this.notificationService.showError('Please select the time spent');
        return;
      }

      this.showLoader = true;
      const payload: any = {
        comment: comment.trim(),
        date: new Date().toISOString().split('T')[0]
      };

      if (this.timeMinutes !== null) {
        payload.minutes = Number(this.timeMinutes);
      }

      this.superService.addComments(payload, id).subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess('Comment added successfully');
            this.newComment = '';
            this.timeMinutes = null;
            window.location.reload();
          } else {
            this.notificationService.showError(
              response?.message || 'Failed to add comment'
            );
          }
          this.showLoader = false;
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
    const modalElement = document.getElementById('taskDetailsModal');

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

      // Check if the project status is 'Fail' to determine the redirect path
      if (this.modalTask?.project?.status === 'Fail') {
        // Redirect to completed-project-details route
        this.router.navigate(['/project-manager/project/completed-project-details'], { queryParams: { id: projectId } });
      } else {
        // Use the original bid-manager-project-details route
        this.router.navigate(['/project-manager/project/bid-manager-project-details'], { queryParams: { id: projectId } });
      }
    }, 300); // Delay slightly to ensure Bootstrap cleanup is complete
  }

  getTask() {
    this.showLoader = true;
    this.superService.getTaskUserwise({
      assignTo: this.loginUser?.id,
      status: 'Completed',
      page: this.page,
      limit: this.pagesize
    }).subscribe(
      (response) => {
        if (response?.status === true) {
          const today = new Date().toISOString().split("T")[0];
          this.totalRecords = response?.data?.meta_data?.items || 0;
          this.taskList = response?.data?.data.map((task: any) => {
            const todayComments = task?.comments;
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
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  paginate(page: number) {
    this.page = page;
    this.getTask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  //       this.notificationService.showError(error?.error?.message || error?.message);
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
        payload['failStatusReason'] = this.failStatusReason?.value ? [this.failStatusReason.value] : [];
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
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  // Get the assigned user name from resources array
  getAssignedUserName(resources: any[]): string {
    if (!resources || resources.length === 0) {
      return 'Unassigned';
    }

    const candidateId = resources[0].candidateId;
    if (!candidateId) {
      return 'Unassigned';
    }

    // If candidateId is an object with name property (full user object)
    if (typeof candidateId === 'object' && 'name' in candidateId) {
      return candidateId.name;
    }

    // If candidateId is an object with userDetail property
    if (typeof candidateId === 'object' && 'userDetail' in candidateId && candidateId.userDetail) {
      return candidateId.userDetail.name || 'Unknown User';
    }

    // Otherwise find from userList by ID
    const user = this.userList.find((u: any) => u._id === candidateId);
    return user ? (user.userName || user.name) : 'Unknown User';
  }

  // Check if current user is assigned to this subtask
  isCurrentUserAssigned(resources: any[]): boolean {
    if (!resources || resources.length === 0 || !this.loginUser) {
      return false;
    }

    const candidateId = resources[0].candidateId;
    if (!candidateId) {
      return false;
    }

    // Check if candidateId is an object with _id property
    if (typeof candidateId === 'object' && '_id' in candidateId) {
      return candidateId._id === this.loginUser.id;
    }

    // Handle string ID comparison
    return candidateId === this.loginUser.id;
  }
}
