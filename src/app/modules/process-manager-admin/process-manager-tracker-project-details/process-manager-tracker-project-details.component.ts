import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Location } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-process-manager-tracker-project-details',
  templateUrl: './process-manager-tracker-project-details.component.html',
  styleUrls: ['./process-manager-tracker-project-details.component.scss'],
})
export class ProcessManagerTrackerProjectDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('downloadLink') private downloadLink!: ElementRef;

  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
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
  commentName: string = '';
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
  feasibilityStatus: string = 'Expired';
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
  feasibilityCommentData: any[] = [];
  dueDate: any;
  addStripcontrol = {
    text: new FormControl('', Validators.required),
    imageText: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  };
  getReasonList: any = [];
  addStripForm: FormGroup = new FormGroup(this.addStripcontrol);
  selectedImage!: string;
  uploadType: boolean = true;
  projectStrips: any = [];
  imageFields = [{ text: '', file: null }];
  BiduserList: any = [];
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
  FeasibilityuserList: any = [];
  getDroppedAfterReasonList: any = [];

  // Editor related properties
  editor!: Editor;
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
    private superService: SuperadminService,
    private superadminService: SuperadminService,
    private location: Location
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

    // Initialize editor
    this.editor = new Editor();
    this.mandatoryDetailsEditor = new Editor();

    this.getProjectDetails();
    this.getUserAllList();
    //this.getForTitleUserAllList();
    this.getTask();
    this.getProjectLogs();
    this.getProjectStrips();
    this.getMinimalRequirement();
    this.initializeForm();
    this.addStripForm = this.fb.group({
      type: ['', Validators.required],
      text: [''],
      description: [''], // Ensure this is included
      imageText: [''],
      roles: ['']
    });
  }

  ngOnDestroy(): void {
    // Destroy the editor to prevent memory leaks
    this.editor.destroy();
    if (this.mandatoryDetailsEditor) {
      this.mandatoryDetailsEditor.destroy();
    }
  }

  goBack() {
    this.location.back();
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

  uploadDocument(event: any, type: string): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const data = new FormData();
      data.append('files', file);

      this.spinner.show();

      this.feasibilityService.uploadDocument(data).subscribe(
        (response) => {


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
            this.summaryDetail('save');
            this.spinner.hide();

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

  summaryDetail(type: string) {
    // if (!this.projectDetails?.clientDocument.length) {
    //   return this.notificationService.showError('Upload Client Document');
    // }
    // if (!this.projectDetails?.westGetDocument.length) {
    //   return this.notificationService.showError('Upload westGet Document');
    // }
    this.saveChanges(type);
  }

  // Update the saveChanges method to include failStatusReasons
  saveChanges(type?: string, contractEdit?: boolean) {
    let payload: any = {};

    if (!contractEdit) {
      // Validation for status
      if (!this.status) {
        return this.notificationService.showError('Please select a status.');
      }
      payload = {
        projectType: this.projectDetails.projectType,
        clientDocument: this.projectDetails?.clientDocument || [],
        westGetDocument: this.projectDetails?.westGetDocument || [],
        status: this.status || '',
        statusComment: this.commentData,
        // failStatusImage: this.failStatusImage || '',
        // failStatusReason: this.failStatusReasons,
      };
    }
    this.spinner.show();
    // API call to update project details
    this.feasibilityService.updateProjectDetails(payload, this.projectDetails._id).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Project updated successfully');
          this.isEditing = false;
          this.getProjectDetails();
        } else {
          this.notificationService.showError(response?.message || 'Failed to update project');
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        this.notificationService.showError('Failed to update project');
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
        this.notificationService.showError(error?.error?.message || error?.message);
        this.showLoader = false;
      }
    );
  }

  editProjectDetails(projectId: any) {
    this.router.navigate(['/process-manager/add-project'], { queryParams: { id: projectId } });
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
          this.showLoader = false;
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
          this.showLoader = false;
          this.projectStrips = response?.data?.data;

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
    this.spinner.show();
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
        this.notificationService.showError(error?.error?.message || error?.message);
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
        this.notificationService.showError(error?.error?.message || error?.message);
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
          this.getReasonList = this.projectDetails?.failStatusReason;
          this.casestudylist = response?.data?.casestudy;
          this.status = this.projectDetails?.status;
          this.subContracting = this.projectDetails?.subContracting;
          this.commentData = this.projectDetails?.bidManagerStatusComment;
          this.statusComment.setValue(this.projectDetails?.statusComment);
          this.feasibilityCommentData =
            this.projectDetails?.statusComment || [];
          this.getDroppedAfterReasonList = this.projectDetails?.droppedAfterFeasibilityStatusReason;
          this.feasibilityStatus = this.projectDetails?.status;
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
        this.notificationService.showError(error?.error?.message || error?.message);
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

    this.superService.createTask(payload).subscribe(
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

  formatDate(date: any): string {
    if (!date) return '';
    const { day, month, year } = date;
    return `${year}-${month}-${day}`; // Format as 'YYYY-MM-DD'
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

  // Add this method to get a raw string URL for PDFs
  getPdfUrl(url: string): string {
    return url ? url : '';
  }

  // Minimal Requirement functionality
  minimalRequirementData: any = null;

  mandatoryDetailsControl = {
    title: new FormControl('', Validators.required),
    details: new FormControl('', Validators.required),
  };

  mandatoryDetailsForm: FormGroup = new FormGroup(this.mandatoryDetailsControl);
  mandatoryDetailsEditor: Editor = new Editor();

  getMinimalRequirement() {
    this.projectService.getMinimalRequirement(this.projectId).subscribe(
      (response) => {
        if (response?.status === true) {
          this.minimalRequirementData = response?.data;
        }
      },
      (error) => {
        console.error('Error fetching minimal requirement:', error);
      }
    );
  }

  saveMandatoryDetails() {
    if (this.mandatoryDetailsForm.valid) {
      const formValues = this.mandatoryDetailsForm.value;
      const payload = {
        text: formValues.title,
        description: formValues.details
      };

      this.projectService.createMinimalRequirement(this.projectId, payload).subscribe(
        (response) => {
          if (response?.status === true) {
            this.notificationService.showSuccess('Mandatory details saved successfully');

            // Close the modal
            const modalElement = document.getElementById('ViewMandatoryDetails');
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              if (modalInstance) {
                modalInstance.hide();
              }
            }

            // Reset the form
            this.mandatoryDetailsForm.reset();

            // Reload the page after successful save
            window.location.reload();
          } else {
            this.notificationService.showError(response?.message || 'Failed to save mandatory details');
          }
        },
        (error) => {
          this.notificationService.showError(error?.error?.message || error?.message || 'Failed to save mandatory details');
        }
      );
    } else {
      this.notificationService.showError('Please fill in all required fields.');
    }
  }

  deleteMinimalRequirement() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoader = true;
        this.projectService.deleteMinimalRequirement(this.projectId).subscribe(
          (response) => {
            this.showLoader = false;
            if (response?.status === true) {
              this.notificationService.showSuccess('Minimal requirement deleted successfully');
              this.minimalRequirementData = null;
            } else {
              this.notificationService.showError(response?.message || 'Error deleting minimal requirement');
            }
          },
          (error) => {
            this.showLoader = false;
            this.notificationService.showError('Error deleting minimal requirement');
            console.error('Error deleting minimal requirement:', error);
          }
        );
      }
    });
  }
}
