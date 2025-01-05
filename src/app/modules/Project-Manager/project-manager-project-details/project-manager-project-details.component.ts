import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-project-manager-project-details',
  templateUrl: './project-manager-project-details.component.html',
  styleUrls: ['./project-manager-project-details.component.scss']
})
export class ProjectManagerProjectDetailsComponent {

  @ViewChild('downloadLink') private downloadLink!: ElementRef;
  commentName: string = "";
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
  documentName: string = "";
  loginName: string = "";
  comment: string = '';
  isEditing = false;
  status: string = "Expired";
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
    failStatusImage: "failStatusImage",
    westgatedocument: "westgatedocument"
  }
  userList: any = [];
  // For check bov
  subContracting: boolean = true;
  loginModalMode: boolean = true;
  displayedUsers: any[] = [];
  loginDetailControl = {
    companyName: new FormControl("", Validators.required),
    link: new FormControl("", Validators.required),
    loginID: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    id: new FormControl(""),
  }
  loginUser: any = [];
  selectedUserIds: number[] = [];
  loginDetailForm: FormGroup = new FormGroup(this.loginDetailControl);
  commentData: any[] = [];
  logs: any = [];

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
    private localStorageService: LocalStorageService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
    this.loginUser = this.localStorageService.getLogger();
  }
  ngOnInit(): void {
    this.getProjectDetails();
    this.getTask();
    this.getUserAllList();
  }

  getUserAllList() {
    this.showLoader = true;
    this.projectManagerService.getUserAllList().subscribe(
      (response) => {
        if (response?.status === true) {
          // Filter only roles of FeasibilityAdmin and FeasibilityUser
          this.userList = response?.data?.filter(
            (user: any) => user?.role === 'FeasibilityAdmin' || user?.role === 'FeasibilityUser'
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
    this.router.navigate(['/feasibility-user/edit-feasibility-project-details'], { queryParams: { id: projectId } });
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
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data;

        // Assign only the first 3 logs to the logs property
        this.logs = response?.data?.logs?.slice(0, 3) || [];

        this.status = this.projectDetails?.status;
        this.subContracting = this.projectDetails?.subContracting;
        // this.bidManagerStatusComment.setValue(this.projectDetails?.bidManagerStatusComment);
        this.commentData = this.projectDetails?.bidManagerStatusComment;
        console.log(this.commentData);
        
        this.subContractDocument = this.projectDetails?.subContractingfile || null;
        this.economicalPartnershipQueryFile = this.projectDetails?.economicalPartnershipQueryFile || null;
        this.economicalPartnershipResponceFile = this.projectDetails?.economicalPartnershipResponceFile || null;
        this.FeasibilityOtherDocuments = this.projectDetails?.FeasibilityOtherDocuments || null;
        this.failStatusImage = this.projectDetails?.failStatusImage || null;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  statusChange(status: string) {
    this.status = status;
    this.commentData = []
    this.bidManagerStatusComment.reset()
  }

  pushStatus() {
    if (!this.bidManagerStatusComment.value) {
      this.notificationService.showError('Please enter a status comment');
      return;
    }

    // Create a new date instance for the current date and time
    const currentDate = new Date();

    this.commentData.push({
      comment: this.bidManagerStatusComment.value,
      date: currentDate.toISOString(), // ISO format for standardization (optional)
      bidManagerStatus: this.status,
      userId: this.loginUser?._id
    });

    // Reset the comment input field
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

  // Function to be used for showing uploaded document
  openUploadedDocument(data: any) {
    this.uploadedDocument = data;
    console.log(this.uploadedDocument);

  }

  download(imageUrl: string, fileName: string): void {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
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

      this.feasibilityService.uploadDocument(data).subscribe((response) => {
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
          if (type == this.documentUploadType.otherQueryDocument || type == this.documentUploadType.otherDocument) {
            let objToBePushed = {
              name: this.loginName,
              type: type,
              file: response?.data
            };
            this.FeasibilityOtherDocuments.push(objToBePushed);
            this.loginName = "";
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
              return this.notificationService.showError('Enter a client document Name');
            }
            this.clientDocument = response?.data;
            let objToBePushed = {
              name: this.documentName,
              file: response?.data
            };
            this.projectDetails.clientDocument.push(objToBePushed);
            this.documentName = "";
          }

          if (type == this.documentUploadType.loginDetailDocument) {
            if (!this.loginName) {
              return this.notificationService.showError('Enter Name');
            }
            this.loginDetailDocument = response?.data;
            let objToBePushed = {
              name: this.loginName,
              file: response?.data
            };
            this.projectDetails.loginDetail.push(objToBePushed);
            this.loginName = "";
          }

          return this.notificationService.showSuccess(response?.message);
        } else {
          return this.notificationService.showError(response?.message);
        }
      }, (error) => {
        // Hide the spinner in case of an error as well
        this.spinner.hide();
        return this.notificationService.showError(error?.message || "Error while uploading");
      });
    }
  }

  uploadDocuments(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const data = new FormData();
      data.append('files', file);
      this.spinner.show();

      this.feasibilityService.uploadDocument(data).subscribe((response) => {
        this.spinner.hide();
        if (response?.status) {
          if (!this.commentName) {
            return this.notificationService.showError('Enter a client document name');
          }

          // Add the uploaded file and comment to projectComment array
          let objToBePushed = {
            comment: this.commentName,
            file: response?.data
          };
          this.projectDetails.projectComment.push(objToBePushed);
          this.commentName = ""; // Clear the comment input
          this.notificationService.showSuccess(response?.message);
        } else {
          this.notificationService.showError(response?.message);
        }
      }, (error) => {
        this.spinner.hide();
        this.notificationService.showError(error?.message || 'Error while uploading');
      });
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
      this.notificationService.showSuccess("Document removed successfully.");
    }

    // Add any additional logic for other document types
    this.notificationService.showSuccess("Document removed successfully.");
  }

  removeOtherDocument(document: any): void {
    // Remove the document from the FeasibilityOtherDocuments array
    const index = this.FeasibilityOtherDocuments.indexOf(document);
    if (index > -1) {
      this.FeasibilityOtherDocuments.splice(index, 1); // Remove the document from the array
      this.notificationService.showSuccess("Document removed successfully.");
    }
  }

  hideShowForm() {
    this.viewClientDocumentForm = !this.viewClientDocumentForm
  }

  viewLoginDetail(loginData: any) {
    this.loginModalMode = true
    this.loginDetailForm.patchValue(loginData.data)
  }

  openLoginDetail() {
    this.loginModalMode = false
    this.loginDetailForm.reset()
  }
  
  editLoginDetail(loginData: any, i: number) {
    this.loginModalMode = false
    this.loginDetailForm.patchValue(loginData.data)
    this.loginDetailForm.controls['id'].setValue(i)
  }

  addLoginInfo() {
    const dataToBePushed = {
      name: this.loginName,
      data: this.loginDetailForm.value
    }
    if (this.projectDetails.loginDetail[this.loginDetailForm.value['id']]) {
      this.projectDetails.loginDetail[this.loginDetailForm.value['id']].data = dataToBePushed.data
    } else {
      this.projectDetails.loginDetail.push(dataToBePushed)
    }
    this.loginName = ''
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges(type?: string, contractEdit?: boolean) {
    let payload: any = {}
    if (!contractEdit) {
      // if ((this.status == 'InProgress' || this.status == 'InHold' || this.status == 'Passed') && !this.bidManagerStatusComment?.value) {
      //   return this.notificationService.showError('Please Enter Status Comment');
      // }

      // if (this.status == 'Expired' && !this.failStatusReason?.value) {
      //   return this.notificationService.showError('Please Select Status Comment');
      // }

      if (this.bidManagerStatusComment.value && this.statusDate.value) {
        this.commentData.push({
          comment: this.bidManagerStatusComment.value,
          date: this.statusDate.value,
          bidManagerStatus: this.status,
        })
      }

      payload = {
        subContractingfile: this.subContractDocument || [],
        economicalPartnershipQueryFile: this.economicalPartnershipQueryFile || [],
        FeasibilityOtherDocuments: this.FeasibilityOtherDocuments || [],
        economicalPartnershipResponceFile: this.economicalPartnershipResponceFile || [],
        periodOfContractStart: this.projectDetails.periodOfContractStart,
        periodOfContractEnd: this.projectDetails.periodOfContractEnd,
        projectType: this.projectDetails.projectType,
        subContracting: this.subContracting || "",
        comment: this.comment || "",
        clientDocument: this.projectDetails?.clientDocument || [],
        bidManagerStatus: this.status || "",
        bidManagerStatusComment: this.commentData,
        loginDetail: this.projectDetails.loginDetail || "",
        failStatusImage: this.failStatusImage || ""
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
      }
    }
    this.feasibilityService.updateProjectDetailsBid(payload, this.projectDetails._id).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Project updated successfully');
          this.isEditing = false;
          this.getProjectDetails();
          // if (type == 'save') {
          //   this.router.navigate(['/feasibility-user/summary-note-questions'], { queryParams: { id: this.projectId } });
          // }
        } else {
          this.notificationService.showError(response?.message || 'Failed to update project');
        }
      },
      (error) => {
        this.notificationService.showError('Failed to update project');
      }
    );
  }


  appointFeasibilityUser(selectedUsers: string[], item: any) {
    const projectId = item?._id
    const payload = {
      userId: selectedUsers // Array of selected user IDs
    };
    this.superService.appointFeasibilityUser(payload, projectId).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status === true) {
          this.getProjectDetails();
          this.notificationService.showSuccess('Appoint users successfully');
          // window.location.reload();
        } else {
          this.notificationService.showError(response?.message || 'Failed to appoint users');
        }
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError(error?.message || 'An error occurred');
      }
    );
  }

  isPdf(url: string): boolean {
    return url?.endsWith('.pdf') || false;
  }

  isWordOrExcel(url: string): boolean {
    return url?.endsWith('.doc') || url?.endsWith('.docx') || url?.endsWith('.xls') || url?.endsWith('.xlsx') || false;
  }

  isImage(url: string): boolean {
    return url?.endsWith('.jpg') || url?.endsWith('.jpeg') || url?.endsWith('.png') || false;
  }

  getDocumentViewerUrl(url: string): SafeResourceUrl {
    if (this.isWordOrExcel(url)) {
      const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(officeUrl);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

