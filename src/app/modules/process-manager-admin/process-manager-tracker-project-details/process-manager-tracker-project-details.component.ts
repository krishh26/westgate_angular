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
@Component({
  selector: 'app-process-manager-tracker-project-details',
  templateUrl: './process-manager-tracker-project-details.component.html',
  styleUrls: ['./process-manager-tracker-project-details.component.scss'],
})
export class ProcessManagerTrackerProjectDetailsComponent {
  @ViewChild('downloadLink') private downloadLink!: ElementRef;

  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
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
  statusComment: FormControl = new FormControl('');
  statusDate: FormControl = new FormControl('');
  failStatusReason: FormControl = new FormControl('');
  commentData: any[] = [];
  comment: string = '';
  subContracting: boolean = true;
  userList: any = [];
  assignTo: any;
  modalTask: any = {};
  taskList: any = [];
  selectedUserIds: number[] = [];
  filteredTasks: any = [];
  showAllLogs: boolean = false;
  logs: any = [];

  addStripcontrol = {
    text: new FormControl('', Validators.required),
    imageText: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  };
  addStripForm: FormGroup = new FormGroup(this.addStripcontrol);
  selectedImage!: string;
  uploadType: boolean = true;
  projectStrips: any = [];
  imageFields = [{ text: '', file: null }];
  selectViewImage: any;
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
  ForTitleuserList: any = ['FeasibilityAdmin', 'FeasibilityUser', 'ProjectManager', 'SupplierAdmin'];
  displayForTitleedUsers: any = [];

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
    private superService: SuperadminService,
    private superadminService: SuperadminService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id'];
    });
    this.myForm = this.fb.group({
      skills: this.fb.array([]),
    });
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.getProjectDetails();
    this.getUserAllList();
    //this.getForTitleUserAllList();
    this.getTask();
    this.getProjectLogs();
    this.getProjectStrips();
    this.initializeForm();
    this.addStripForm = this.fb.group({
      type: ['', Validators.required],
      text: [''],
      description: [''], // Ensure this is included
      imageText: [''],
      roles: ['']
    });
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

  getForTitleUserAllList() {
    this.showLoader = true;
    this.projectManagerService.getUserAllList().subscribe(
      (response) => {
        if (response?.status === true) {
          // Filter only roles of FeasibilityAdmin and FeasibilityUser
          this.ForTitleuserList = response?.data?.filter(
            (user: any) =>
              user?.role === 'SupplierAdmin' ||
              user?.role === 'FeasibilityUser' ||
              user?.role === 'FeasibilityAdmin' || user?.role === 'ProjectManager'
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

  addLoginInfo() {
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

  openViewImage(image: any) {
    this.selectViewImage = image;
    console.log(this.selectViewImage?.url);
  }

  removeDocument(i: number) {
    this.document.removeAt(i);
  }

  initializeForm() {
    this.supportDocument = this.fb.group({
      document: this.fb.array([]),
    });
  }
  get document(): FormArray {
    return this.supportDocument?.get('document') as FormArray;
  }

  openDocument(data: any) {
    this.selectedDocument = data;
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

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.projectDetails = response?.data;

          // Assign only the first 3 logs to the logs property
          // this.logs = response?.data?.logs?.slice(0, 3) || [];

          this.casestudylist = response?.data?.casestudy;
          this.status = this.projectDetails?.status;
          this.subContracting = this.projectDetails?.subContracting;
          this.statusComment.setValue(this.projectDetails?.statusComment);

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

  getUserAllList() {
    this.showLoader = true;
    this.projectManagerService.getUserAllList().subscribe(
      (response) => {
        if (response?.status === true) {
          this.userList = response?.data?.filter(
            (user: any) => user?.role == 'ProjectManager'
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
    const payload = {
      task: this.projectDetails?.projectName,
      assignTo: [`${this.assignTo}`],
      project: this.projectId,
    };
    console.log('this is data', payload);
    this.superService.createTask(payload).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('user Assign  Successfully');
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.notificationService.showError(error?.message);
      }
    );
  }

  appointFeasibilityUser(selectedUsers: string[], item: any) {
    const projectId = item?._id;
    const payload = {
      userIds: selectedUsers, // Array of selected user IDs
    };
    this.superService.appointBidUser(payload, projectId).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status === true) {
          this.getProjectDetails();
          this.notificationService.showSuccess('Appoint users successfully');
          // window.location.reload();
        } else {
          this.notificationService.showError(
            response?.message || 'Failed to appoint users'
          );
        }
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError(
          error?.message || 'An error occurred'
        );
      }
    );
  }
}
