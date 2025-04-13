import { Component, ElementRef, ViewChild } from '@angular/core';
import {
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
import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { Location } from '@angular/common';
import { Editor } from 'ngx-editor';
import { Toolbar } from 'ngx-editor';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-manager-project-details',
  templateUrl: './project-manager-project-details.component.html',
  styleUrls: ['./project-manager-project-details.component.scss'],
})
export class ProjectManagerProjectDetailsComponent {
  @ViewChild('downloadLink') private downloadLink!: ElementRef;
  commentName: string = '';
  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
  uploadedDocument: any;
  clientDocument: any[] = [];
  loginDetailDocument: any[] = [];
  subContractDocument: any;
  economicalPartnershipQueryFile: any;
  economicalPartnershipResponceFile: any;
  viewClientDocumentForm: boolean = true;
  viewLoginForm: boolean = true;
  documentName: string = '';
  loginName: string = '';
  comment: string = '';
  isEditing = false;
  status: string = 'Expired';
  bidManagerStatusComment: FormControl = new FormControl('');
  statusDate: FormControl = new FormControl('');
  failStatusReason: FormControl = new FormControl('');
  FeasibilityOtherDocuments: any = [];
  password = 'password';
  showPassword = false;
  failStatusImage: any;
  filteredTasks: any = [];
  showAllLogs: boolean = false;
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
  userList: any = [];
  selectedSupplier: any = [];
  selectedSupplierIds: string[] = [];
  imageFields = [{ text: '', file: null }];
  // For check bov
  subContracting: boolean = true;
  loginModalMode: boolean = true;
  displayedUsers: any[] = [];
  loginDetailControl = {
    companyName: new FormControl('', Validators.required),
    link: new FormControl('', Validators.required),
    loginID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    id: new FormControl(''),
  };
  loginUser: any = [];
  selectedUserIds: number[] = [];
  loginDetailForm: FormGroup = new FormGroup(this.loginDetailControl);
  commentData: any[] = [];
  logs: any = [];
  addStripcontrol = {
    text: new FormControl('', Validators.required),
    imageText: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    userIds: new FormControl('', Validators.required),
  };
  addStripForm: FormGroup = new FormGroup(this.addStripcontrol);
  selectedImage!: string;

  ForTitleuserList: any = [
    'SupplierAdmin',
    'FeasibilityAdmin',
    'FeasibilityUser',
  ];
  displayForTitleedUsers: any = [];
  selectViewImage: any;
  uploadType: boolean = true;
  showSupplierList = false;
  viewReasonList: any = [];
  filteredComments: any[] = [];
  feasibilityStatus: string = 'Expired';
  feasibilityCommentData: any[] = [];
  feasibilityStatusComment: FormControl = new FormControl('');
  selectedFailReason: string = '';
  failStatusReasons: { tag: string; comment: string }[] = [];
  droppedStatusReasons: { tag: string; comment: string }[] = [];
  projectStrips: any = [];
  getReasonList: any = [];
  getDroppedAfterReasonList: any = [];
  selectedDroppedAfterFeasibilityReason: string = '';
  westGetDocument: any[] = [];

  feasibilityEditor: Editor = new Editor();
  bidStatusEditor: Editor = new Editor();
  selectedSuppliersList: any[] = [];
  allSuppliers: any[] = [];

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
  selectedSuppliers: { [key: string]: { company: string; startDate: any } } =
    {};
  userDetail: any;
  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private feasibilityService: FeasibilityService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private superService: SuperadminService,
    private projectManagerService: ProjectManagerService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private superadminService: SuperadminService,
    private location: Location,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id'];
    });
    this.loginUser = this.localStorageService.getLogger();
  }
  ngOnInit(): void {
    this.getProjectDetails();
    this.getTask();
    this.getUserDetails();
    this.getUserAllList();
    this.getProjectStrips();
    // this.getForTitleUserAllList();
    this.addStripForm = this.fb.group({
      type: ['', Validators.required],
      text: [''],
      description: [''],
      imageText: [''],
      roles: [''],
    });
    this.feasibilityEditor = new Editor();
    this.bidStatusEditor = new Editor();
  }

  getUserDetails() {
    this.projectManagerService.getUserList('SupplierAdmin').subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.userDetail = response?.data;
          this.allSuppliers = response?.data;
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


  ngOnDestroy() {
    if (this.feasibilityEditor) {
      this.feasibilityEditor.destroy();
    }
    if (this.bidStatusEditor) {
      this.bidStatusEditor.destroy();
    }
  }

  addField() {
    this.imageFields.push({ text: '', file: null });
  }
  goBack() {
    this.location.back();
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
        this.notificationService.showError(error?.message);
        this.showLoader = false;
      }
    );
  }

  viewAllComments(userId: string) {
    // Check if the userId is passed correctly
    console.log('Selected User ID:', userId);

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


  toggleSupplierList() {
    this.showSupplierList = !this.showSupplierList;
  }

  saveSupplierInput(index: number): void {
    const supplier = this.selectedSupplier[index];
    console.log(`Saved input for ${supplier.name}: ${supplier.inputValue}`);
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
    params.roles = [...(formValues.roles || []), 'ProjectManager'];
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

  getUserAllList() {
    this.showLoader = true;
    this.projectManagerService.getUserAllList().subscribe(
      (response) => {
        if (response?.status === true) {
          // Filter only roles of FeasibilityAdmin and FeasibilityUser
          this.userList = response?.data?.filter(
            (user: any) =>
              user?.role === 'FeasibilityAdmin' ||
              user?.role === 'FeasibilityUser'
          );
          this.selectedSupplier = response?.data?.filter(
            (user: any) => user?.role === 'SupplierAdmin'
          );
          this.displayedUsers = this.userList.slice(0, 7);
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

  public showHidePass(): void {
    if (this.password === 'password') {
      this.password = 'text';
      this.showPassword = true;
    } else {
      this.password = 'password';
      this.showPassword = false;
    }
  }

  editProjectDetails(projectId: any) {
    this.router.navigate(['/project-manager/project/add-edit-project'], {
      queryParams: { id: projectId },
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

  // Method to fetch project details and set the viewReasonList
  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe(
      (response) => {
        if (response?.status === true) {
          this.showLoader = false;
          this.projectDetails = response?.data;
          this.selectedSuppliersList = response?.data?.sortlistedUsers || [];
          // this.selectedSupplier = response?.data?.sortlistedUsers;
          this.logs = response?.data?.logs?.slice(0, 3) || [];
          this.feasibilityStatus = this.projectDetails?.status;
          this.getDroppedAfterReasonList = this.projectDetails?.droppedAfterFeasibilityStatusReason;
          this.status = this.projectDetails?.bidManagerStatus;
          this.commentData = this.projectDetails?.bidManagerStatusComment;
          this.getReasonList = this.projectDetails?.failStatusReason;
          this.feasibilityCommentData = this.projectDetails?.statusComment || [];
          this.viewReasonList = this.projectDetails?.dropUser; // Store the dropUser list
          console.log(this.viewReasonList); // Logs the dropUser list for debugging
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

  statusBaseHideShow() {
    if (
      this.status == 'Dropped after feasibility' ||
      this.status == 'Awarded' ||
      this.status == 'NotAwarded' ||
      this.status == 'Fail'
    ) {
      return false;
    }
    return true;
  }

  statusChange(status: string) {
    this.status = status;
    this.commentData = [];
    this.bidManagerStatusComment.reset();
  }

  statusFeasibilityChange(status: string) {
    this.feasibilityStatus = status;
    this.feasibilityCommentData = [];
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

  pushFeasibilityStatus() {
    if (!this.feasibilityStatusComment.value) {
      this.notificationService.showError('Please enter a status comment');
      return;
    }

    const currentDate = new Date();
    const newComment = this.feasibilityStatusComment.value.trim(); // Remove extra spaces

    // Ensure feasibilityCommentData is initialized
    if (!this.feasibilityCommentData) {
      this.feasibilityCommentData = [];
    }

    // Debugging: Log current data
    console.log('Existing Comments:', this.feasibilityCommentData);

    // Check if the same comment with the same status already exists
    const isDuplicate = this.feasibilityCommentData.some(
      (comment) =>
        comment.comment.trim() === newComment &&
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

  // Function to be used for showing uploaded document
  openUploadedDocument(data: any) {
    this.uploadedDocument = data;
    console.log(this.uploadedDocument);
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
    this.saveChanges(type);

    if (type == 'next') {
      this.router.navigate(['/project/bid-manager-to-action'], {
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

  removeDocument(type: string): void {
    if (type === this.documentUploadType.subContractDocument) {
      this.subContractDocument = null; // Clear the uploaded document
    }
    if (type === this.documentUploadType.economicalPartnershipQuery) {
      this.economicalPartnershipQueryFile = null;
    }
    if (type === this.documentUploadType.failStatusImage) {
      this.failStatusImage = null;
    }
    // if (type === this.documentUploadType.clientDocument) {
    //   this.clientDocument = null;
    // }
    // if (type === this.documentUploadType.loginDetailDocument) {
    //   this.loginDetailDocument = null;
    // }

    if (type === this.documentUploadType.economicalPartnershipResponse) {
      this.economicalPartnershipResponceFile = null; // Clear the uploaded document
      this.notificationService.showSuccess('Document removed successfully.');
    }

    // Add any additional logic for other document types
    this.notificationService.showSuccess('Document removed successfully.');
  }

  removeOtherDocument(document: any): void {
    // Remove the document from the FeasibilityOtherDocuments array
    const index = this.FeasibilityOtherDocuments.indexOf(document);
    if (index > -1) {
      this.FeasibilityOtherDocuments.splice(index, 1); // Remove the document from the array
      this.notificationService.showSuccess('Document removed successfully.');
    }
  }

  hideShowForm() {
    this.viewClientDocumentForm = !this.viewClientDocumentForm;
  }

  viewLoginDetail(loginData: any) {
    this.loginModalMode = true;
    this.loginDetailForm.patchValue(loginData.data);
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

  addLoginInfo() {
    const dataToBePushed = {
      name: this.loginName,
      data: this.loginDetailForm.value,
    };
    if (this.projectDetails.loginDetail[this.loginDetailForm.value['id']]) {
      this.projectDetails.loginDetail[this.loginDetailForm.value['id']].data =
        dataToBePushed.data;
    } else {
      this.projectDetails.loginDetail.push(dataToBePushed);
    }
    this.loginName = '';
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
        comment: this.comment || '',
        clientDocument: this.projectDetails?.clientDocument || [],
        westGetDocument: this.projectDetails?.westGetDocument || [],
        bidManagerStatus: this.status || '',
        bidManagerStatusComment: this.commentData,
        status: this.feasibilityStatus || '',
        statusComment: this.feasibilityCommentData,
        failStatusImage: this.failStatusImage || '',
      };

      if (this.failStatusReason?.value) {
        payload['failStatusReason'] = [this.failStatusReason?.value] || [];
      }

      // Conditionally add the `subContracting` field if it is defined
      if (this.subContracting !== undefined && this.subContracting !== null) {
        payload.subContracting = this.subContracting;
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
            // if (type == 'save') {
            //   this.router.navigate(['/feasibility-user/summary-note-questions'], { queryParams: { id: this.projectId } });
            // }
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

  appointFeasibilityUser(selectedUsers: string[], item: any) {
    const projectId = item?._id;
    const payload = {
      userId: selectedUsers, // Array of selected user IDs
    };
    this.superService.appointFeasibilityUser(payload, projectId).subscribe(
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

  selectSupplier(supplier: any) {
    console.log(supplier);

    const data = {
      userId: supplier._id,
      projectId: this.projectId,
      isSelected: true
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

  submitSelectedSuppliers() {
    if (!this.selectedSupplierIds || this.selectedSupplierIds.length === 0) {
      this.notificationService.showError('Please select at least one supplier.');
      return;
    }

    const payload = {
      userIds: this.selectedSupplierIds,
      projectId: this.projectId
    };

    this.projectService.projectSortList(payload).subscribe(
      (response) => {
        if (response?.status == true) {
          this.notificationService.showSuccess(
            response?.message || 'Suppliers selected successfully'
          );
          this.getProjectDetails();
        } else {
          this.notificationService.showError('Try after some time.');
        }
      },
      (error) => {
        this.notificationService.showError(error?.message || 'Error occurred.');
      }
    );
  }

  // Method to remove a fail reason
  removeDroppedReason(index: number) {
    this.droppedStatusReasons.splice(index, 1);
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

  isBidCommentValid(): boolean {
    // Validate if a comment exists for the selected status or is added
    const hasComment = this.commentData.some(
      (item) => item.bidManagerStatus === this.status
    );
    const hasUnaddedComment = this.bidManagerStatusComment.value && !hasComment;
    return this.status && (hasComment || hasUnaddedComment);
  }

  addFailReason() {
    if (!this.selectedFailReason) {
      this.notificationService.showError('Please select a fail reason.');
      return;
    }
    this.failStatusReasons.push({
      tag: this.selectedFailReason,
      comment: '',
    });

    // Reset the dropdown selection
    this.selectedFailReason = '';
  }

  removeFailReason(index: number) {
    this.failStatusReasons.splice(index, 1);
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

            this.notificationService.showError(error?.message);
          }
        );
      }
    });
  }
  isSupplierSelected(supplierId: string): boolean {
    return this.projectDetails?.selectedUserIds?.some((user: any) => user._id === supplierId && user.isSelected);
  }
}
