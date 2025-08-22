import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SummaryService } from 'src/app/services/summary/summary.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { ProjectCoordinatorService } from 'src/app/services/project-coordinator/project-coordinator.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-tracker-wise-project-details',
  templateUrl: './tracker-wise-project-details.component.html',
  styleUrls: ['./tracker-wise-project-details.component.scss'],
})
export class TrackerWiseProjectDetailsComponent {
  @ViewChild('downloadLink') private downloadLink!: ElementRef;

  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
  selectViewImage: any;
  clientDocument: any[] = [];
  westGetDocument: any[] = [];
  loginDetailDocument: any[] = [];
  subContractDocument: any;
  economicalPartnershipQueryFile: any;
  economicalPartnershipResponceFile: any;
  viewClientDocumentForm: boolean = true;
  viewLoginForm: boolean = true;
  documentName: string = '';
  loginName: string = '';
  isEditing = false;
  status: string = '';
  FeasibilityOtherDocuments: any = [];
  password = 'password';
  showPassword = false;
  summaryquestionList: any = [];
  isEditMode: boolean = false;
  currentSummaryId: number | null = null;
  loginUser: any;
  uploadedDocument: any;
  failStatusImage: any;
  showSuccess: boolean = false;
  userDetail: any;
  selectedSuppliers: { [key: string]: { company: string; startDate: any } } =
    {};
  myForm: FormGroup | undefined;
  selectedSupplier: any;
  summaryQuestionList: any;
  supportDocument!: FormGroup;
  projectStage!: FormGroup;
  casestudylist: any = [];
  statusDate: FormControl = new FormControl('');
  failStatusReason: FormControl = new FormControl('');
  commentData: any[] = [];
  comment: string = '';
  media_Obj: any = [];
  selectedThumbnailImage!: string;
  selectedImage!: string;
  uploadType: boolean = true;
  getReasonList: any = [];
  getDroppedAfterReasonList: any = [];
  documentUploadType: any = {
    subContractDocument: 'SubContract',
    economicalPartnershipQuery: 'economicalPartnershipQuery',
    economicalPartnershipResponse: 'economicalPartnershipResponse',
    clientDocument: 'clientDocument',
    loginDetailDocument: 'loginDetailDocument',
    otherQueryDocument: 'otherQueryDocument',
    otherDocument: 'otherDocument',
    failStatusImage: 'failStatusImage',
  };
  ForTitleuserList: any = [
    'FeasibilityAdmin',
    'FeasibilityUser',
    'ProjectManager',
    'ProcessManagerAdmin',
    'SupplierAdmin',
  ];
  dueDate: any;
  displayForTitleedUsers: any = [];
  assignTo: any;
  loginModalMode: boolean = true;
  projectStrips: any = [];
  userList: any = [];
  // For check bov
  subContracting: boolean = true;
  eligibilityForm: FormGroup;
  commentName: string = '';
  filteredTasks: any = [];
  showSupplierList = false;
  selectedSupplierIds: string[] = [];
  filteredComments: any[] = [];
  viewReasonList: any = [];
  allSuppliers: any[] = [];
  selectedSuppliersList: any[] = [];
  supplierSelectionReason: string = '';
  newModalReason: string = '';
  private modalRef: any;
  currentViewingSupplierId: string = '';
  logsList: any = [];
  activeLogType: string = ''; // To track which button is active

  loginDetailControl = {
    companyName: new FormControl('', Validators.required),
    link: new FormControl('', Validators.required),
    loginID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  };

  addStripcontrol = {
    text: new FormControl('', Validators.required),
    imageText: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  };

  eligibility = {
    caseStudyRequired: new FormControl('', Validators.required),
    certifications: new FormControl('', Validators.required),
    policy: new FormControl('', Validators.required),
  };

  summary = {
    questionName: new FormControl('', Validators.required),
    question: new FormControl('', Validators.required),
    instructions: new FormControl('', Validators.required),
    weightage: new FormControl('', Validators.required),
    //comment: new FormControl("", Validators.required),
    refrenceDocument: new FormControl('', Validators.required),
    projectId: new FormControl('', Validators.required),
    summaryQuestionFor: new FormControl('', Validators.required),
    // deadline: new FormControl("", Validators.required),
  };
  summaryForm: FormGroup;
  loginDetailForm: FormGroup = new FormGroup(this.loginDetailControl);
  addStripForm: FormGroup = new FormGroup(this.addStripcontrol);
  imageFields = [{ text: '', file: null }];
  failStatusReasons: { tag: string; comment: string }[] = [];
  droppedStatusReasons: { tag: string; comment: string }[] = [];
  selectedFailReason: string = '';
  selectedDroppedAfterFeasibilityReason: string = '';
  feasibilityCommentData: any[] = [];
  bidStatus: string = '';
  bidManagerStatusComment: FormControl = new FormControl('');
  feasibilityStatus: string = 'Expired';
  bidCommentData: any[] = [];
  selectedUserIds: number[] = [];
  showAllLogs: boolean = false;
  logs: any = [];
  FeasibilityuserList: any = [];
  BiduserList: any = [];
  feasibilityStatusComment: FormControl = new FormControl('');
  // Editor related properties
  feasibilityEditor: Editor = new Editor();
  bidStatusEditor: Editor = new Editor();

  // Editor related properties
  editor: Editor = new Editor();
  taskForm!: FormGroup;
  @ViewChild('taskModal') taskModal!: ElementRef;

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
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private feasibilityService: FeasibilityService,
    private sanitizer: DomSanitizer,
    private summaryService: SummaryService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private projectManagerService: ProjectManagerService,
    private projectCoordinatorService: ProjectCoordinatorService,
    private spinner: NgxSpinnerService,
    private superadminService: SuperadminService,
    private location: Location,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id'];
    });
    this.myForm = this.fb.group({
      skills: this.fb.array([]),
    });
    this.loginUser = this.localStorageService.getLogger();
    this.summaryForm = new FormGroup(this.summary);
    this.eligibilityForm = new FormGroup(this.eligibility);
    this.summaryForm.controls['projectId'].setValue(this.projectId);
  }

  bidStatusDisable : boolean = true;

  ngOnInit(): void {
    this.getProjectDetails();
    // this.getSummaryList();
    this.getUserDetails();
    this.initializeForm();
    this.addDocument();
    this.getProjectStrips();
    this.getUserAllList();
    this.getTask();
    this.getProjectLogs();
    // this.getForTitleUserAllList();
    this.addStripForm = this.fb.group({
      type: ['', Validators.required],
      text: [''],
      description: [''], // Ensure this is included
      imageText: [''],
      roles: [''],
    });

    // Make sure all editors are properly initialized
    this.editor = new Editor();
    this.feasibilityEditor = new Editor();
    this.bidStatusEditor = new Editor();

    this.bidManagerStatusComment.valueChanges?.subscribe((value) => {
      if(value && this.status && value !== "<p></p>") {
        this.bidStatusDisable = false;
      }
    })
  }

  ngOnDestroy() {
    if (this.feasibilityEditor) {
      this.feasibilityEditor.destroy();
    }
    if (this.bidStatusEditor) {
      this.bidStatusEditor.destroy();
    }
    if (this.editor) {
      this.editor.destroy();
    }
  }

  goBack() {
    this.location.back();
  }
  editProjectDetails(projectId: any) {
    this.router.navigate(['/super-admin/super-admin-add-project'], {
      queryParams: { id: projectId },
    });
  }


  submitSelectedSuppliers() {
    if (!this.selectedSupplierIds || this.selectedSupplierIds.length === 0) {
      this.notificationService.showError('Please select at least one supplier.');
      return;
    }
    // The modal will be shown automatically by Bootstrap's data-bs-toggle
  }

     saveSupplierSelection() {
     if (!this.supplierSelectionReason?.trim()) {
       this.notificationService.showError('Please enter a reason for selecting these suppliers.');
       return;
     }

     // Close the current modal
     const supplierModal = document.getElementById('supplierModal');
     if (supplierModal) {
       const modalInstance = bootstrap.Modal.getInstance(supplierModal);
       if (modalInstance) {
         modalInstance.hide();
       }
     }

     // Open the mail send clarification modal
     setTimeout(() => {
       const mailModal = document.getElementById('supplierMailModal');
       if (mailModal) {
         const modalInstance = new bootstrap.Modal(mailModal);
         modalInstance.show();
       }
     }, 500);
   }

        // Handler for new reason mail send response
   handleMailSendResponse(isMailSend: boolean) {
     // Check if we're coming from the view all comments modal
     const supplier = this.selectedSuppliersList.find(
       (item) => item._id === this.currentViewingSupplierId
     );

     if (supplier && supplier.inputValue) {
       // Create dropUser payload with mail send flag
       const dropUserPayload = {
         dropUser: {
           userId: supplier._id,
           reason: supplier.inputValue,
           isMailSend: isMailSend
         },
       };

       // Call the dropUser API
       this.projectManagerService.dropUser(dropUserPayload, this.projectId).subscribe(
         (response) => {
           if (response?.status == true) {
             this.notificationService.showSuccess('Reason added successfully');

             // Update the filtered comments list
             this.filteredComments.push({
               comment: supplier.inputValue,
               date: new Date()
             });

             // Clear the temporary data
             this.newModalReason = '';
             supplier.inputValue = '';

             // Refresh the page
             window.location.reload();
           } else {
             this.notificationService.showError('Error saving reason');
           }
         },
         (error) => {
           this.notificationService.showError(error?.message || 'Error occurred while saving reason');
         }
       );
     }
   }

   // Handler for supplier selection mail send response
   handleSupplierMailSendResponse(isMailSend: boolean) {
     const payload = {
       userIds: this.selectedSupplierIds,
       projectId: this.projectId,
       isMailSend: isMailSend
     };

     // First call projectSortList API
     this.projectService.projectSortList(payload).subscribe(
       (response) => {
         if (response?.status == true) {
           // Then call dropUser API for each selected supplier
           let completedCalls = 0;
           const totalCalls = this.selectedSupplierIds.length;

           this.selectedSupplierIds.forEach(supplierId => {
             const dropUserPayload = {
               dropUser: {
                 userId: supplierId,
                 reason: this.supplierSelectionReason,
                 isMailSend: isMailSend
               },
             };

             this.projectManagerService.dropUser(dropUserPayload, this.projectId).subscribe(
               (dropResponse) => {
                 completedCalls++;
                 if (dropResponse?.status == true) {
                   if (completedCalls === totalCalls) {
                     this.notificationService.showSuccess('Supplier selection and reason saved successfully');
                     // Reset the form
                     this.supplierSelectionReason = '';
                     this.selectedSupplierIds = [];
                     // Reload the page instead of just refreshing data
                     window.location.reload();
                   }
                 } else {
                   this.notificationService.showError('Error saving supplier reason');
                 }
               },
               (error) => {
                 this.notificationService.showError(error?.message || 'Error occurred while saving reason');
               }
             );
           });
         } else {
           this.notificationService.showError('Try after some time.');
         }
       },
       (error) => {
         this.notificationService.showError(error?.message || 'Error occurred.');
       }
     );
  }

  deleteProject(id: any) {
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
        this.projectService.deleteProject(id).subscribe(
          (response: any) => {
            if (response?.status == true) {

              this.notificationService.showSuccess(
                'Project successfully deleted'
              );
              this.router.navigate(['/super-admin/status-wise-tracker']);
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

  deleteDocuments(name: string, type: string) {
    // Format the document type for display
    let displayType = type;
    if (type === 'clientDocument') {
      displayType = 'Client Document';
    } else if (type === 'westGetDocument') {
      displayType = 'Westgate Document';
    } else {
      // Convert camelCase to Title Case with spaces
      displayType = type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${displayType}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;

        const payload = { name, type }; // Only sending name & type

        this.projectService.deleteDocument(this.projectId, payload).subscribe(
          (response: any) => {

            if (response?.status === true) {
              this.notificationService.showSuccess(`${displayType} successfully deleted`);
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

  removeShortlistSupplier(supplier: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove ${supplier.name} from shortlist?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove!',
    }).then((result: any) => {
      if (result?.value) {
        this.showLoader = true;
        this.superadminService.removeFromShortlist(supplier._id, this.projectId).subscribe(
          (response: any) => {

            if (response?.status === true) {
              this.notificationService.showSuccess(`${supplier.name} successfully removed from shortlist`);
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

  getProjectLogs() {
    this.showLoader = true;
    this.projectService.getProjectLogs(this.projectId).subscribe(
      (response) => {
        if (response?.status === true) {
          this.logs = response?.data;
          this.logsList = response?.data; // Initialize logsList with the default logs
        } else {
          this.notificationService.showError(response?.message);
        }
        this.showLoader = false;
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  getTask() {
    this.showLoader = true;
    const projectIdToMatch = this.projectId; // Replace with the actual project ID to match

    this.superadminService.getTask(this.selectedUserIds.join(',')).subscribe(
      (response) => {
        if (response?.status === true) {
          // Filter tasks based on project ID
          this.filteredTasks = response.data.data.filter(
            (task: any) => task.project && task.project._id === projectIdToMatch
          );

        } else {
          this.filteredTasks = []; // No records found
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.filteredTasks = []; // No records found
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  getUserAllList() {
    this.showLoader = true;
    this.projectManagerService.getUserAllList().subscribe(
      (response) => {
        if (response?.status === true) {
          this.FeasibilityuserList = response?.data?.filter(
            (user: any) =>
              user?.role === 'FeasibilityAdmin' ||
              user?.role === 'FeasibilityUser'
          );
          this.BiduserList = response?.data?.filter(
            (user: any) => user?.role === 'ProjectManager'
          );
          this.selectedSupplier = response?.data?.filter(
            (user: any) => user?.role === 'SupplierAdmin'
          );

        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  assignUser() {
    if (!this.assignTo) {
      this.notificationService.showError('Please select assign to user');
      return;
    }

    // Directly use dueDate (since it's already a string from input type="date")
    const formattedDueDate = this.dueDate ? this.dueDate : null;

    const payload = {
      task: this.projectDetails?.projectName,
      assignTo: [`${this.assignTo}`],
      project: this.projectId,
      dueDate: formattedDueDate,
    };

    console.log('this is data', payload);

    this.superadminService.createTask(payload).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('User assigned successfully');
          this.getProjectDetails();
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
      }
    );
  }

  initializeForm() {
    this.supportDocument = this.fb.group({
      document: this.fb.array([]),
    });

    this.projectStage = this.fb.group({
      stage: this.fb.array([]),
    });
  }

  removeOtherDocument(document: any): void {
    // Remove the document from the FeasibilityOtherDocuments array
    const index = this.FeasibilityOtherDocuments.indexOf(document);
    if (index > -1) {
      this.FeasibilityOtherDocuments.splice(index, 1); // Remove the document from the array
      this.notificationService.showSuccess('Document removed successfully.');
    }
  }

  openLoginDetail() {
    this.loginModalMode = false;
    this.loginDetailForm.reset();
  }

  editLoginDetail(loginData: any, i: number) {
    this.loginModalMode = false;
    this.loginDetailForm.patchValue(loginData.data);
    this.loginDetailForm.controls['id'].setValue(i);
  }

  pushFeasibilityStatus() {
    if (!this.feasibilityStatusComment.value) {
      this.notificationService.showError('Please enter a status comment');
      return;
    }

    const currentDate = new Date();
    let newComment = '';

    // Handle different types of editor output
    if (typeof this.feasibilityStatusComment.value === 'string') {
      newComment = this.feasibilityStatusComment.value.trim();
    } else if (this.feasibilityStatusComment.value && typeof this.feasibilityStatusComment.value === 'object') {
      // Handle ProseMirror document structure
      if (this.feasibilityStatusComment.value.type === 'doc') {
        // Convert the ProseMirror document to HTML
        const content = this.feasibilityStatusComment.value.content || [];
        newComment = content
          .map((block: any) => {
            if (block.type === 'paragraph' && block.content) {
              return block.content
                .map((node: any) => {
                  if (node.type === 'text') {
                    let text = node.text;
                    // Handle marks (formatting)
                    if (node.marks) {
                      node.marks.forEach((mark: any) => {
                        switch (mark.type) {
                          case 'bold':
                            text = `<strong>${text}</strong>`;
                            break;
                          case 'italic':
                            text = `<em>${text}</em>`;
                            break;
                          case 'underline':
                            text = `<u>${text}</u>`;
                            break;
                          case 'strike':
                            text = `<s>${text}</s>`;
                            break;
                        }
                      });
                    }
                    return text;
                  }
                  return '';
                })
                .join('');
            }
            return '';
          })
          .join('<br>');
      } else if (this.feasibilityStatusComment.value.html) {
        newComment = this.feasibilityStatusComment.value.html;
      } else if (this.feasibilityStatusComment.value.text) {
        newComment = this.feasibilityStatusComment.value.text;
      }
    }

    // Ensure feasibilityCommentData is initialized
    if (!this.feasibilityCommentData) {
      this.feasibilityCommentData = [];
    }

    // Debugging: Log current data
    console.log('Existing Comments:', this.feasibilityCommentData);
    console.log('New Comment:', newComment);

    // Check if the same comment with the same status already exists
    const isDuplicate = this.feasibilityCommentData.some(
      (comment) =>
        comment.comment === newComment &&
        comment.status === this.feasibilityStatus
    );

    if (!isDuplicate) {
      this.feasibilityCommentData = [
        ...this.feasibilityCommentData,
        {
          comment: newComment,
          date: currentDate.toISOString(),
          status: this.feasibilityStatus,
          userId: this.loginUser?._id,
        },
      ];
      console.log('New Comment Added:', this.feasibilityCommentData);
    } else {
      console.log('Duplicate comment detected. Skipping push.');
    }

    this.feasibilityStatusComment.reset();
  }

  pushStatus() {
    if (!this.bidManagerStatusComment.value) {
      this.notificationService.showError('Please enter a status comment');
      return;
    }
    const currentDate = new Date();
    const isDuplicate = this.commentData.some(
      (comment) =>
        comment.comment === this.bidManagerStatusComment.value &&
        comment.bidManagerStatus === this.status
    );
    if (!isDuplicate) {
      this.commentData.push({
        comment: this.bidManagerStatusComment.value,
        date: currentDate.toISOString(),
        bidManagerStatus: this.status,
        userId: this.loginUser?._id,
      });
    }
    this.bidManagerStatusComment.reset();
  }

  // Method to add a new fail reason
  addFailReason() {
    if (!this.selectedFailReason) {
      this.notificationService.showError('Please select a fail reason.');
      return;
    }

    // Add the reason with an empty comment
    this.failStatusReasons.push({
      tag: this.selectedFailReason,
      comment: '',
    });

    // Reset the dropdown selection
    this.selectedFailReason = '';
  }

  adddroppedReason() {
    if (!this.selectedDroppedAfterFeasibilityReason) {
      this.notificationService.showError('Please select a Dropped reason.');
      return;
    }

    // Add the reason with an empty comment
    this.droppedStatusReasons.push({
      tag: this.selectedDroppedAfterFeasibilityReason,
      comment: '',
    });
    console.log(
      this.droppedStatusReasons,
      this.selectedDroppedAfterFeasibilityReason
    );

    // Reset the dropdown selection
    this.selectedDroppedAfterFeasibilityReason = '';
  }

  getForTitleUserAllList() {
    this.showLoader = true;
    this.projectManagerService.getUserAllList().subscribe(
      (response) => {
        if (response?.status === true) {
          // Filter only roles of FeasibilityAdmin and FeasibilityUser
          this.ForTitleuserList = response?.data?.filter(
            (user: any) =>
              user?.role === 'SupplierAdmin' || user?.role === 'FeasibilityUser'
          );
          this.displayForTitleedUsers = this.userList.slice(0, 7);

        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  getUserDetails() {
    this.allSuppliers = [];

    this.projectManagerService.getUserList('SupplierAdmin').subscribe(
      (response) => {
        if (response?.status == true) {

          this.userDetail = response?.data;
          // this.allSuppliers = response?.data;
          // Hide the inactive supplier
          this.allSuppliers = response?.data?.filter((element: any) => element?.active);

          this.selectedSuppliers = this.userDetail.reduce(
            (acc: any, supplier: any) => {
              acc[supplier._id] = { company: '', startDate: null };
              return acc;
            },
            {}
          );
        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  dropUser(details: any) {
    console.log('this is testing data', details);
    if (!details?.inputValue) {
      return this.notificationService.showError('Please enter reason');
    }

    const data = {
      dropUser: {
        userId: details?._id,
        reason: details?.inputValue,
      },
    };

    this.projectManagerService.dropUser(data, this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {
          this.notificationService.showSuccess(
            response?.message || 'Drop user successfully'
          );
          // this.getUserDetails();
          window.location.reload();
        } else {
          return this.notificationService.showError('Try after some time.');
        }
      },
      (error) => {
        this.notificationService.showError(error?.message || 'Error.');
      }
    );
  }

  getSummaryList() {
    this.projectService.getSummaryQuestionList(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {

          this.summaryquestionList = response?.data;
        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

     selectSupplier(supplier: any) {
     console.log(supplier);

     // Store the supplier temporarily
     this.selectedSupplier = supplier;

     // Open the mail send clarification modal
     setTimeout(() => {
       const mailModal = document.getElementById('shortlistMailModal');
       if (mailModal) {
         const modalInstance = new bootstrap.Modal(mailModal);
         modalInstance.show();
       }
     }, 500);
   }

   handleSelectMailSendResponse(isMailSend: boolean) {
     if (!this.selectedSupplier) return;

     const data = {
       userId: this.selectedSupplier._id,
       projectId: this.projectId,
       isSelected: true,
       isMailSend: isMailSend
     };

     this.superadminService.selectFromSortlist(data).subscribe(
       (response) => {
         if (response?.status == true) {
           this.notificationService.showSuccess(response?.message);
           this.getProjectDetails();
         } else {
           console.error('Error selecting supplier:');
         }
       },
       (error) => {
         this.notificationService.showError(error?.error?.message);
         this.showLoader = false;
       }
     );
  }

  deSelectSupplier(supplier: any) {
    console.log(supplier);

    const data = {
      userId: supplier._id,
      projectId: this.projectId,
      isSelected: false
    };

    this.superadminService.selectFromSortlist(data).subscribe({
      next: (response: any) => {
        // Handle success response
        this.toastr.success('Supplier selected successfully');
        // Refresh the project details to get updated data
        this.getProjectDetails();
      },
      error: (error: any) => {
        // Handle error
        this.toastr.error('Failed to select supplier');
        console.error('Error selecting supplier:', error);
      }
    });
  }


  submitForm() {
    this.summaryForm.markAllAsTouched();
    if (this.summaryForm.invalid) {
      return this.notificationService.showError(
        'Please Fill All Summary Details.'
      );
    }

    this.showLoader = true;
    if (this.isEditMode && this.currentSummaryId !== null) {
      // Update existing summary
      this.summaryService
        .updateSummaryDetail(
          this.currentSummaryId.toString(),
          this.summaryForm.value
        )
        .subscribe({
          next: (response) => {
            if (response?.status === true) {

              this.getSummaryList();
              this.resetForm();
            } else {
              this.notificationService.showError(response?.message);

            }
          },
          error: (error) => {
            this.notificationService.showError(error?.error?.message || error?.message);

          },
        });
    } else {
      // Add new summary
      this.summaryService.addSummary(this.summaryForm.value).subscribe({
        next: (response) => {
          if (response?.status === true) {

            this.getSummaryList();
            this.resetForm();
          } else {
            this.notificationService.showError(response?.message);

          }
        },
        error: (error) => {
          this.notificationService.showError(error?.error?.message || error?.message);

        },
      });
    }
  }

  resetForm() {
    this.summaryForm.reset();
    this.summaryForm.controls['projectId'].setValue(this.projectId);
    this.isEditMode = false;
    this.currentSummaryId = null;
  }

  getSummaryQuestion() {
    this.showLoader = true;
    this.projectService.getSummaryQuestionList(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {

          this.summaryQuestionList = response?.data;
        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  questionDetails(details: any) {
    localStorage.setItem('ViewQuestionForCoordinator', JSON.stringify(details));
    this.router.navigate(['bid-submission/bid-question-details'], {
      queryParams: { id: details?._id },
    });
  }

  editSummary(summary: any) {
    this.isEditMode = true;
    this.currentSummaryId = summary;
    console.log(this.currentSummaryId);

    this.summaryForm.patchValue({
      summaryQuestionFor: summary.summaryQuestionFor,
      questionName: summary.questionName,
      question: summary.question,
      refrenceDocument: summary.refrenceDocument,
      weightage: summary.weightage,
      instructions: summary.instructions,
    });
  }

  deleteSummary(summaryId?: string) {
    this.summaryService.deleteSummary(summaryId).subscribe(
      (response) => {
        if (response?.status == true) {
          this.getSummaryList();
          this.notificationService.showSuccess(
            'question delete successfully !'
          );
        } else {
          this.notificationService.showError(response?.message || 'Error');
        }
      },
      (error) => {
        this.notificationService.showError(
          error?.message || 'Something went wrong !'
        );
      }
    );
  }

  detailPage() {
    this.router.navigate(['/feasibility-user/minimum-eligibility-form'], {
      queryParams: { id: this.projectId },
    });
  }

  public showHidePass(): void {
    if (this.password === 'password') {
      this.password = 'text';
      this.showPassword = true;
    } else {
      this.password = 'password';
      this.showPassword = false;
    }
  }

  deleteComment(item: any, id: any) {
    let param = {
      commentId: id,
      statusComment: {
        comment: item?.comment,
        date: item?.date,
        status: item?.status,
        userId: item?.userDetails?._id,
        userDetails: {
          _id: item?.userDetails?._id,
          name: item?.userDetails?.name,
          email: item?.userDetails?.email,
          role: item?.userDetails?.role,
          companyName: item?.userDetails?.companyName,
        },
      },
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
        this.projectService
          .deleteFeasiblityBidComment(param, this.projectId)
          .subscribe(
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

  deleteBidComment(item: any, id: any) {
    let param = {
      commentId: id,
      bidManagerStatusComment: {
        comment: item?.comment,
        date: item?.date,
        bidManagerStatus: item?.bidManagerStatus,
        userId: item?.userDetails?._id,
        userDetails: {
          _id: item?.userDetails?._id,
          name: item?.userDetails?.name,
          email: item?.userDetails?.email,
          role: item?.userDetails?.role,
          companyName: item?.userDetails?.companyName,
        },
      },
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
        this.projectService.deleteBidComment(param, this.projectId).subscribe(
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

  deleteFailedReasons(reason: any, id: any) {
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

        // Prepare the request payload
        const param = {
          failStatusReason: {
            tag: reason?.tag,
            comment: reason?.comment,
            userId: reason?.userId,
            date: reason?.date,
            userDetails: {
              _id: reason?.userDetails?._id,
              name: reason?.userDetails?.name,
              email: reason?.userDetails?.email,
              role: reason?.userDetails?.role,
              companyName: reason?.userDetails?.companyName,
            },
          },
        };

        this.projectService.deleteFailedReason(param, this.projectId).subscribe(
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

  deleteDroppedReasons(reason: any, id: any) {
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

        // Prepare the request payload
        const param = {
          droppedAfterFeasibilityStatusReason: {
            tag: reason?.tag,
            comment: reason?.comment,
            userId: reason?.userId,
            date: reason?.date,
            userDetails: {
              _id: reason?.userDetails?._id,
              name: reason?.userDetails?.name,
              email: reason?.userDetails?.email,
              role: reason?.userDetails?.role,
              companyName: reason?.userDetails?.companyName,
            },
          },
        };

        this.projectService
          .deletedroppedReason(param, this.projectId)
          .subscribe(
            (response: any) => {

              if (response?.status === true) {
                this.notificationService.showSuccess(
                  'Reason successfully deleted'
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

  deleteStrips(id: any) {
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
        this.projectService.deleteStrip(id).subscribe(
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

  statusFeasibilityChange(status: string) {
    this.feasibilityStatus = status;
    this.feasibilityCommentData = [];
    this.feasibilityStatusComment.reset();
  }

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {

          this.projectDetails = response?.data;
          this.selectedSuppliersList = response?.data?.sortlistedUsers || [];
          this.casestudylist = response?.data?.casestudy;
          this.feasibilityStatus = this.projectDetails?.status;
          this.status = this.projectDetails?.bidManagerStatus;
          this.getReasonList = this.projectDetails?.failStatusReason;
          this.getDroppedAfterReasonList =
            this.projectDetails?.droppedAfterFeasibilityStatusReason;
          this.commentData = this.projectDetails?.bidManagerStatusComment;
          this.feasibilityCommentData =
            this.projectDetails?.statusComment || [];
          this.bidCommentData =
            this.projectDetails?.bidManagerStatusComment || [];
          this.FeasibilityOtherDocuments =
            this.projectDetails?.FeasibilityOtherDocuments || null;
          this.viewReasonList = this.projectDetails?.dropUser; // Store the dropUser list
          console.log(this.viewReasonList); // Logs the dropUser list for debugging
          this.failStatusImage = this.projectDetails?.failStatusImage || null;
        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  statusChange(status: string) {
    this.status = status;
    this.commentData = [];
    this.bidManagerStatusComment.reset();
  }

  // Function for subcontract
  subContactChange(value: string) {
    if (value == 'true') {
      this.subContracting = true;
    } else {
      this.subContracting = false;
    }
  }

  openDocument(data: any) {
    this.selectedDocument = data;
  }

  openViewImage(image: any) {
    console.log('Image data full structure:', JSON.stringify(image, null, 2));
    this.selectViewImage = image;

    // Check all possible locations where the URL might be stored
    if (this.selectViewImage) {
      // First check direct URL
      if (!this.selectViewImage.url) {
        // Check if URL is in file.url
        if (this.selectViewImage.file?.url) {
          this.selectViewImage.url = this.selectViewImage.file.url;
          console.log('URL found in file.url:', this.selectViewImage.url);
        }
        // Check if URL is in key
        else if (this.selectViewImage.key) {
          this.selectViewImage.url = this.selectViewImage.key;
          console.log('URL set from key:', this.selectViewImage.url);
        }
      } else {
        console.log('URL found directly:', this.selectViewImage.url);
      }
    }
    console.log('Final selectViewImage:', this.selectViewImage);
  }

  // Add a method to get a raw string URL for PDFs
  getPdfUrl(url: string): string {
    return url ? url : '';
  }

  isImage(url: string): boolean {
    if (!url) return false;

    // If the URL is from AWS S3 or similar cloud storage, it might not have a file extension
    // Check for common image content-type indicators in the URL
    const containsImageKeywords = url.toLowerCase().includes('image') ||
      url.toLowerCase().includes('picture') ||
      url.toLowerCase().includes('photo');

    // Check for common image extensions. Strip any query parameters first
    const baseUrl = url.split('?')[0];
    const hasImageExtension =
      baseUrl.toLowerCase().endsWith('.jpg') ||
      baseUrl.toLowerCase().endsWith('.jpeg') ||
      baseUrl.toLowerCase().endsWith('.png') ||
      baseUrl.toLowerCase().endsWith('.gif') ||
      baseUrl.toLowerCase().endsWith('.webp') ||
      baseUrl.toLowerCase().endsWith('.bmp') ||
      baseUrl.toLowerCase().endsWith('.svg');

    // If either condition is true, consider it an image
    return hasImageExtension || containsImageKeywords;
  }

  getDocumentViewerUrl(url: string): SafeResourceUrl {
    if (!url) {
      console.error('Empty URL passed to getDocumentViewerUrl');
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    try {
      // For MS Office documents, use the Office Online viewer
      if (this.isWordOrExcel(url)) {
        const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          url
        )}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(officeUrl);
      }

      // For all other document types, sanitize the URL directly
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } catch (error) {
      console.error('Error in getDocumentViewerUrl:', error);
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
  }

  download(imageUrl: string, fileName: string): void {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName); // You can customize the filename here
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  }

  summaryDetail(type: string) {
    // if (!this.projectDetails?.clientDocument.length) {
    //   return this.notificationService.showError('Upload Client Document');
    // }
    this.saveChanges(type);
    // No navigation needed - this will be handled in saveChanges
  }

  uploadDocument(event: any, type: string): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const data = new FormData();
      data.append('files', file);

      this.spinner.show();

      this.feasibilityService.uploadDocument(data).subscribe(
        (response) => {
          this.spinner.hide();

          if (response?.status) {
            // Sub-contract document
            if (type == this.documentUploadType.subContractDocument) {
              this.subContractDocument = response?.data;
            }

            // Economical partnership query document
            if (type == this.documentUploadType.economicalPartnershipQuery) {
              this.economicalPartnershipQueryFile = response?.data;
            }

            // Other query document
            if (
              type == this.documentUploadType.otherQueryDocument ||
              type == this.documentUploadType.otherDocument
            ) {
              let objToBePushed = {
                name: this.loginName,
                type: type,
                file: response?.data,
              };
              this.FeasibilityOtherDocuments.push(objToBePushed);
              this.loginName = '';
            }

            if (type == this.documentUploadType.failStatusImage) {
              this.failStatusImage = response?.data;
            }

            // Economical partnership response document
            if (type == this.documentUploadType.economicalPartnershipResponse) {
              this.economicalPartnershipResponceFile = response?.data;
            }

            //client document
            if (type == this.documentUploadType.clientDocument) {
              if (!this.documentName) {
                return this.notificationService.showError(
                  'Enter a client document Name'
                );
              }
              this.clientDocument = response?.data;
              let objToBePushed = {
                name: this.documentName,
                file: response?.data,
              };
              this.projectDetails.clientDocument.push(objToBePushed);
              this.documentName = '';
            }

            if (type == this.documentUploadType.westGetDocument) {
              if (!this.documentName) {
                return this.notificationService.showError(
                  'Enter a westgate document Name'
                );
              }
              this.westGetDocument = response?.data;
              let objToBePushed = {
                name: this.documentName,
                file: response?.data,
              };
              this.projectDetails.westGetDocument.push(objToBePushed);
              this.documentName = '';
            }

            if (type == this.documentUploadType.loginDetailDocument) {
              if (!this.loginName) {
                return this.notificationService.showError('Enter Name');
              }
              this.loginDetailDocument = response?.data;
              let objToBePushed = {
                name: this.loginName,
                file: response?.data,
              };
              this.projectDetails.loginDetail.push(objToBePushed);
              this.loginName = '';
            }

            // Call summaryDetail directly after successful upload
            this.summaryDetail('save');

            return this.notificationService.showSuccess(response?.message);
          } else {
            return this.notificationService.showError(response?.message);
          }
        },
        (error) => {
          // Hide the spinner in case of an error as well
          this.spinner.hide();
          return this.notificationService.showError(
            error?.message || 'Error while uploading'
          );
        }
      );
    }
  }

  hideShowForm() {
    this.viewClientDocumentForm = !this.viewClientDocumentForm;
  }

  viewLoginDetail(loginData: any) {
    this.loginDetailForm.patchValue(loginData);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges(type?: string, contractEdit?: boolean) {
    let payload: any = {};
    if (!contractEdit) {
      if (this.feasibilityStatusComment.value && this.statusDate.value) {
        this.feasibilityCommentData.push({
          comment: this.feasibilityStatusComment.value,
          date: this.statusDate.value,
          status: this.status,
          userId: this.loginUser?._id,
        });
      }

      if (this.bidManagerStatusComment.value && this.statusDate.value) {
        this.commentData.push({
          comment: this.bidManagerStatusComment.value,
          date: this.statusDate.value,
          bidManagerStatus: this.status,
          userId: this.loginUser?._id,
        });
      }

      payload = {
        projectType: this.projectDetails.projectType,
        // subContracting: this.subContracting || '',
        comment: this.comment || '',
        clientDocument: this.projectDetails?.clientDocument || [],
        westGetDocument: this.projectDetails?.westGetDocument || [],
      };

      // Only include status fields if this is not just a document upload
      if (type !== 'save') {
        payload.status = this.feasibilityStatus || '';
        payload.statusComment = this.feasibilityCommentData;
        payload.bidManagerStatus = this.status || '';
        payload.bidManagerStatusComment = this.bidCommentData;
        payload.failStatusImage = this.failStatusImage || '';
      }

      if (this.failStatusReason?.value) {
        payload['failStatusReason'] = [this.failStatusReason?.value];
      }
    }

    this.feasibilityService
      .updateProjectDetails(payload, this.projectDetails._id)
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              'Project updated successfully'
            );
            this.isEditing = false;
            this.getProjectDetails();
            if (type == 'save') {
              // Reload the current page instead of navigating to the list
              window.location.reload();
            }
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

  isPdf(url: string): boolean {
    return url?.endsWith('.pdf') || false;
  }

  isWordOrExcel(url: string): boolean {
    return (
      url?.endsWith('.doc') ||
      url?.endsWith('.docx') ||
      url?.endsWith('.xls') ||
      url?.endsWith('.xlsx') ||
      false
    );
  }

  uploadDocuments(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const data = new FormData();
      data.append('files', file);
      this.spinner.show();

      this.feasibilityService.uploadDocument(data).subscribe(
        (response) => {
          this.spinner.hide();
          if (response?.status) {
            if (!this.commentName) {
              return this.notificationService.showError(
                'Enter a client document name'
              );
            }

            // Add the uploaded file and comment to projectComment array
            let objToBePushed = {
              comment: this.commentName,
              file: response?.data,
            };
            this.projectDetails.projectComment.push(objToBePushed);
            this.commentName = ''; // Clear the comment input
            this.notificationService.showSuccess(response?.message);
          } else {
            this.notificationService.showError(response?.message);
          }
        },
        (error) => {
          this.spinner.hide();
          this.notificationService.showError(
            error?.message || 'Error while uploading'
          );
        }
      );
    }
  }

  applyProject() {
    const payload = {
      userId: this.loginUser.id,
      projectId: this.projectId,
    };
    this.projectService.projectApply(payload).subscribe(
      (response) => {
        if (response?.status) {
          this.notificationService.showSuccess(response?.message);
        } else {
          return this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        return this.notificationService.showError(
          error?.message || 'Something went wrong !'
        );
      }
    );
  }

  // Function to be used for showing uploaded document
  openUploadedDocument(data: any) {
    this.uploadedDocument = data;
  }

  submitEligibility() {
    if (!this.eligibilityForm.valid) {
      return this.notificationService.showError('Please Fill Form.');
    }
  }

  submitEligibilityForm() {
    if (!this.eligibilityForm.valid) {
      return this.notificationService.showError('Please Fill Form.');
    }
    this.feasibilityService
      .updateProjectDetails(this.eligibilityForm.value, this.projectId)
      .subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess('Project update successfully');
        },
        error: (err: any) => {
          return this.notificationService.showError('Something went wrong');
        },
      });
  }

  get document(): FormArray {
    return this.supportDocument?.get('document') as FormArray;
  }

  get stage(): FormArray {
    return this.projectStage?.get('stage') as FormArray;
  }

  newDocument(): FormGroup {
    return this.fb.group({
      key: '',
      url: '',
    });
  }

  newStage(): FormGroup {
    return this.fb.group({
      text: '',
      startDate: '',
      endDate: '',
    });
  }

  addDocument() {
    this.document?.push(this.newDocument());
  }

  addStage() {
    this.stage?.push(this.newStage());
  }

  removeDocument(i: number) {
    this.document.removeAt(i);
  }

  removeStage(i: number) {
    this.stage.removeAt(i);
  }

  updateProject() {
    const data = {
      supportingDocs: this.supportDocument.value?.document,
      stages: this.projectStage.value?.stage,
    };
    this.projectCoordinatorService
      .updateProject(data, this.projectId)
      .subscribe(
        (response) => {
          if (response?.status == true) {
            this.getProjectDetails();
            this.notificationService.showSuccess(
              '',
              'Project Update Successfully.'
            );
          } else {
            this.notificationService.showError(response?.message);

          }
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || error?.message);

        }
      );
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.addStripForm.patchValue({
        image: file,
      });
      this.addStripForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result; // For preview
      };
      reader.readAsDataURL(file);
    }
  }

  selectUploadType(isText: boolean): void {
    this.uploadType = isText;
    if (isText) {
      this.addStripForm.get('text')?.setValidators(Validators.required);
      this.addStripForm.get('imageText')?.clearValidators();
      this.addStripForm.get('image')?.clearValidators();
    } else {
      this.addStripForm.get('text')?.clearValidators();
      this.addStripForm.get('imageText')?.setValidators(Validators.required);
      this.addStripForm.get('image')?.setValidators(Validators.required);
    }
    this.addStripForm.get('text')?.updateValueAndValidity();
    this.addStripForm.get('imageText')?.updateValueAndValidity();
    this.addStripForm.get('image')?.updateValueAndValidity();
  }

  addStrips() {
    // Retrieve form values
    const formValues = this.addStripForm.value;
    // Construct the params object
    const params: any = {
      type: formValues.type, // Required
      projectId: this.projectDetails?._id, // Hardcoded project ID
    };
    // Conditionally add optional fields if present
    if (formValues.text && formValues.type === 'Text') {
      params.text = formValues.text;
    }
    if (formValues.description && formValues.type === 'Text') {
      params.description = formValues.description;
    }
    if (formValues.imageText && formValues.type === 'Image') {
      params.text = formValues.imageText; // Assuming description maps to image text
    }
    params.roles = [...(formValues.roles || []), 'ProcessManagerAdmin'];
    // Log params to the console
    console.log('Params to be sent:', params);
    this.projectService.createStrip(params).subscribe(
      (response: any) => {
        if (response?.status == true) {
          this.getProjectDetails();
          this.notificationService.showSuccess('', 'Project Update Successfully.');
          window.location.reload();
        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error: any) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }
  getProjectStrips() {
    this.projectService.getprojectStrips(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {

          this.projectStrips = response?.data?.data;

        } else {
          this.notificationService.showError(response?.message);

        }
      },
      (error) => {
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  addField() {
    this.imageFields.push({ text: '', file: null });
  }

  // Remove a field
  removeField(index: number) {
    if (this.imageFields.length > 1) {
      this.imageFields.splice(index, 1);
    }
  }

  // Handle file input change
  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.imageFields[index].file = file;
  }

  // Save fields and close modal
  saveFields(modalId: number) {
    this.spinner.show();
    const allFilesUploaded = this.imageFields.every((field) => !!field.file);
    if (!allFilesUploaded) {
      this.spinner.hide();
      this.notificationService.showError('Please upload all files');
      return;
    }
    // this.imageFields = [{ text: '', file: null }];
    let uploadedImages: any = {};
    const formData = new FormData();
    for (const field of this.imageFields) {
      if (field.file) {
        formData.append('files', field.file);
      }
    }

    this.feasibilityService.uploadDocument(formData).subscribe(
      (response) => {
        if (response?.status) {
          this.saveImageDetails(response.data, modalId.toString());
        } else {
          this.spinner.hide();
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(
          error?.message || 'Error while uploading'
        );
      }
    );
  }

  saveImageDetails(data: any, id: string) {
    const dataArray = Array.isArray(data) ? data : [data];
    const mergerdata = dataArray.map((response: any, index: number) => {
      const field = this.imageFields[index];
      return {
        imageText: field.text,
        key: response.key,
        url: response.url,
        fileName: response.fileName,
      };
    });

    const payload = {
      images: mergerdata,
      projectId: this.projectId,
    };
    this.superadminService.updateProjectDetails(payload, id).subscribe(
      (response) => {
        this.spinner.hide();
        if (response?.status) {
          this.notificationService.showSuccess('images add succesfully');
          this.imageFields = [{ text: '', file: null }];
          // Refresh the project strips data to show the newly added images
          this.getProjectStrips();
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError(
          error?.message || 'Error while uploading'
        );
      }
    );
  }

  // Method to remove a fail reason
  removeFailReason(index: number) {
    this.failStatusReasons.splice(index, 1);
  }

  // Method to remove a fail reason
  removeDroppedReason(index: number) {
    this.droppedStatusReasons.splice(index, 1);
  }

  saveFeasibilityStatus(type?: string, contractEdit?: boolean) {
    let payload: any = {};

    if (!contractEdit) {
      if (!this.feasibilityStatus) {
        return this.notificationService.showError('Please select a status.');
      }

      // Check if the status has at least one comment
      if (this.feasibilityStatus !== 'Fail') {
        const hasExistingComment = this.feasibilityCommentData.some(
          (item) => item.status === this.feasibilityStatus
        );

        // Only show error if there's no existing comment and no new comment
        if (!hasExistingComment && !this.feasibilityStatusComment.value && !this.feasibilityCommentData.length) {
          return this.notificationService.showError(
            'Please provide a feasibility comment for the selected status.'
          );
        }
      } else {
        const errors = this.failStatusReasons
          .map((item, index) =>
            item.comment.trim() === ''
              ? `Error at index ${index}: Comment is empty.`
              : null
          )
          .filter((error) => error !== null);

        if (errors.length > 0) {
          return this.notificationService.showError(
            'Please provide comments for the selected Reason.'
          );
        }
      }

      // Merge comments and remove duplicates by comment and status
      const allComments = [
        ...this.feasibilityCommentData,
        ...(this.projectDetails?.statusComment || []),
      ];

      const uniqueComments = allComments.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.comment === value.comment && t.status === value.status
          )
      );

      // **Sort comments by date (latest first)**
      const sortedComments = uniqueComments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      payload = {
        projectType: this.projectDetails.projectType,
        clientDocument: this.projectDetails?.clientDocument || [],
        status: this.feasibilityStatus || '',
        statusComment: sortedComments, // Use sorted comments array
        failStatusReason: this.failStatusReasons,
      };

      // Add fail reason if applicable
      if (this.failStatusReason?.value) {
        payload['failStatusReason'] = [this.failStatusReason?.value];
      }
    }

    // API call to update project details
    this.feasibilityService
      .updateProjectDetails(payload, this.projectDetails._id)
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              'Project updated successfully'
            );
            this.isEditing = false;
            this.getProjectDetails();
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

  saveBidStatus(type?: string, contractEdit?: boolean) {
    let payload: any = {};

    if (!contractEdit) {
      if (!this.status) {
        return this.notificationService.showError('Please select a status.');
      }

      // Check if the status has at least one comment
      const hasExistingComment = this.commentData.some(
        (item) => item.bidManagerStatus === this.status
      );

      // Only show error if there's no existing comment, no new comment, and no dropped reasons
      if (!hasExistingComment && !this.bidManagerStatusComment.value &&
        !this.commentData.length && !this.droppedStatusReasons.length) {
        return this.notificationService.showError(
          'Please provide a bid comment for the selected status.'
        );
      }

      // Merge existing and new comments, removing duplicates
      const existingComments =
        this.projectDetails?.bidManagerStatusComment || [];
      const newComments = [...this.commentData];

      let uniqueComments: any[] = [];
      if (this.droppedStatusReasons.length > 0) {
        uniqueComments = Array.from(
          new Map(
            [...newComments].map((item) => [
              item.commentId || item.comment,
              item,
            ])
          ).values()
        );
      } else {
        uniqueComments = Array.from(
          new Map(
            [...existingComments, ...newComments].map((item) => [
              item.commentId || item.comment,
              item,
            ])
          ).values()
        );
      }

      // **Sort comments in descending order (latest first)**
      uniqueComments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      payload = {
        bidManagerStatus: this.status || '',
        // bidManagerStatusComment: uniqueComments, // Now sorted in descending order
      };

      if (this.droppedStatusReasons.length == 0) {
        payload['bidManagerStatusComment'] = uniqueComments;
      }

      // If status is 'Dropped after feasibility', include fail reasons
      if (
        this.status === 'Dropped after feasibility' &&
        this.droppedStatusReasons.length > 0
      ) {
        payload.droppedAfterFeasibilityStatusReason =
          this.droppedStatusReasons.map((reason) => ({
            tag: reason.tag,
            comment: reason.comment || '', // Ensure an empty comment if none is provided
          }));
      }
    }

    // API call to update project details
    this.feasibilityService
      .updateProjectDetailsBid(payload, this.projectDetails._id)
      .subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess(
              'Project updated successfully'
            );
            this.isEditing = false;
            this.getProjectDetails(); // Refresh project details after save
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

  isCommentValid(): boolean {
    if (!this.feasibilityStatus) return false;

    // Check if at least one comment exists for the selected status
    const hasComment = this.feasibilityCommentData.some(
      (item) => item.status === this.feasibilityStatus
    );

    if (this.feasibilityStatus === 'Fail') {
      return (
        this.failStatusReasons.length > 0 &&
        this.failStatusReasons.every((reason) => reason.comment.trim() !== '')
      );
    }

    return hasComment;
  }

  isBidCommentValid(): boolean {
    // Validate if a comment exists for the selected status or is added
    const hasComment = this.commentData.some(
      (item) => item.bidManagerStatus === this.status
    );
    const hasUnaddedComment = this.bidManagerStatusComment.value && !hasComment;
    return this.status && (hasComment || hasUnaddedComment);
  }

  removeReadonly(event: Event) {
    (event.target as HTMLInputElement).removeAttribute('readonly');
  }

  toggleSupplierList() {
    this.showSupplierList = !this.showSupplierList;
  }

  viewAllComments(userId: string) {
    // Check if the userId is passed correctly
    console.log('Selected User ID:', userId);

    // Store the current user ID for use in addReasonFromModal
    this.currentViewingSupplierId = userId;

    // Find the user in the dropUser list based on userId
    const supplier = this.viewReasonList.find(
      (item: any) => item.userId === userId
    );

    if (supplier) {
      // Assign the reasons for this supplier to filteredComments
      this.filteredComments = supplier.reason;
      console.log('Filtered Comments:', this.filteredComments); // Log the filtered comments to verify
    } else {
      console.log('Supplier not found');
      this.filteredComments = []; // In case no supplier is found
    }
  }

        addReasonFromModal() {
     if (!this.newModalReason?.trim()) return;

     // Get the selected supplier (we need to save the ID from viewAllComments)
     const supplier = this.selectedSuppliersList.find(
       (item) => item._id === this.currentViewingSupplierId
     );

     if (supplier) {
       // Store the data temporarily
       supplier.inputValue = this.newModalReason;

       // Close the current modal
       const viewReasonModal = document.getElementById('viewReasonList');
       if (viewReasonModal) {
         const modalInstance = bootstrap.Modal.getInstance(viewReasonModal);
         if (modalInstance) {
           modalInstance.hide();
         }
       }

       // Open the mail send clarification modal
       setTimeout(() => {
         const mailModal = document.getElementById('newReasonMailModal');
         if (mailModal) {
           const modalInstance = new bootstrap.Modal(mailModal);
           modalInstance.show();
         }
       }, 500);
     }
   }

  isSupplierSelected(supplierId: string): boolean {
    return this.projectDetails?.selectedUserIds?.some((user: any) => user._id === supplierId && user.isSelected);
  }

  getLatestReason(supplierId: string): any {
    // Find the supplier in the viewReasonList
    const supplier = this.viewReasonList.find(
      (item: any) => item.userId === supplierId
    );

    if (supplier?.reason?.length) {
      // Sort reasons by date (newest first) and return the first one
      return [...supplier.reason].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })[0];
    }

    return null;
  }

  loadLogs(logType: string) {
    this.activeLogType = logType;
    this.showLoader = true;
    this.projectService.getProjectLogs(this.projectId, logType).subscribe(
      (response) => {
        if (response?.status === true) {
          this.logsList = response?.data;
        } else {
          this.logsList = [];
          this.notificationService.showError(response?.message);
        }
        this.showLoader = false;
      },
      (error) => {
        this.logsList = [];
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  updateAttendee(supplier: any) {
    if (!supplier) {
      return this.notificationService.showError('Invalid supplier');
    }

    if (!supplier.comment) {
      return this.notificationService.showError('Please enter a comment before marking as attended');
    }

    const payload = {
      projectId: this.projectId,
      supplierId: supplier._id,
      attendee: !supplier.attendee,
      comment: supplier.comment
    };

    this.superadminService.updateAttendee(payload).subscribe(
      (response) => {
        if (response?.status) {
          this.notificationService.showSuccess('Successfully updated attendance status');
          this.getProjectDetails(); // Refresh the project details
        } else {
          this.notificationService.showError(response?.message || 'Failed to update attendance status');
        }
      },
      (error) => {
        this.notificationService.showError(error?.message || 'Something went wrong');
      }
    );
  }

  removeInterestedSupplier(supplier: any) {
    if (!supplier) {
      return this.notificationService.showError('Invalid supplier');
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to remove ${supplier.companyName} from interested suppliers?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove!'
    }).then((result) => {
      if (result.value) {
        const payload = {
          projectId: this.projectId,
          supplierId: supplier._id
        };

        this.superadminService.removeInterestedSupplier(payload).subscribe(
          (response) => {
            if (response?.status) {
              this.notificationService.showSuccess('Successfully removed supplier from interested list');
              this.getProjectDetails(); // Refresh the project details
            } else {
              this.notificationService.showError(response?.message || 'Failed to remove supplier');
            }
          },
          (error) => {
            this.notificationService.showError(error?.message || 'Something went wrong');
          }
        );
      }
    });
  }

  deleteAttendeeComment(supplier: any) {
    if (!supplier) {
      return this.notificationService.showError('Invalid supplier');
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the comment for ${supplier.companyName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {
        const payload = {
          projectId: this.projectId,
          supplierId: supplier._id
        };

        this.superadminService.deleteAttendeeComment(payload).subscribe(
          (response) => {
            if (response?.status) {
              this.notificationService.showSuccess('Successfully deleted supplier comment');
              this.getProjectDetails(); // Refresh the project details
            } else {
              this.notificationService.showError(response?.message || 'Failed to delete comment');
            }
          },
          (error) => {
            this.notificationService.showError(error?.message || 'Something went wrong');
          }
        );
      }
    });
  }

}
