import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Editor, Toolbar } from 'ngx-editor';
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
  selector: 'app-todo-tasks',
  templateUrl: './todo-tasks.component.html',
  styleUrls: ['./todo-tasks.component.scss'],
  providers: [NgbActiveModal], // Add here
})
export class TodoTasksComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
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
  page: number = pagination.page;
  pagesize = 50;
  totalRecords: number = pagination.totalRecords;

  // Editor related properties
  editor!: Editor;
  taskForm!: FormGroup;
  @ViewChild('taskModal') taskModal!: ElementRef;

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
    private projectManagerService: ProjectManagerService,
    private projectService: ProjectService,
    private router: Router,
    private feasibilityService: FeasibilityService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    // Initialize editor
    this.editor = new Editor();

    // Initialize task form
    this.taskForm = this.fb.group({
      description: ['', Validators.required]
    });


    this.myControl.valueChanges.subscribe((res: any) => {
      let storeTest = res;
      this.searchText = res.toLowerCase();
    });
    this.getTask();
    this.getUserAllList();
    this.getProjectList();
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

  paginate(page: number) {
    this.page = page;
    this.getTask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // Function to transform the data
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
        this.notificationService.showError(error?.error?.message || error?.message);

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
    // Simply navigate to the project details page
    this.router.navigate(['/super-admin/tracker-wise-project-details'], { queryParams: { id: projectId } });
  }

  addTask() {
    if (this.taskTitle.trim() && this.taskForm.valid) {
      const description = this.taskForm.get('description')?.value;

      const payload = {
        discription: description,
        task: this.taskTitle,
        status: 'Ongoing',
        dueDate: this.dueDate.value,
        assignTo: this.assignTo,
        type: this.type
      };

      this.superService.createTask(payload).subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess('Task Created Successfully');
            // Reset form
            this.taskForm.reset();
            this.taskTitle = '';
            // Close modal
            const modalElement = document.getElementById('exampleModal');
            if (modalElement) {
              const modal = bootstrap.Modal.getInstance(modalElement);
              if (modal) modal.hide();
            }
            // Reload the page after modal is closed
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
      this.notificationService.showError('Please enter a task title and description');
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

  searchtext() {

    const sortType = Array.isArray(this.selectedtype) ? this.selectedtype[0] : this.selectedtype;
    const priorityType = Array.isArray(this.selectedpriority) ? this.selectedpriority[0] : this.selectedpriority;
    const type = Array.isArray(this.selectedtasktypes) ? this.selectedtasktypes[0] : this.selectedtasktypes || '';
    const keyword = this.searchText ? this.searchText.trim() : '';  // Ensure keyword is not undefined

    console.log('Searching for:', keyword); // Debugging log
    this.spinner.show();
    this.superService.getsuperadmintasks(
      this.selectedUserIds.join(','),  // assignId
      'Ongoing',                       // status
      sortType,                         // sort
      priorityType,                     // pickACategory
      keyword,                          // keyword (Make sure this is passed correctly)
      undefined,                        // myDay
      type,
      this.page,
      this.pagesize                            // type
    )
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.totalRecords = response?.data?.meta_data?.items || 0;
            this.taskList = response?.data?.data;
          } else {
            this.notificationService.showError(response?.message);
          }

          this.spinner.hide();
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || error?.message);

          this.spinner.hide();
        }
      );

    this.getUserAllList(priorityType, type);
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
          this.displayedUsers = this.userList.slice(0, 7);

        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);

      }
    );
  }

  getTask() {

    this.spinner.show();
    return this.superService
      .getsuperadmintasks(this.selectedUserIds.join(','), 'Ongoing', '', '', '', false, '', this.page, this.pagesize)
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.totalRecords = response?.data?.meta_data?.items || 0;
            console.log("this.totalRecords", this.totalRecords)
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


          } else {
            this.notificationService.showError(response?.message);

          }
          this.spinner.hide();
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || error?.message);

          this.spinner.hide();
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

        this.projectService.deleteTask(id).subscribe(
          (response: any) => {
            if (response?.status == true) {

              this.notificationService.showSuccess('Task successfully deleted');
              window.location.reload();
              this.getTask();
            } else {

              this.notificationService.showError(response?.message);
            }
          },
          (error) => {

            this.notificationService.showError(error?.error?.message || error?.message);
          }
        );
      }
    });
  }

  deleteComment(id: any) {
    let param = {
      commentId: id,
    };
    debugger
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

              this.notificationService.showSuccess(
                'Comment successfully deleted'
              );
              window.location.reload();
            } else {

              this.notificationService.showError(response?.message);
            }
          },
          (error) => {

            this.notificationService.showError(error?.error?.message || error?.message);
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
            } else {
              this.notificationService.showError(
                response?.message || 'Comment cannot be updated after 24 hours'
              );
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

  newComment: string = '';

  addComment(comment: string, id: string) {
    if (comment?.trim().length > 0) {

      const payload = { comment: comment.trim() };

      this.superService.addComments(payload, id).subscribe(
        (response) => {

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

          this.notificationService.showError(
            error?.message || 'An error occurred'
          );
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

    this.superService.updateCommentPin(task._id, comment.commentId, payload).subscribe(
      (response: any) => {
        if (response?.status) {
          this.notificationService.showSuccess(comment.pinnedAt ? 'Comment unpinned successfully' : 'Comment pinned successfully');
          // Update the comment's pinned status
          comment.pinnedAt = comment.pinnedAt ? null : new Date().toISOString();

          // Store current scroll position
          const currentScrollPosition = window.pageYOffset;

          // Refresh the task list
          this.spinner.show();
          this.superService.getsuperadmintasks(this.selectedUserIds.join(','), 'Ongoing', '', '', '', false, '', this.page, this.pagesize)
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
                  // Restore scroll position after data is loaded
                  window.scrollTo(0, currentScrollPosition);
                } else {
                  this.notificationService.showError(response?.message);
                }
                this.spinner.hide();
              },
              (error) => {
                this.notificationService.showError(error?.error?.message || error?.message);

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

  // Navigate to task detail page instead of opening modal
  navigateToTaskDetail(task: any) {
    if (task && task._id) {
      this.router.navigate(['/super-admin/todo-task-view-page', task._id], {
        state: {
          taskData: task,
          sourcePage: '/super-admin/todo-tasks'
        }
      });
    } else {
      this.notificationService.showError('Task ID not found');
    }
  }

}
