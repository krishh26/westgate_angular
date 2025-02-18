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

@Component({
  selector: 'app-approve-reject-project-details',
  templateUrl: './approve-reject-project-details.component.html',
  styleUrls: ['./approve-reject-project-details.component.scss']
})
export class ApproveRejectProjectDetailsComponent {
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
  loginDetailDocument: any[] = [];
  subContractDocument: any;
  economicalPartnershipQueryFile: any;
  economicalPartnershipResponceFile: any;
  viewClientDocumentForm: boolean = true;
  viewLoginForm: boolean = true;
  documentName: string = '';
  loginName: string = '';
  isEditing = false;
  status: string = 'Expired';
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
  bidStatus: string = 'Expired';
  bidManagerStatusComment: FormControl = new FormControl('');
  feasibilityStatus: string = 'Expired';
  bidCommentData: any[] = [];
  selectedUserIds: number[] = [];
  showAllLogs: boolean = false;
  logs: any = [];
  FeasibilityuserList: any = [];
  BiduserList: any = [];
  feasibilityStatusComment: FormControl = new FormControl('');

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
    private superService: SuperadminService
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
  }

  editProjectDetails(projectId: any) {
    this.router.navigate(['/super-admin/super-admin-add-project'], {
      queryParams: { id: projectId },
    });
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
              this.showLoader = false;
              this.notificationService.showSuccess(
                'Project successfully deleted'
              );
              this.router.navigate(['/super-admin/approve-reject-projects'])
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

  getProjectLogs() {
    this.showLoader = true;
    this.projectService.getProjectLogs(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.logs = response?.data;
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

  getTask() {
    this.showLoader = true;
    const projectIdToMatch = this.projectId; // Replace with the actual project ID to match

    this.superService.getTask(this.selectedUserIds.join(',')).subscribe(
      (response) => {
        if (response?.status === true) {
          // Filter tasks based on project ID
          this.filteredTasks = response.data.data.filter(
            (task: any) => task.project && task.project._id === projectIdToMatch
          );
          this.showLoader = false;
        } else {
          this.filteredTasks = []; // No records found
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error) => {
        this.filteredTasks = []; // No records found
        this.notificationService.showError(error?.message);
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

  assignUser() {
    if (!this.assignTo) {
      this.notificationService.showError('Please select assign to user');
      return;
    }

    // Format the dueDate
    let formattedDueDate: string | null = null;
    if (this.dueDate) {
      const { year, month, day } = this.dueDate;
      formattedDueDate = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
    }

    const payload = {
      task: this.projectDetails?.projectName,
      assignTo: [`${this.assignTo}`],
      project: this.projectId,
      dueDate: formattedDueDate,
    };

    console.log('this is data', payload);

    this.superService.createTask(payload).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('User assigned successfully');
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
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

  pushFeasilityStatus() {
    if (!this.feasibilityStatusComment.value) {
      this.notificationService.showError('Please enter a status comment');
      return;
    }
    const currentDate = new Date();
    this.feasibilityCommentData = [
      ...this.feasibilityCommentData,
      {
        comment: this.feasibilityStatusComment.value,
        date: currentDate.toISOString(),
        status: this.feasibilityStatus,
        userId: this.loginUser?._id,
      },
    ];
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
    console.log(this.droppedStatusReasons, this.selectedDroppedAfterFeasibilityReason);


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

  getUserDetails() {
    this.projectManagerService.getUserList('SupplierAdmin').subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.userDetail = response?.data;
          this.selectedSuppliers = this.userDetail.reduce(
            (acc: any, supplier: any) => {
              acc[supplier._id] = { company: '', startDate: null };
              return acc;
            },
            {}
          );
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

  dropUser(details: any) {
    console.log('this is testing data', details);
    if (!details?.reason) {
      return this.notificationService.showError('Please enter reason');
    }

    const data = {
      dropUser: {
        userId: details?._id,
        reason: details?.reason,
      },
    };

    this.projectManagerService.dropUser(data, this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {
          this.notificationService.showSuccess(
            response?.message || 'Drop user successfully'
          );
          this.getUserDetails();
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
          this.showLoader = false;
          this.summaryquestionList = response?.data;
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

  selectSupplier(supplier: any) {
    this.selectedSupplier = supplier;

    if (!this.selectedSupplier) {
      return this.notificationService.showError('please select supplier');
    }
    console.log('sadsdd', supplier);

    const data = {
      select: {
        supplierId: this.selectedSupplier?._id,
        companySelect: supplier.company,
        handoverCall: supplier.startDate,
      },
    };
    this.projectManagerService.dropUser(data, this.projectId).subscribe(
      (response) => {
        this.notificationService.showSuccess('Successfully select user');
      },
      (error) => {
        this.notificationService.showError(
          error?.message || 'Something went wrong'
        );
      }
    );
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
              this.showLoader = false;
              this.getSummaryList();
              this.resetForm();
            } else {
              this.notificationService.showError(response?.message);
              this.showLoader = false;
            }
          },
          error: (error) => {
            this.notificationService.showError(error?.message);
            this.showLoader = false;
          },
        });
    } else {
      // Add new summary
      this.summaryService.addSummary(this.summaryForm.value).subscribe({
        next: (response) => {
          if (response?.status === true) {
            this.showLoader = false;
            this.getSummaryList();
            this.resetForm();
          } else {
            this.notificationService.showError(response?.message);
            this.showLoader = false;
          }
        },
        error: (error) => {
          this.notificationService.showError(error?.message);
          this.showLoader = false;
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
          this.showLoader = false;
          this.summaryQuestionList = response?.data;
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
          companyName: item?.userDetails?.companyName
        }
      }
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
        this.projectService.deleteFeasiblityBidComment(param, this.projectId).subscribe(
          (response: any) => {
            if (response?.status === true) {
              this.showLoader = false;
              this.notificationService.showSuccess(
                'Comment successfully deleted'
              );
              window.location.reload();
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
          companyName: item?.userDetails?.companyName
        }
      }
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
              this.showLoader = false;
              this.notificationService.showSuccess(
                'Comment successfully deleted'
              );
              window.location.reload();
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
            this.showLoader = false;
            if (response?.status === true) {
              this.notificationService.showSuccess('Comment successfully deleted');
              window.location.reload();
            } else {
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

        this.projectService.deletedroppedReason(param, this.projectId).subscribe(
          (response: any) => {
            this.showLoader = false;
            if (response?.status === true) {
              this.notificationService.showSuccess('Reason successfully deleted');
              window.location.reload();
            } else {
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
            this.notificationService.showError(error?.message);
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
          this.showLoader = false;
          this.projectDetails = response?.data;
          this.casestudylist = response?.data?.casestudy;
          this.feasibilityStatus = this.projectDetails?.status;
          this.status = this.projectDetails?.bidManagerStatus;
          this.subContracting = this.projectDetails?.subContracting;
          this.getReasonList = this.projectDetails?.failStatusReason;
          this.getDroppedAfterReasonList = this.projectDetails?.droppedAfterFeasibilityStatusReason;
          this.commentData = this.projectDetails?.bidManagerStatusComment;
          this.feasibilityCommentData =
            this.projectDetails?.statusComment || [];
          this.bidCommentData =
            this.projectDetails?.bidManagerStatusComment || [];
          this.subContractDocument =
            this.projectDetails?.subContractingfile || null;
          this.economicalPartnershipQueryFile =
            this.projectDetails?.economicalPartnershipQueryFile || null;
          this.economicalPartnershipResponceFile =
            this.projectDetails?.economicalPartnershipResponceFile || null;
          this.FeasibilityOtherDocuments =
            this.projectDetails?.FeasibilityOtherDocuments || null;
          this.failStatusImage = this.projectDetails?.failStatusImage || null;
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
    this.selectViewImage = image;
    console.log(this.selectViewImage?.url);
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
    if (!this.projectDetails?.clientDocument.length) {
      return this.notificationService.showError('Upload Client Document');
    }
    // if (!this.projectDetails?.loginDetail.length) {
    //   return this.notificationService.showError('Upload Login Detail');
    // }
    this.saveChanges(type);

    if (type == 'next') {
      this.router.navigate(['/super-admin/approve-reject-projects'], {
        queryParams: { id: this.projectId },
      });
    }
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
        subContractingfile: this.subContractDocument || [],
        economicalPartnershipQueryFile:
          this.economicalPartnershipQueryFile || [],
        FeasibilityOtherDocuments: this.FeasibilityOtherDocuments || [],
        economicalPartnershipResponceFile:
          this.economicalPartnershipResponceFile || [],
        periodOfContractStart: this.projectDetails.periodOfContractStart,
        periodOfContractEnd: this.projectDetails.periodOfContractEnd,
        projectType: this.projectDetails.projectType,
        subContracting: this.subContracting || '',
        comment: this.comment || '',
        clientDocument: this.projectDetails?.clientDocument || [],
        status: this.status || '',
        statusComment: this.feasibilityCommentData,
        bidManagerStatus: this.bidStatus || '',
        bidManagerStatusComment: this.bidCommentData,
        loginDetail: this.projectDetails.loginDetail || '',
        failStatusImage: this.failStatusImage || '',
      };

      if (this.failStatusReason?.value) {
        payload['failStatusReason'] = [this.failStatusReason?.value] || [];
      }
    }

    if (contractEdit) {
      payload = {
        periodOfContractStart: this.projectDetails.periodOfContractStart,
        periodOfContractEnd: this.projectDetails.periodOfContractEnd,
        projectType: this.projectDetails.projectType,
      };
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
              this.router.navigate(['/super-admin/approve-reject-projects'], {
                queryParams: { id: this.projectId },
              });
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

  isImage(url: string): boolean {
    return (
      url?.endsWith('.jpg') ||
      url?.endsWith('.jpeg') ||
      url?.endsWith('.png') ||
      false
    );
  }

  getDocumentViewerUrl(url: string): SafeResourceUrl {
    if (this.isWordOrExcel(url)) {
      const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        url
      )}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(officeUrl);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
            this.showLoader = false;
          }
        },
        (error) => {
          this.notificationService.showError(error?.message);
          this.showLoader = false;
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

  addtitle() {
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

    params.roles = [...(formValues.roles || []), 'Admin'];

    // Log params to the console
    console.log('Params to be sent:', params);
    this.projectService.createStrip(params).subscribe(
      (response: any) => {
        if (response?.status == true) {
          this.getProjectDetails();
          this.notificationService.showSuccess(
            '',
            'Project Update Successfully.'
          );
        } else {
          this.notificationService.showError(response?.message);
          this.showLoader = false;
        }
      },
      (error: any) => {
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
  }

  getProjectStrips() {
    this.projectService.getprojectStrips(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.projectStrips = response?.data?.data;
          console.log(this.projectStrips);
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
    const allFilesUploaded = this.imageFields.every((field) => !!field.file);
    if (!allFilesUploaded) {
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
        this.spinner.hide();
        if (response?.status) {
          this.saveImageDetails(response.data, modalId.toString());
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
        if (!hasExistingComment && !this.feasibilityStatusComment.value) {
          return this.notificationService.showError(
            'Please provide a feasibility comment for the selected status.'
          );
        }

        // If a comment is filled but not added
        if (this.feasibilityStatusComment.value) {
          return this.notificationService.showError(
            'Please click the "Add" button to save your comment.'
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
            'Please provide a comments for the selected Reason.'
          );
        }
      }
      payload = {
        projectType: this.projectDetails.projectType,
        clientDocument: this.projectDetails?.clientDocument || [],
        status: this.feasibilityStatus || '',
        statusComment: [
          ...this.feasibilityCommentData,
          ...this.projectDetails?.statusComment,
        ],
        failStatusReason: this.failStatusReasons,
      };

      // Add fail reason if applicable
      if (this.failStatusReason?.value) {
        payload['failStatusReason'] = [this.failStatusReason?.value] || [];
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

      if (this.bidManagerStatusComment.value) {
        return this.notificationService.showError(
          'Please click the "Add" button to save your comment.'
        );
      }

      // Check if the status has at least one comment
      const hasExistingComment = this.commentData.some(
        (item) => item.bidManagerStatus === this.status
      );
      if (!hasExistingComment && !this.droppedStatusReasons.length) {
        return this.notificationService.showError(
          'Please provide a bid comment for the selected status.'
        );
      }

      // Merge existing and new comments, removing duplicates
      const existingComments = this.projectDetails?.bidManagerStatusComment || [];
      const newComments = [...this.commentData];

      let uniqueComments: any[] = [];
      if (this.droppedStatusReasons.length > 0) {
        uniqueComments = Array.from(
          new Map(
            [...newComments].map((item) => [item.commentId || item.comment, item])
          ).values()
        );
      } else {
        uniqueComments = Array.from(
          new Map(
            [...existingComments, ...newComments].map((item) => [item.commentId || item.comment, item])
          ).values()
        );
      }

      // **Sort comments in descending order (latest first)**
      uniqueComments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      payload = {
        bidManagerStatus: this.status || '',
        // bidManagerStatusComment: uniqueComments, // Now sorted in descending order
      };

      if (this.droppedStatusReasons.length == 0) {
        payload['bidManagerStatusComment'] = uniqueComments
      }

      // If status is 'Dropped after feasibility', include fail reasons
      if (this.status === 'Dropped after feasibility' && this.droppedStatusReasons.length > 0) {
        payload.droppedAfterFeasibilityStatusReason = this.droppedStatusReasons.map(reason => ({
          tag: reason.tag,
          comment: reason.comment || '' // Ensure an empty comment if none is provided
        }));
      }
    }

    // API call to update project details
    this.feasibilityService.updateProjectDetailsBid(payload, this.projectDetails._id).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Project updated successfully');
          this.isEditing = false;
          this.getProjectDetails(); // Refresh project details after save
        } else {
          this.notificationService.showError(response?.message || 'Failed to update project');
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
}
