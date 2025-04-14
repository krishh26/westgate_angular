import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as bootstrap from 'bootstrap';
import { Toolbar } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import Swal from 'sweetalert2';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-ongoing-todo-task',
  templateUrl: './ongoing-todo-task.component.html',
  styleUrls: ['./ongoing-todo-task.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1
      })),
      state('out', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in'))
    ])
  ]
})
export class OngoingTodoTaskComponent {
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
  page: number = pagination.page;
  pagesize = 50;
  totalRecords: number = pagination.totalRecords;
  statusDate: FormControl = new FormControl('');
  FeasibilityOtherDocuments: any = [];
  logs: any = [];
  subContracting: boolean = true;
  loginModalMode: boolean = true;
  isEditing = false;
  projectId: string = '';
  projectDetail: any = [];
  projectList: any = [];
  bidStatus: string = 'Expired';
  bidCommentData: any[] = [];
  bidManagerStatusComment: FormControl = new FormControl('');
  selectedStatus: string | undefined;
  searchText: any;
  myControl = new FormControl();
  selectedpriority: any[] = [];
  selectedtype: any[] = [];
  selectedUserIds: number[] = [];
  timeStart: string = '';
  timeEnd: string = '';
  todayDate: string = new Date().toISOString().split('T')[0];
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

  subtasks: any[] = [];
  newSubtask: any = {
    name: '',
    description: '',
    dueDate: '',
    assignedTo: null
  };
  candidateList: any[] = [];
  showSubtasks: boolean = false;

  // Add this property to store subtasks
  subtasksList: any[] = []; // Initialize as empty array

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private router: Router,
    private feasibilityService: FeasibilityService,
    private projectManagerService: ProjectManagerService,
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {

    this.getTask();
    // this.getUserAllList();
    this.getProjectList();
    this.editor = new Editor();
    this.getUserAllList();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  logoutTask() {
    this.spinner.show();
    this.superService.logoutTask().subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response?.status === true) {
          this.notificationService.showSuccess('Successfully logged out from task');
        } else {
          this.notificationService.showError(response?.message || 'Failed to logout from task');
        }
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.error?.message || 'An error occurred while logging out');
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


          } else {
            this.notificationService.showError(response?.message);

          }
        },
        (error) => {
          this.notificationService.showError(error?.message);

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

  getProjectList() {

    this.projectService.getProjectList(Payload.projectList).subscribe(
      (response) => {
        this.projectList = [];
        if (response?.status == true) {

          this.projectList = response?.data?.data;
        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.message);

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
    this.getSubtasks(task._id);
  }

  paginate(page: number) {
    this.page = page;
    this.getTask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  addComment(comment: string, taskId: string) {
    if (comment?.trim().length > 0) {
      if (!this.validateTimeRange()) {
        this.notificationService.showError('Please correct the time range');
        return;
      }

      const payload: any = {
        comment: comment.trim(),
        date: this.todayDate
      };

      // Only add time parameters if they have values
      if (this.timeStart) {
        payload.timeStart = this.timeStart;
      }
      if (this.timeEnd) {
        payload.timeEnd = this.timeEnd;
      }

      this.spinner.show();
      this.superService.addComments(payload, taskId).subscribe(
        (response) => {
          this.spinner.hide();
          if (response?.status === true) {
            this.notificationService.showSuccess('Comment added successfully');
            this.newComment = '';
            this.timeStart = '';
            this.timeEnd = '';
            // Reload the task details
            this.getTask();
          } else {
            this.notificationService.showError(response?.message || 'Failed to add comment');
          }
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || 'An error occurred');
          this.spinner.hide();
        }
      );
    } else {
      this.notificationService.showError('Comment cannot be empty');
    }
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

      // Determine the route based on user role
      let route: string;
      if (this.loginUser?.role === 'BOS') {
        route = '/boss-user/bos-user-project-details';
      } else if (this.loginUser?.role === 'ProjectManager') {
        route = '/project-manager/project/bid-manager-project-details';
      } else {
        // Default route if role is not recognized
        route = '/boss-user/bos-user-project-details';
      }

      // Now navigate to the details page
      this.router.navigate([route], { queryParams: { id: projectId } });
    }, 300); // Delay slightly to ensure Bootstrap cleanup is complete
  }

  getTask() {
    const queryParams: any = {
      assignTo: this.loginUser?.id,
      status: 'Ongoing',
      page: this.page,
      limit: this.pagesize
    };

    // Only add time parameters if they have values
    if (this.timeStart) {
      queryParams.timeStart = this.timeStart;
    }
    if (this.timeEnd) {
      queryParams.timeEnd = this.timeEnd;
    }

    this.superService.getTaskUserwise(queryParams).subscribe(
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
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
      }
    );
  }


  // getUserAllList() {
  //
  //   this.projectManagerService.getUserAllList().subscribe(
  //     (response) => {
  //       if (response?.status === true) {
  //         // Filter out users with role 'supplierAdmin'
  //         this.userList = response?.data?.filter((user: any) => user?.role !== 'SupplierAdmin');
  //         console.log(this.userList);

  //
  //       } else {
  //         this.notificationService.showError(response?.message);
  //
  //       }
  //     },
  //     (error) => {
  //       this.notificationService.showError(error?.message);
  //
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
        payload['failStatusReason'] = [this.failStatusReason?.value] || [];
      }
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

  getProjectDetails() {

    this.projectService.getProjectDetailsById(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {

          this.projectDetail = response?.data;

          // Assign only the first 3 logs to the logs property
          this.logs = response?.data?.logs?.slice(0, 3) || [];
          this.status = this.projectDetail?.status;
          this.commentData = this.projectDetail?.statusComment;
        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.message);

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

              },
              (error) => {
                this.notificationService.showError(error?.message);

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



  isSubtaskValid(): boolean {
    return this.newSubtask.name && this.newSubtask.dueDate && this.newSubtask.assignedTo;
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

  addSubtask() {
    if (this.isSubtaskValid()) {
      // Format the date properly
      const formattedDate = this.formatDate(this.newSubtask.dueDate);

      const subtaskPayload = {
        title: this.newSubtask.name,
        description: this.newSubtask.description || '',
        dueDate: formattedDate,
        resources: [
          {
            candidateId: this.newSubtask.assignedTo
          }
        ]
      };

      console.log('Task ID:', this.modalTask._id);
      console.log('Sending subtask payload:', subtaskPayload);


      this.superService.addSubtask(this.modalTask._id, subtaskPayload).subscribe(
        (response: any) => {
          console.log('Full server response:', response);
          if (response?.success == true) {
            this.notificationService.showSuccess('Subtask added successfully');
            // Refresh the subtasks list
            this.getSubtasks(this.modalTask._id);

            // Reset form
            this.newSubtask = {
              name: '',
              description: '',
              dueDate: '',
              assignedTo: null
            };
          } else {
            console.error('Server error message:', response?.message);
            this.notificationService.showError(response?.message || 'Failed to add subtask');
          }

        },
        (error) => {
          console.error('Full error object:', error);
          console.error('Error status:', error?.status);
          console.error('Error message:', error?.message);
          console.error('Error details:', error?.error);
          this.notificationService.showError(error?.error?.message || error?.message || 'Error adding subtask');

        }
      );
    } else {
      this.notificationService.showError('Please fill in all required fields');
    }
  }

  editSubtask(subtask: any) {
    // TODO: Implement edit functionality
    // This could open a modal or inline edit form
  }

  deleteSubtask(subtaskId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this subtask?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result: any) => {
      if (result?.value) {
        this.superService.deleteSubtask(this.modalTask._id, subtaskId).subscribe(
          (response: any) => {
            if (response?.success == true) {
              this.notificationService.showSuccess('Subtask deleted successfully');
              this.getSubtasks(this.modalTask._id);
            } else {
              this.notificationService.showError(response?.message || 'Failed to delete subtask');
            }
          },
          (error) => {
            this.notificationService.showError(error?.message || 'Error deleting subtask');
          }
        );
      }
    });
  }

  getUserAllList(priorityType: string = '', type: string = '') {

    const taskcount = true;
    const taskPage = 'Ongoing'
    this.projectManagerService.getUserallList(taskcount, taskPage, priorityType, type).subscribe(
      (response) => {
        if (response?.status === true) {
          this.userList = response?.data?.filter(
            (user: any) => user?.role !== 'SupplierAdmin'
          );
          this.candidateList = this.userList.slice(0, 7);

        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.message);

      }
    );
  }

  toggleSubtasks() {
    this.showSubtasks = !this.showSubtasks;
  }

  // Add this method to get subtasks
  getSubtasks(taskId: string) {

    this.superService.getSubtasks(taskId).subscribe(
      (response: any) => {
        console.log('Subtasks response:', response);
        if (response?.status === true) {
          this.subtasksList = response?.data || [];
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch subtasks');
        }

      },
      (error) => {
        console.error('Error fetching subtasks:', error);
        this.notificationService.showError(error?.message || 'Error fetching subtasks');

      }
    );
  }

  // Add method to format date for display
  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  // Add method to get candidate name by ID
  getCandidateName(candidateId: string): string {
    const candidate = this.candidateList.find(c => c._id === candidateId);
    return candidate ? candidate.name : 'Unassigned';
  }
}
