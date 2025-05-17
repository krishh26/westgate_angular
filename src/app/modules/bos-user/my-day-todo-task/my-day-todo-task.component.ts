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

@Component({
  selector: 'app-my-day-todo-task',
  templateUrl: './my-day-todo-task.component.html',
  styleUrls: ['./my-day-todo-task.component.scss'],
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
export class MyDayTodoTaskComponent {
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
  bidStatus: string = 'Expired';
  bidCommentData: any[] = [];
  bidManagerStatusComment: FormControl = new FormControl('');
  projectList: any = [];
  searchText: any;
  myControl = new FormControl();
  selectedtype: any[] = [];
  selectedpriority: any[] = [];
  selectedUserIds: number[] = [];
  page: number = 1;
  pagesize: number = 50;
  totalRecords: number = 0;
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

  subtasks: any[] = [];
  newSubtask: any = {
    name: '',
    description: '',
    dueDate: '',
    assignedTo: null
  };
  candidateList: any[] = [];
  showSubtasks: boolean = false;
  subtasksList: any[] = [];

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
    this.getProjectList();
    this.getUserAllList();
    this.editor = new Editor();
    this.initializeMinutesOptions();
  }

  logoutTask() {
    this.spinner.show();
    this.superService.logoutTask().subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response?.status === true) {
          this.notificationService.showSuccess('Successfully logged out from task');
          window.location.reload();
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

  getUserAllList(priorityType: string = '', type: string = '') {
    this.showLoader = true;
    const taskcount = true;
    const taskPage = 'Ongoing'
    this.projectManagerService.getUserallList(taskcount, taskPage, priorityType, type).subscribe(
      (response) => {
        if (response?.status === true) {
          this.userList = response?.data?.filter(
            (user: any) => user?.role !== 'SupplierAdmin'
          );
          this.candidateList = this.userList.slice(0, 7);
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

  ngOnDestroy(): void {
    this.editor.destroy();
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
                this.notificationService.showError(error?.message);
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

  transformData = (data: any) => {
    let commentsData: any[] = [];
    if (!data) {
      return;
    }
    Object.entries(data).forEach(([commentDate, comments]) => {
      if (Array.isArray(comments)) {
        comments.forEach(comment => {
          commentsData.push({
            commentDate,
            ...comment
          });
        });
      } else {
        commentsData.push({
          commentDate,
          comment: comments
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
    const keyword = this.searchText;

    this.superService
      .getsuperadmintasks(
        assignTo,
        "",
        sortType,
        priorityType,
        keyword,
        true
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
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
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

  pushBidStatus() {
    if (!this.bidManagerStatusComment.value) {
      this.notificationService.showError('Please enter a status comment');
      return;
    }

    const currentDate = new Date();

    this.bidCommentData.push({
      comment: this.bidManagerStatusComment.value,
      date: currentDate.toISOString(),
      bidManagerStatus: this.bidStatus,
      userId: this.loginUser?._id,
    });

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
        ],
      };
    }

    this.feasibilityService
      .updateProjectDetailsBid(payload, this.modalTask?.project?._id)
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              'Project updated successfully'
            );
            this.isEditing = false;
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
    const hasComment = this.bidCommentData.some(
      (item) => item.bidManagerStatus === this.bidStatus
    );
    const hasUnaddedComment = this.bidManagerStatusComment.value && !hasComment;
    return this.bidStatus && (hasComment || hasUnaddedComment);
  }

  openTaskModal(task: any) {
    console.log(task);
    this.modalTask = { ...task };
    this.getSubtasks(task._id);
  }

  validateTimeInput(): boolean {
    if (this.loginUser?.role === 'ProjectManager' && this.timeMinutes === null) {
      this.timeError = 'Time spent is required for Project Managers';
      return false;
    }

    this.timeError = '';
    return true;
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
    const modalElement = document.getElementById('viewAllProjects');

    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';

      document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());

      document.documentElement.style.overflow = 'auto';
      document.documentElement.style.height = 'auto';

      this.router.navigate(['/project-manager/project/bid-manager-project-details'], { queryParams: { id: projectId } });
    }, 300);
  }

  getTask() {
    this.showLoader = true;
    const params: any = {
      assignTo: this.loginUser?.id,
      myDay: true,
      page: this.page,
      limit: this.pagesize
    };

    if (this.timeMinutes !== null) {
      params.minutes = Number(this.timeMinutes).toFixed(2);
    }

    this.superService.getTaskUserwise(params).subscribe(
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

  paginate(page: number) {
    this.page = page;
    this.getTask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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

    const currentDate = new Date();

    this.commentData.push({
      comment: this.statusComment.value,
      date: currentDate.toISOString(),
      status: this.status,
      userId: this.loginUser?._id
    });

    this.statusComment.reset();
  }

  saveChanges(type?: string, contractEdit?: boolean) {
    let payload: any = {};

    if (!contractEdit) {
      if (!this.status) {
        return this.notificationService.showError('Please select a status.');
      }

      if (
        !this.statusComment.value &&
        !this.commentData.some((item) => item.status === this.status)
      ) {
        return this.notificationService.showError(
          'Please provide a comment for the selected status.'
        );
      }

      if (this.statusComment.value && this.statusDate.value) {
        this.commentData.push({
          comment: this.statusComment.value,
          date: this.statusDate.value,
          status: this.status,
          userId: this.loginUser?._id
        });
        this.statusComment.reset();
      }

      payload = {
        status: this.status || '',
        statusComment: this.commentData,
      };

      if (this.failStatusReason?.value) {
        payload['failStatusReason'] = this.failStatusReason?.value ? [this.failStatusReason.value] : [];
      }
    }

    this.feasibilityService
      .updateProjectDetails(payload, this.modalTask?.project?._id)
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              'Project updated successfully'
            );
            this.isEditing = false;
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

  statusBidChange(status: string) {
    this.bidStatus = status;
    this.bidCommentData = [];
    this.bidManagerStatusComment.reset();
  }

  onChange(paramKey: string, paramValue: any) {
    const params: any = {};

    if (paramKey === 'dueDate' && paramValue) {
      params.dueDate = `${paramValue.year}-${paramValue.month}-${paramValue.day}`;
    } else if (paramKey === 'assignTo' && paramValue) {
      const deselectedUsers = this.assignTo.filter(
        (id: string) => !paramValue.includes(id)
      );

      const newSelectedUsers = paramValue.filter(
        (id: string) => !this.assignTo.includes(id)
      );

      this.assignTo = paramValue;

      params.assignTo = this.assignTo;
    } else if (paramKey === 'pickACategory' && paramValue) {
      params.pickACategory = paramValue;
    } else if (paramKey === 'taskStatus' && paramValue) {
      params.status = paramValue;
    } else if (paramKey === 'assignProjectId' && paramValue) {
      params.project = paramValue;
    } else if (paramKey === 'completedTask') {
      params.completedTask = true;
    }

    this.updateTask(params);
  }

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

  toggleSubtasks() {
    this.showSubtasks = !this.showSubtasks;
  }

  getSubtasks(taskId: string) {
    this.showLoader = true;
    this.superService.getSubtasks(taskId).subscribe(
      (response: any) => {
        console.log('Subtasks response:', response);
        if (response?.status === true) {
          this.subtasksList = response?.data || [];
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch subtasks');
        }
        this.showLoader = false;
      },
      (error) => {
        console.error('Error fetching subtasks:', error);
        this.notificationService.showError(error?.message || 'Error fetching subtasks');
        this.showLoader = false;
      }
    );
  }

  isSubtaskValid(): boolean {
    return this.newSubtask.name && this.newSubtask.dueDate && this.newSubtask.assignedTo;
  }

  formatDate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') {
      return date;
    } else if (typeof date === 'object' && date.year && date.month && date.day) {
      return `${date.year}-${this.padZero(date.month)}-${this.padZero(date.day)}`;
    }
    const d = new Date(date);
    return `${d.getFullYear()}-${this.padZero(d.getMonth() + 1)}-${this.padZero(d.getDate())}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  addSubtask() {
    if (this.isSubtaskValid()) {
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

      this.showLoader = true;
      this.superService.addSubtask(this.modalTask._id, subtaskPayload).subscribe(
        (response: any) => {
          if (response?.success == true) {
            this.notificationService.showSuccess('Subtask added successfully');
            this.getSubtasks(this.modalTask._id);
            this.newSubtask = {
              name: '',
              description: '',
              dueDate: '',
              assignedTo: null
            };
          } else {
            this.notificationService.showError(response?.message || 'Failed to add subtask');
          }
          this.showLoader = false;
        },
        (error) => {
          this.notificationService.showError(error?.message || 'Error adding subtask');
          this.showLoader = false;
        }
      );
    } else {
      this.notificationService.showError('Please fill in all required fields');
    }
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

  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  getCandidateName(candidateId: string): string {
    const candidate = this.candidateList.find(c => c._id === candidateId);
    return candidate ? candidate.name : 'Unassigned';
  }

  getAssignedUserName(resources: any[]): string {
    if (!resources || resources.length === 0) {
      return 'Unassigned';
    }

    const candidateId = resources[0].candidateId;
    if (!candidateId) {
      return 'Unassigned';
    }

    if (typeof candidateId === 'object' && 'name' in candidateId) {
      return candidateId.name;
    }

    if (typeof candidateId === 'object' && 'userDetail' in candidateId && candidateId.userDetail) {
      return candidateId.userDetail.name || 'Unknown User';
    }

    const user = this.userList.find((u: any) => u._id === candidateId);
    return user ? (user.userName || user.name) : 'Unknown User';
  }

  isCurrentUserAssigned(resources: any[]): boolean {
    if (!resources || resources.length === 0 || !this.loginUser) {
      return false;
    }

    const candidateId = resources[0].candidateId;
    if (!candidateId) {
      return false;
    }

    if (typeof candidateId === 'object' && '_id' in candidateId) {
      return candidateId._id === this.loginUser.id;
    }

    return candidateId === this.loginUser.id;
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
}
