import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { Payload } from 'src/app/utility/shared/constant/payload.const';
import Swal from 'sweetalert2';
declare var bootstrap: any;
import { Editor, Toolbar } from 'ngx-editor';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { pagination } from 'src/app/utility/shared/constant/pagination.constant';

@Component({
  selector: 'app-todo-task-view-page',
  templateUrl: './todo-task-view-page.component.html',
  styleUrls: ['./todo-task-view-page.component.scss'],
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
export class TodoTaskViewPageComponent implements OnInit, OnDestroy {
  taskDetails: string = '';
  taskTitle: string = '';
  showLoader: boolean = false;
  taskList: any = [];
  userList: any = [];
  assignTo: any[] = [];
  assignProject: string | undefined;
  showAll = false;
  displayedUsers: any[] = [];
  dueDate: FormControl = new FormControl(null);
  categoryList: string[] = ['High', 'Medium', 'Low'];
  statusTaskList: string[] = ['Ongoing', 'Completed'];
  taskTypeList: string[] = ['Project', 'Other'];
  selectedCategory: string | undefined;
  selectedStatus: string | undefined;
  selectedTaskType: string | undefined;
  dueDateValue: NgbDate | null = null;
  selectedUserIds: number[] = [];
  projectList: any = [];
  statusComment: FormControl = new FormControl('');
  bidManagerStatusComment: FormControl = new FormControl('');
  commentData: any[] = [];
  bidCommentData: any[] = [];
  status: string = 'Expired';
  bidStatus: string = 'Expired';
  failStatusReason: FormControl = new FormControl('');
  statusDate: FormControl = new FormControl('');
  isEditing = false;
  loginUser: any;
  type: any;
  candidateList: any[] = [];
  showSubtasks: boolean = false;
  page: number = pagination.page;
  pagesize = 50;
  totalRecords: number = pagination.totalRecords;
  sourcePage: string = '/super-admin/todo-tasks'; // Default source page

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

  selectedtype: any[] = [];
  selectedpriority: any[] = [];
  selectedtasktypes: any[] = [];
  searchText: any;
  myControl = new FormControl();

  modalTask: any = {};
  selectedUsers: any = [];

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
  newComment: string = '';
  todayDate: string = new Date().toISOString().split('T')[0];

  subtasks: any[] = [];
  newSubtask: any = {
    name: '',
    description: '',
    dueDate: '',
    assignedTo: null
  };

  // Add this property to store subtasks
  subtasksList: any[] = []; // Initialize as empty array

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal,
    private projectManagerService: ProjectManagerService,
    private projectService: ProjectService,
    public router: Router,
    private route: ActivatedRoute,
    private feasibilityService: FeasibilityService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });

    // Get task ID and data from route params and state
    this.route.params.subscribe(params => {
      const taskId = params['id'];
      if (taskId) {
        // Get the task data and source page from navigation state
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state;

        if (state) {
          this.sourcePage = state['sourcePage'] || '/super-admin/todo-tasks';
          if (state['taskData']) {
            // Use the passed task data
            this.setupTaskDetails(state['taskData']);
            this.getSubtasks(taskId);
          } else {
            // Fallback to API call if no data was passed
            this.loadTaskDetails(taskId);
          }
        } else {
          // If no state, try to get from history state
          const historyState = window.history.state;
          if (historyState && historyState.taskData) {
            this.sourcePage = historyState.sourcePage || '/super-admin/todo-tasks';
            this.setupTaskDetails(historyState.taskData);
            this.getSubtasks(taskId);
          } else {
            // Fallback to API call
            this.loadTaskDetails(taskId);
          }
        }
      } else {
        // Redirect to task list page if no ID specified
        this.router.navigate([this.sourcePage]);
      }
    });

    this.getUserAllList();
    this.getProjectList();

    // Initialize the editor
    this.editor = new Editor();

    // Initialize the comment form
    this.commentForm = this.fb.group({
      description: ['', Validators.required],
      timeStart: ['', Validators.required],
      timeEnd: ['', Validators.required]
    });

    // this.getCandidateList();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  loadTaskDetails(taskId: string) {
    this.spinner.show();
    this.superService.getsuperadmintasks('', '', '', '', '', false, '', this.page, 5000)
      .subscribe(
        (response: any) => {
          if (response?.status === true) {
            // Find the task with matching ID
            this.totalRecords = response?.data?.meta_data?.items || 0;
            const task = response?.data?.data.find((t: any) => t._id === taskId);
            console.log(task);

            if (task) {
              this.setupTaskDetails(task);
              // Load subtasks after task details are loaded
              this.getSubtasks(taskId);
              this.spinner.hide();
            } else {
              this.notificationService.showError('Task not found');
              this.router.navigate([this.sourcePage]);
              this.spinner.hide();
            }
          } else {
            this.notificationService.showError(response?.message || 'Error loading task details');
            this.router.navigate([this.sourcePage]);
            this.spinner.hide();
          }
        },
        (error: any) => {
          this.notificationService.showError(error?.message || 'Error loading task details');
          this.router.navigate([this.sourcePage]);
          this.spinner.hide();
        }
      );
  }

  setupTaskDetails(task: any) {
    this.assignTo = [];
    this.selectedUsers = [];
    task?.assignTo?.map((element: any) => {
      this.assignTo.push(element?.userId);
      this.selectedUsers.push(element?.userId);
    });
    this.modalTask = { ...task }; // Deep copy to avoid direct binding

    // Set form values
    this.selectedCategory = this.modalTask.priority;
    this.selectedStatus = this.modalTask.status;
    this.selectedTaskType = this.modalTask.type;
    if (this.modalTask.dueDate) {
      this.dueDateValue = this.formatDateToNgbDate(this.modalTask.dueDate);
    }
  }

  formatDateToNgbDate(dateString: string): any {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  transformData = (data: any) => {
    let commentsData: any[] = [];
    if (!data) {
      return;
    }
    Object.entries(data).forEach(([commentDate, comments]) => {
      // Skip the pinnedComments property
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

  onDueDateChange(date: NgbDate | null) {
    if (date) {
      const formattedDate = `${date.year}-${this.padZero(date.month)}-${this.padZero(date.day)}`;
      this.dueDate.setValue(formattedDate); // ✅ Correct way to update FormControl
    } else {
      this.dueDate.setValue(null);
    }
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

  statusChange(status: string) {
    this.status = status;
    this.commentData = [];
    this.statusComment.reset();
  }

  statusBidChange(status: string) {
    this.bidStatus = status;
    this.bidCommentData = [];
    this.bidManagerStatusComment.reset();
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
          userId: this.loginUser?._id,
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
      userId: this.loginUser?._id,
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
          this.notificationService.showError(error?.message);
        }
      );
    } else {
      this.notificationService.showError('Please Enter Task Details');
    }
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

  onChangeMyday(value: any) {
    console.log(value);
    let params = {
      status: value,
    };
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

  openTaskModal(task: any) {
    this.assignTo = [];
    this.selectedUsers = [];
    task?.assignTo?.map((element: any) => {
      this.assignTo.push(element?.userId);
      this.selectedUsers.push(element?.userId);
    });
    this.modalTask = { ...task }; // Deep copy to avoid direct binding
  }

  searchtext() {

    const sortType = Array.isArray(this.selectedtype) ? this.selectedtype[0] : this.selectedtype;
    const priorityType = Array.isArray(this.selectedpriority) ? this.selectedpriority[0] : this.selectedpriority;
    const type = Array.isArray(this.selectedtasktypes) ? this.selectedtasktypes[0] : this.selectedtasktypes || '';
    const keyword = this.searchText ? this.searchText.trim() : '';  // Ensure keyword is not undefined

    console.log('Searching for:', keyword); // Debugging log

    this.superService.getsuperadmintasks(
      this.selectedUserIds.join(','),  // assignId
      'Ongoing',                       // status
      sortType,                         // sort
      priorityType,                      // pickACategory
      keyword,                          // keyword (Make sure this is passed correctly)
      undefined,                        // myDay
      type                              // type
    )
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.taskList = response?.data?.data;
          } else {
            this.notificationService.showError(response?.message);
          }

        },
        (error) => {
          this.notificationService.showError(error?.message);

        }
      );

    this.getUserAllList(priorityType, type);
  }

  getUserAllList(priorityType: string = '', type: string = '') {

    const taskcount = true;
    const taskPage = 'Ongoing'
    this.spinner.show();
    this.projectManagerService.getUserallList(taskcount, taskPage, priorityType, type).subscribe(
      (response) => {
        if (response?.status === true) {
          this.userList = response?.data?.filter(
            (user: any) => user?.role !== 'SupplierAdmin'
          );
          this.displayedUsers = this.userList.slice(0, 7);
          this.spinner.hide();
        } else {
          this.notificationService.showError(response?.message);
          this.spinner.hide();
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);

      }
    );
  }

  getTask() {

    this.spinner.show();
    return this.superService
      .getsuperadmintasks(this.selectedUserIds.join(','), 'Ongoing')
      .subscribe(
        (response) => {
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

            this.spinner.hide();
          } else {
            this.notificationService.showError(response?.message);
            this.spinner.hide();
          }
        },
        (error) => {
          this.notificationService.showError(error?.message);

        }
      );
  }

  deleteTask(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete this task?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {

        this.projectService.deleteTask(id).subscribe(
          (response: any) => {
            if (response?.status == true) {

              this.notificationService.showSuccess('Task successfully deleted');
              this.router.navigate([this.sourcePage]);
            } else {

              this.notificationService.showError(response?.message);
            }
          },
          (error) => {

            this.notificationService.showError(error?.message);
          }
        );
      }
    });
  }

  deleteComment(id: any) {
    let param = {
      commentId: id,
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

        this.projectService.deleteComment(param, this.modalTask._id).subscribe(
          (response: any) => {
            if (response?.status === true) {

              this.notificationService.showSuccess('Comment successfully deleted');
              this.loadTaskDetails(this.modalTask._id);
            } else {

              this.notificationService.showError(response?.message);
            }
          },
          (error) => {

            this.notificationService.showError(error?.message);
          }
        );
      }
    });
  }

  deleteComments(id: any, task: any) {
    let param = {
      commentId: id,
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

        this.projectService.deleteComment(param, task._id).subscribe(
          (response: any) => {
            if (response?.status === true) {

              this.notificationService.showSuccess(
                'Comment successfully deleted'
              );
              window.location.reload();
            } else {

              this.notificationService.showError(response?.message);
            }
          },
          (error) => {

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

      this.spinner.show();
      this.superService
        .updateComment(payload, comment._id, this.modalTask._id)
        .subscribe(
          (response) => {
            if (response?.status == true) {
              this.notificationService.showSuccess(
                'Comment Updated Successfully'
              );
              this.getTask();
              comment.comment = comment.updatedComment; // Update UI
              comment.isEditing = false; // Exit edit mode
              this.spinner.hide();
            } else {
              this.notificationService.showError(
                response?.message || 'Comment cannot be updated after 24 hours'
              );
              this.spinner.hide();
            }
          },
          (error) => {
            this.notificationService.showError(
              error?.message || 'Comment cannot be updated after 24 hours'
            );
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

  addComment(id: string) {
    if (this.commentForm.valid) {
      const comment = this.commentForm.get('description')?.value;
      const timeStart = this.commentForm.get('timeStart')?.value;
      const timeEnd = this.commentForm.get('timeEnd')?.value;

      if (comment?.trim().length > 0) {
        const payload = {
          comment: comment.trim(),
          timeStart: timeStart,
          timeEnd: timeEnd,
          date: this.todayDate
        };

        this.spinner.show();
        this.superService.addComments(payload, id).subscribe(
          (response) => {
            this.spinner.hide();
            if (response?.status === true) {
              this.notificationService.showSuccess('Comment added successfully');
              this.commentForm.reset();
              // Reload the task details
              this.loadTaskDetails(id);
              this.spinner.hide();
            } else {
              this.spinner.hide();
              this.notificationService.showError(
                response?.message || 'Failed to add comment'
              );
            }
          },
          (error) => {
            this.notificationService.showError(
              error?.error?.message || 'An error occurred'
            );
            this.spinner.hide();
          }
        );
      } else {
        this.spinner.hide();
        this.notificationService.showError('Comment cannot be empty');
      }
    } else {
      this.spinner.hide();
      this.notificationService.showError('Please fill in all required fields');
    }
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

  togglePinComment(comment: any, task: any) {
    if (!comment?.commentId || !task?._id) {
      this.notificationService.showError('Missing required data for pinning comment');
      return;
    }

    const payload = {
      pin: !comment.pinnedAt
    };
    this.spinner.show();
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
                  this.spinner.hide();
                }
                window.location.reload();

              },
              (error) => {
                this.notificationService.showError(error?.message);
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

  // Navigate back to the previous page
  goBack() {
    this.router.navigate([this.sourcePage]);
  }

  isSubtaskValid(): boolean {
    return this.newSubtask.name && this.newSubtask.dueDate && this.newSubtask.assignedTo;
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


      this.spinner.show();
      this.superService.addSubtask(this.modalTask._id, subtaskPayload).subscribe(
        (response: any) => {
          this.spinner.hide();
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

  getCandidateList() {

    this.superService.getCandidateList().subscribe(
      (response: any) => {
        if (response?.status) {
          this.candidateList = response.data || [];
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch candidates');
        }

      },
      (error) => {
        this.notificationService.showError(error?.message || 'Error fetching candidates');

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

  logoutTask() {
    this.spinner.show();
    this.superService.logoutTask().subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response?.status === true) {
          this.notificationService.showSuccess('Successfully logged out from task');
          this.router.navigate([this.sourcePage]);
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

}
