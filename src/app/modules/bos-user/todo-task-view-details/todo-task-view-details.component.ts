import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as bootstrap from 'bootstrap';
import { Editor, Toolbar } from 'ngx-editor';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-todo-task-view-details',
  templateUrl: './todo-task-view-details.component.html',
  styleUrls: ['./todo-task-view-details.component.scss']
})
export class TodoTaskViewDetailsComponent implements OnInit, OnDestroy {
  taskDetails: string = '';
  taskTitle: string = '';
  showLoader: boolean = false;
  taskList: any[] = [];
  userList: any[] = [];
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
  projectList: any[] = [];
  bidStatus: string = 'Expired';
  bidCommentData: any[] = [];
  bidManagerStatusComment: FormControl = new FormControl('');
  selectedStatus: string = '';
  searchText: any;
  myControl = new FormControl();
  selectedpriority: any[] = [];
  selectedtype: any[] = [];
  selectedUserIds: number[] = [];
  previousPage: string = '/bos-user/todo-task';

  editor!: Editor;
  commentForm!: FormGroup;
  timeStart: string = '';
  timeEnd: string = '';
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

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private feasibilityService: FeasibilityService,
    private projectManagerService: ProjectManagerService,
    private projectService: ProjectService,
    private fb: FormBuilder
  ) {
    this.loginUser = this.localStorageService.getLogger();
    this.editor = new Editor();
    this.commentForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadTaskDetails(params['id']);
      } else {
        // Try to get the task from localStorage as a fallback
        const savedTask = localStorage.getItem('selectedTask');
        if (savedTask) {
          this.modalTask = JSON.parse(savedTask);
        } else {
          this.notificationService.showError('Task not found');
          this.goBack();
        }
      }
    });

    this.getProjectList();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // Navigate back to the previous page
  goBack() {
    this.router.navigate([this.previousPage]);
  }

  // Function to transform the data
  transformData = (data: any) => {
    let commentsData: any[] = [];
    if (!data) {
      return [];
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

  // Method to add comment using ngx-editor
  addCommentWithEditor(taskId: string): void {
    const commentContent = this.commentForm.get('description')?.value;
    if (!commentContent || !taskId) {
      this.notificationService.showError('Please add a comment');
      return;
    }

    this.showLoader = true;
    const payload = {
      comment: commentContent,
      taskId: taskId,
      userId: this.loginUser?.id
    };

    this.superService.addComments(payload, taskId).subscribe(
      (response: any) => {
        this.showLoader = false;
        if (response?.status === true) {
          this.notificationService.showSuccess('Comment added successfully');
          this.commentForm.reset();
          this.getTask(); // Reload tasks to show the new comment
        } else {
          this.notificationService.showError(response?.message || 'Failed to add comment');
        }
      },
      (error: any) => {
        this.showLoader = false;
        this.notificationService.showError(error?.message || 'An error occurred');
      }
    );
  }

  searchtext() {
    this.showLoader = true;
    const sortType = Array.isArray(this.selectedtype) ? this.selectedtype[0] : this.selectedtype;
    const priorityType = Array.isArray(this.selectedpriority) ? this.selectedpriority[0] : this.selectedpriority;
    const assignTo = this.loginUser?.id;
    const keyword = this.searchText;  // The search text to filter by

    this.superService
      .getsuperadmintasks(
        assignTo,
        'Ongoing',
        sortType,
        priorityType,
        keyword // Pass it as the keyword in the API request
      )
      .subscribe(
        (response: any) => {
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
        (error: any) => {
          this.notificationService.showError(error?.error?.message || error?.message);
          this.showLoader = false;
        }
      );
  }

  onChangeMyday(value: any) {
    console.log(value);
    let params = {
      status: value,
    };
    this.updateTask(params);
  }

  // API call to update the task
  updateTask(params: any) {
    this.superService.updateTask(params, this.modalTask._id).subscribe(
      (response: any) => {
        this.getTask();
        this.notificationService.showSuccess('Task updated Successfully');
      },
      (error: any) => {
        console.error('Error updating task', error);
        this.notificationService.showError('Error updating task');
      }
    );
  }

  getProjectList() {
    this.showLoader = true;
    this.projectService.getProjectList(Payload.projectList).subscribe(
      (response: any) => {
        this.projectList = [];
        if (response?.status == true) {
          this.showLoader = false;
          this.projectList = response?.data?.data;
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error: any) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
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
      // Update the assignTo list
      this.assignTo = paramValue;

      // Add updated assignTo list to params
      params.assignTo = this.assignTo;
    } else if (paramKey === 'pickACategory' && paramValue) {
      params.pickACategory = paramValue;
    } else if (paramKey === 'taskStatus' && paramValue) {
      params.status = paramValue;
    } else if (paramKey === 'assignProjectId' && paramValue) {
      params.project = paramValue;
    } else if (paramKey === 'completedTask') {
      params.completedTask = true; // Ensure it always sends true
    }

    // Call the updateTask method with updated params
    this.updateTask(params);
  }


  openTaskModal(task: any) {
    console.log(task);
    this.modalTask = { ...task };
  }

  addComment(id: string) {
    const commentContent = this.commentForm.get('description')?.value;

    if (!commentContent || !id) {
      this.notificationService.showError('Please add a comment');
      return;
    }

    if (!this.validateTimeRange()) {
      this.notificationService.showError('Please correct the time range');
      return;
    }

    this.showLoader = true;
    const payload: {
      comment: string;
      taskId: string;
      userId: string;
      timeStart?: string;
      timeEnd?: string;
    } = {
      comment: commentContent,
      taskId: id,
      userId: this.loginUser?.id
    };

    // Only add time parameters if they have values
    if (this.timeStart) {
      payload.timeStart = this.timeStart;
    }
    if (this.timeEnd) {
      payload.timeEnd = this.timeEnd;
    }

    this.superService.addComments(payload, id).subscribe(
      (response: any) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Comment added successfully');
          this.commentForm.reset();
          this.timeStart = '';
          this.timeEnd = '';
          this.timeError = '';
          // Reload task details
          this.loadTaskDetails(id);
        } else {
          this.notificationService.showError(response?.message || 'Failed to add comment');
          this.showLoader = false;
        }
      },
      (error: any) => {
        this.notificationService.showError(error?.message || 'An error occurred');
        this.showLoader = false;
      }
    );
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
      this.router.navigate(['/project-manager/project/bid-manager-project-details'], { queryParams: { id: projectId } });
    }, 300); // Delay slightly to ensure Bootstrap cleanup is complete
  }

  getTask() {
    this.showLoader = true;
    this.superService.getTaskUserwise({ assignTo: this.loginUser?.id, status: 'Ongoing' }).subscribe(
      (response: any) => {
        if (response?.status === true) {
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

          // If we have a taskList but no modalTask yet, use the first item
          if (this.taskList.length > 0 && !this.modalTask) {
            this.modalTask = this.taskList[0];
          }

          this.showLoader = false;
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error: any) => {
        this.notificationService.showError(error?.error?.message || error?.message);
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

      // Add fail reason if applicable
      if (this.failStatusReason?.value) {
        payload['failStatusReason'] = [this.failStatusReason.value];
      }
    }

    // API call to update project details
    this.feasibilityService.updateProjectDetails(payload, this.modalTask?.project?._id).subscribe(
      (response: any) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Project updated successfully');
          this.isEditing = false;
          //  this.getProjectDetails();
        } else {
          this.notificationService.showError(response?.message || 'Failed to update project');
        }
      },
      (error: any) => {
        this.notificationService.showError('Failed to update project');
      }
    );
  }

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe(
      (response: any) => {
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
      (error: any) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  statusBidChange(status: string) {
    this.bidStatus = status;
    this.bidCommentData = [];
    this.bidManagerStatusComment.reset();
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
        (response: any) => {
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
        (error: any) => {
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

  loadTaskDetails(taskId: string) {
    this.showLoader = true;
    this.superService.getTaskUserwise({ assignTo: this.loginUser?.id, status: 'Ongoing' }).subscribe(
      (response: any) => {
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

          // Find the task with the matching ID
          this.modalTask = this.taskList.find(task => task._id === taskId);

          if (!this.modalTask) {
            this.notificationService.showError('Task not found');
            this.goBack();
          }

          this.showLoader = false;
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error: any) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  validateTimeRange() {
    if (this.timeStart && this.timeEnd) {
      const startTime = new Date(`2000-01-01T${this.timeStart}`);
      const endTime = new Date(`2000-01-01T${this.timeEnd}`);

      if (endTime <= startTime) {
        this.timeError = 'End time must be greater than start time';
        this.timeEnd = '';
        return false;
      }
      this.timeError = '';
      return true;
    }
    return true;
  }

  onTimeEndChange() {
    this.validateTimeRange();
  }
}
