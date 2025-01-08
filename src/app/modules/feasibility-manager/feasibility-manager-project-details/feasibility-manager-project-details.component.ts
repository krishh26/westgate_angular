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
import { NgxSpinnerService } from 'ngx-spinner';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-feasibility-manager-project-details',
  templateUrl: './feasibility-manager-project-details.component.html',
  styleUrls: ['./feasibility-manager-project-details.component.scss'],
})
export class FeasibilityManagerProjectDetailsComponent {
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
  statusComment: FormControl = new FormControl('');
  statusDate: FormControl = new FormControl('');
  failStatusReason: FormControl = new FormControl('');
  FeasibilityOtherDocuments: any = [];
  password = 'password';
  showPassword = false;
  failStatusImage: any;
  filteredTasks: any = [];
  showAllLogs: boolean = false;
  // documentUploadType: any = {
  //   subContractDocument: 'SubContract',
  //   economicalPartnershipQuery: 'economicalPartnershipQuery',
  //   economicalPartnershipResponse: 'economicalPartnershipResponse',
  //   clientDocument: 'clientDocument',
  //   loginDetailDocument: 'loginDetailDocument',
  //   otherQueryDocument: 'otherQueryDocument',
  //   otherDocument: 'otherDocument',
  //   failStatusImage: 'failStatusImage',
  //   westgatedocument: 'westgatedocument',
  // };
  userList: any = [];
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
  supplieruserList: any = [];
  ForTitleuserList: any = ['SupplierAdmin', 'FeasibilityUser'];
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
    westgatedocument: 'westgatedocument',
  };
  supportDocument!: FormGroup;
  displayForTitleedUsers: any = [];
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
    private fb: FormBuilder
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id'];
    });
    this.loginUser = this.localStorageService.getLogger();
  }
  ngOnInit(): void {
    this.getProjectDetails();
    this.getTask();
    this.getUserAllList();
    // this.getForTitleUserAllList();
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

    // Add userIds if selected
    if (formValues.roles && formValues.roles.length > 0) {
      params.roles = formValues.roles; // Pass roles directly as an array
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
    this.superService.updateProjectDetails(payload, id).subscribe(
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

  removeDocumentADD(i: number) {
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

  getForTitleUserAllList() {
    this.showLoader = true;
    this.projectManagerService.getUserAllList().subscribe(
      (response) => {
        if (response?.status === true) {
          // Filter only roles of FeasibilityAdmin and FeasibilityUser
          this.ForTitleuserList = response?.data?.filter(
            (user: any) =>
              user?.role === 'SupplierAdmin' ||
              user?.role === 'FeasibilityUser'
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
    this.router.navigate(
      ['/feasibility-user/edit-feasibility-project-details'],
      { queryParams: { id: projectId } }
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

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe(
      (response) => {
        if (response?.status == true) {
          this.showLoader = false;
          this.projectDetails = response?.data;

          // Assign only the first 3 logs to the logs property
          this.logs = response?.data?.logs?.slice(0, 3) || [];

          this.status = this.projectDetails?.status;
          this.subContracting = this.projectDetails?.subContracting;
          // this.statusComment.setValue(this.projectDetails?.statusComment);
          this.commentData = this.projectDetails?.statusComment;
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
      userId: this.loginUser?._id,
    });

    // Reset the comment input field
    this.statusComment.reset();
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
    if (!this.projectDetails?.clientDocument.length) {
      return this.notificationService.showError('Upload Client Document');
    }
    // if (!this.projectDetails?.loginDetail.length) {
    //   return this.notificationService.showError('Upload Login Detail');
    // }
    this.saveChanges(type);

    // if (type == 'next') {
    //   this.router.navigate(['/feasibility-user/summary-note-questions'], { queryParams: { id: this.projectId } });
    // }
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
      // if ((this.status == 'InProgress' || this.status == 'InHold' || this.status == 'Passed') && !this.statusComment?.value) {
      //   return this.notificationService.showError('Please Enter Status Comment');
      // }

      // if (this.status == 'Expired' && !this.failStatusReason?.value) {
      //   return this.notificationService.showError('Please Select Status Comment');
      // }

      if (this.statusComment.value && this.statusDate.value) {
        this.commentData.push({
          comment: this.statusComment.value,
          date: this.statusDate.value,
          status: this.status,
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
        statusComment: this.commentData,
        loginDetail: this.projectDetails.loginDetail || '',
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
}
