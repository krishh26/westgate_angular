import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { Toolbar } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-task-details-bid-manager-wise',
  templateUrl: './task-details-bid-manager-wise.component.html',
  styleUrls: ['./task-details-bid-manager-wise.component.scss'],
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
export class TaskDetailsBidManagerWiseComponent implements OnInit, OnDestroy {
  projectId: string = '';
  projectDetails: any = {};
  tasks: any[] = [];
  loading: boolean = false;

  // Modal and task related properties
  modalTask: any = {};
  newComment: string = '';
  loginUser: any;
  timeMinutes: number | null = null;
  minutesOptions: { value: number; label: string }[] = [];
  timeError: string = '';

  // Editor properties
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

  // Subtasks properties
  subtasks: any[] = [];
  newSubtask: any = {
    name: '',
    description: '',
    dueDate: '',
    assignedTo: null
  };
  subtasksList: any[] = [];
  showSubtasks: boolean = false;
  userList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private projectManagerService: ProjectManagerService,
    private superService: SuperadminService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.loadProjectDetails();
        this.loadTasks();
      }
    });

    this.loginUser = this.localStorageService.getLogger();
    this.editor = new Editor();
    this.initializeMinutesOptions();
    this.loadUserList();
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  loadProjectDetails(): void {
    this.spinner.show();
    this.projectService.getProjectDetailsById(this.projectId).subscribe({
      next: (response: any) => {
        this.projectDetails = response.data || response;
        this.spinner.hide();
      },
      error: (error: any) => {
        console.error('Error loading project details:', error);
        this.toastr.error('Error loading project details');
        this.spinner.hide();
      }
    });
  }

  loadTasks(): void {
    this.loading = true;

    // Call the API to get tasks for this project
    // This will make a request to /task/list?project={projectId}
    this.superService.getTask('', this.projectId).subscribe({
      next: (response: any) => {
        console.log('API Response:', response); // Debug log

        if (response?.status === true && response?.data) {
          // Check if data is an array before calling map
          if (Array.isArray(response.data)) {
            this.tasks = response.data.map((task: any) => ({
              id: task._id || task.id,
              title: task.task || task.title,
              description: task.discription || task.description,
              status: task.status || 'Pending',
              assignedTo: task.assignTo?.name || task.assignedTo || 'Unassigned',
              dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
              priority: task.priority || 'Medium',
              project: task.project,
              datewiseComments: task.datewiseComments || {}
            }));
          } else if (response.data && typeof response.data === 'object') {
            // If data is an object, try to extract tasks from it
            const dataKeys = Object.keys(response.data);
            if (dataKeys.length > 0) {
              // Check if any key contains an array of tasks
              for (const key of dataKeys) {
                if (Array.isArray(response.data[key])) {
                  this.tasks = response.data[key].map((task: any) => ({
                    id: task._id || task.id,
                    title: task.task || task.title,
                    description: task.discription || task.description,
                    status: task.status || 'Pending',
                    assignedTo: task.assignTo?.name || task.assignedTo || 'Unassigned',
                    dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
                    priority: task.priority || 'Medium',
                    project: task.project,
                    datewiseComments: task.datewiseComments || {}
                  }));
                  break;
                }
              }
            }
          }

          // If no tasks were found, set empty array
          if (!this.tasks || this.tasks.length === 0) {
            this.tasks = [];
            this.toastr.info('No tasks found for this project');
          }
        } else {
          this.tasks = [];
          if (response?.message) {
            this.toastr.warning(response.message);
          } else {
            this.toastr.info('No tasks found for this project');
          }
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading tasks:', error);
        this.toastr.error('Error loading tasks');
        this.loading = false;
        // Fallback to sample data if API fails
        this.loadSampleTasks();
      }
    });
  }

  // Fallback method with sample data if API fails
  private loadSampleTasks(): void {
    this.tasks = [
      {
        id: 1,
        title: 'Review Project Requirements',
        description: 'Analyze project requirements and create feasibility report',
        status: 'In Progress',
        assignedTo: 'John Doe',
        dueDate: new Date('2024-02-15'),
        priority: 'High'
      },
      {
        id: 2,
        title: 'Supplier Evaluation',
        description: 'Evaluate potential suppliers and create shortlist',
        status: 'Pending',
        assignedTo: 'Jane Smith',
        dueDate: new Date('2024-02-20'),
        priority: 'Medium'
      },
      {
        id: 3,
        title: 'Document Review',
        description: 'Review all project documents for completeness',
        status: 'Completed',
        assignedTo: 'Mike Johnson',
        dueDate: new Date('2024-02-10'),
        priority: 'Low'
      }
    ];
  }

  goBack(): void {
    this.router.navigate(['/project-manager/project/bid-manager-project-details'], { queryParams: { id: this.projectId } });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge bg-success';
      case 'in progress':
        return 'badge bg-primary';
      case 'pending':
        return 'badge bg-warning';
      case 'overdue':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'badge bg-danger';
      case 'medium':
        return 'badge bg-warning';
      case 'low':
        return 'badge bg-success';
      default:
        return 'badge bg-secondary';
    }
  }

  // Modal related methods
  openTaskDetailsModal(task: any): void {
    this.modalTask = task;
    this.loadSubtasksForTask(task.id);
    this.loadCommentsForTask(task.id);

    // Show the modal using Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('taskDetailsModal')!);
    modal.show();
  }

  // Subtasks methods
  toggleSubtasks(): void {
    this.showSubtasks = !this.showSubtasks;
  }

  addSubtask(): void {
    if (this.isSubtaskValid()) {
      const subtask = {
        id: Date.now(),
        name: this.newSubtask.name,
        description: this.newSubtask.description,
        dueDate: this.newSubtask.dueDate,
        assignedTo: this.newSubtask.assignedTo,
        status: 'Pending'
      };

      this.subtasks.push(subtask);

      // Reset form
      this.newSubtask = {
        name: '',
        description: '',
        dueDate: '',
        assignedTo: null
      };

      this.toastr.success('Subtask added successfully');
    }
  }

  isSubtaskValid(): boolean {
    return this.newSubtask.name && this.newSubtask.description && this.newSubtask.dueDate;
  }

  loadSubtasksForTask(taskId: number): void {
    // Mock data - replace with actual API call
    this.subtasks = [
      {
        id: 1,
        name: 'Research Requirements',
        description: 'Gather detailed project requirements',
        dueDate: new Date('2024-02-12'),
        assignedTo: { userName: 'John Doe' },
        status: 'In Progress'
      },
      {
        id: 2,
        name: 'Create Timeline',
        description: 'Develop project timeline',
        dueDate: new Date('2024-02-14'),
        assignedTo: { userName: 'Jane Smith' },
        status: 'Pending'
      }
    ];

    this.subtasksList = this.subtasks.map(st => ({
      ...st,
      title: st.name,
      resources: [{ candidateId: { name: st.assignedTo?.userName || 'Unassigned' } }],
      isExpanded: false
    }));
  }

  // Comments methods
  addComment(comment: string, taskId: string): void {
    if (!comment || comment.trim() === '') {
      this.toastr.error('Please enter a comment');
      return;
    }

    if (this.loginUser?.role === 'ProjectManager' && !this.timeMinutes) {
      this.timeError = 'Time is required for Project Managers';
      return;
    }

    // Mock comment addition - replace with actual API call
    const newComment = {
      commentId: Date.now(),
      comment: comment,
      userDetail: {
        name: this.loginUser?.name || 'User',
        role: this.loginUser?.role || 'User'
      },
      date: new Date(),
      timeStart: new Date(),
      timeEnd: new Date()
    };

    // Add to modalTask comments
    if (!this.modalTask.datewiseComments) {
      this.modalTask.datewiseComments = {};
    }

    const today = new Date().toISOString().split('T')[0];
    if (!this.modalTask.datewiseComments[today]) {
      this.modalTask.datewiseComments[today] = [];
    }

    this.modalTask.datewiseComments[today].push(newComment);

    this.newComment = '';
    this.timeMinutes = null;
    this.timeError = '';

    this.toastr.success('Comment added successfully');
  }

  loadCommentsForTask(taskId: number): void {
    // Mock data - replace with actual API call
    this.modalTask.datewiseComments = {
      '2024-02-10': [
        {
          commentId: 1,
          comment: 'Initial project review completed',
          userDetail: { name: 'John Doe', role: 'ProjectManager' },
          date: '2024-02-10',
          timeStart: '09:00',
          timeEnd: '10:00'
        }
      ],
      '2024-02-11': [
        {
          commentId: 2,
          comment: 'Requirements analysis in progress',
          userDetail: { name: 'Jane Smith', role: 'Analyst' },
          date: '2024-02-11',
          timeStart: '14:00',
          timeEnd: '16:00'
        }
      ]
    };
  }

  // Utility methods
  onChangeMyday(type: string): void {
    // Mock implementation - replace with actual API call
    this.toastr.success('Task added to My Day');
  }

  onChange(type: string, value: boolean): void {
    if (type === 'completedTask') {
      this.modalTask.status = 'Completed';
      this.toastr.success('Task marked as completed');

      // Update the task in the main list
      const taskIndex = this.tasks.findIndex(t => t.id === this.modalTask.id);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].status = 'Completed';
      }
    }
  }

  togglePinComment(comment: any, task: any): void {
    // Mock implementation - replace with actual API call
    if (comment.pinnedAt) {
      comment.pinnedAt = null;
      this.toastr.success('Comment unpinned');
    } else {
      comment.pinnedAt = new Date();
      this.toastr.success('Comment pinned');
    }
  }

  navigateToProjectDetails(projectId: string): void {
    // Navigate to project details
    this.router.navigate(['/project-manager/project/bid-manager-project-details'], { queryParams: { id: projectId } });
  }

  formatDateForDisplay(date: string | Date): string {
    if (!date) return 'No date';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB');
  }

  transformData(data: any): any[] {
    let commentsData: any[] = [];
    if (!data) {
      return [];
    }
    Object.entries(data).forEach(([commentDate, comments]) => {
      if (Array.isArray(comments)) {
        comments.forEach((comment: any) => {
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
  }

  initializeMinutesOptions(): void {
    this.minutesOptions = [];

    // Minutes (0-59)
    for (let i = 0; i < 60; i++) {
      this.minutesOptions.push({
        value: i,
        label: `${i} min`
      });
    }

    // Hours (1-12)
    for (let i = 1; i <= 12; i++) {
      this.minutesOptions.push({
        value: i * 60,
        label: `${i} hour${i > 1 ? 's' : ''}`
      });
    }
  }

  loadUserList(): void {
    // Mock user list - replace with actual API call
    this.userList = [
      { _id: '1', userName: 'John Doe' },
      { _id: '2', userName: 'Jane Smith' },
      { _id: '3', userName: 'Mike Johnson' }
    ];
  }

  isTaskOverdue(dueDate: Date): boolean {
    return dueDate < new Date();
  }

  getCompletedTasksCount(): number {
    return this.tasks.filter(t => t.status === 'Completed').length;
  }

  getPendingTasksCount(): number {
    return this.tasks.filter(t => t.status === 'Pending').length;
  }

  getInProgressTasksCount(): number {
    return this.tasks.filter(t => t.status === 'In Progress').length;
  }
}
