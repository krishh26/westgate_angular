import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeasibilityService } from 'src/app/services/feasibility-user/feasibility.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SummaryService } from 'src/app/services/summary/summary.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

@Component({
  selector: 'app-super-admin-project-details',
  templateUrl: './super-admin-project-details.component.html',
  styleUrls: ['./super-admin-project-details.component.scss']
})
export class SuperAdminProjectDetailsComponent {

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
  documentName: string = "";
  loginName: string = "";
  isEditing = false;
  status: string = "Expired";
  statusComment: FormControl = new FormControl('');
  failStatusReason: FormControl = new FormControl('');
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

  documentUploadType: any = {
    subContractDocument: 'SubContract',
    economicalPartnershipQuery: 'economicalPartnershipQuery',
    economicalPartnershipResponse: 'economicalPartnershipResponse',
    clientDocument: 'clientDocument',
    loginDetailDocument: 'loginDetailDocument',
    otherQueryDocument: 'otherQueryDocument',
    otherDocument: 'otherDocument',
    failStatusImage: "failStatusImage"
  }

  // For check bov
  subContracting: boolean = true;
  eligibilityForm: FormGroup;

  loginDetailControl = {
    companyName: new FormControl("", Validators.required),
    link: new FormControl("", Validators.required),
    loginID: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  }

  eligibility = {
    caseStudyRequired: new FormControl("", Validators.required),
    certifications: new FormControl("", Validators.required),
    policy: new FormControl("", Validators.required),
  }


  summary = {
    questionName: new FormControl("", Validators.required),
    question: new FormControl("", Validators.required),
    instructions: new FormControl("", Validators.required),
    weightage: new FormControl("", Validators.required),
    //comment: new FormControl("", Validators.required),
    refrenceDocument: new FormControl("", Validators.required),
    projectId: new FormControl("", Validators.required),
    summaryQuestionFor: new FormControl("", Validators.required),
    // deadline: new FormControl("", Validators.required),
  }
  summaryForm: FormGroup;
  loginDetailForm: FormGroup = new FormGroup(this.loginDetailControl);

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private feasibilityService: FeasibilityService,
    private sanitizer: DomSanitizer,
    private summaryService: SummaryService,
    private localStorageService: LocalStorageService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
    this.loginUser = this.localStorageService.getLogger();
    this.summaryForm = new FormGroup(this.summary);
    this.eligibilityForm = new FormGroup(this.eligibility);
    this.summaryForm.controls['projectId'].setValue(this.projectId)
  }

  ngOnInit(): void {
    this.getProjectDetails();
    this.getSummaryList();
  }

  getSummaryList() {
    this.projectService.getSummaryQuestionList(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.summaryquestionList = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  submitForm() {
    this.summaryForm.markAllAsTouched();
    if (this.summaryForm.invalid) {
      return this.notificationService.showError('Please Fill All Summary Details.');
    }


    this.showLoader = true;
    if (this.isEditMode && this.currentSummaryId !== null) {
      // Update existing summary
      this.summaryService.updateSummaryDetail(this.currentSummaryId.toString(), this.summaryForm.value).subscribe({
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
        }
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
        }
      });
    }
  }

  resetForm() {
    this.summaryForm.reset();
    this.summaryForm.controls['projectId'].setValue(this.projectId)
    this.isEditMode = false;
    this.currentSummaryId = null;
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
      instructions: summary.instructions
    });
  }

  deleteSummary(summaryId?: string) {
    this.summaryService.deleteSummary(summaryId).subscribe((response) => {
      if (response?.status == true) {
        this.getSummaryList();
        this.notificationService.showSuccess('question delete successfully !');
      } else {
        this.notificationService.showError(response?.message || 'Error');
      }
    }, (error) => {
      this.notificationService.showError(error?.message || 'Something went wrong !');
    })
  }
  detailPage() {
    this.router.navigate(['/feasibility-user/minimum-eligibility-form'], { queryParams: { id: this.projectId } });
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

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data;
        this.status = this.projectDetails?.status;
        this.subContracting = this.projectDetails?.subContracting;
        this.statusComment.setValue(this.projectDetails?.statusComment);

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
    if (!this.projectDetails?.loginDetail.length) {
      return this.notificationService.showError('Upload Login Detail');
    }
    this.saveChanges();
    if (type == 'next') {
      this.router.navigate(['/feasibility-user/summary-note-questions'], { queryParams: { id: this.projectId } });
    }
  }

  // upload Sub Contract
  uploadDocument(event: any, type: string): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const data = new FormData();
      data.append('files', file);
      this.feasibilityService.uploadDocument(data).subscribe((response) => {
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
            let objToBePused = {
              name: this.loginName,
              file: response?.data
            }
            this.FeasibilityOtherDocuments.push(objToBePused);
            this.loginName = ""
          }

          // economical partner ship response document
          if (type == this.documentUploadType.economicalPartnershipResponse) {
            this.economicalPartnershipResponceFile = response?.data;
          }

          if (type == this.documentUploadType.clientDocument) {
            if (!this.documentName) {
              return this.notificationService.showError('Enter a client document Name');
            }
            this.clientDocument = response?.data;
            let objToBePused = {
              name: this.documentName,
              file: response?.data
            }
            this.projectDetails.clientDocument.push(objToBePused);
            this.documentName = ""
          }

          if (type == this.documentUploadType.failStatusImage) {
            this.failStatusImage = response?.data;
          }


          if (type == this.documentUploadType.loginDetailDocument) {
            if (!this.loginName) {
              return this.notificationService.showError('Enter Name');
            }
            this.loginDetailDocument = response?.data;
            let objToBePused = {
              name: this.loginName,
              file: response?.data
            }
            this.projectDetails.loginDetail.push(objToBePused);
            this.loginName = ""
          }

          return this.notificationService.showSuccess(response?.message);
        } else {
          return this.notificationService.showError(response?.message);
        }
      }, (error) => {
        return this.notificationService.showError(error?.message || "Error while uploading");
      });
    }
  }



  hideShowForm() {
    this.viewClientDocumentForm = !this.viewClientDocumentForm
  }

  viewLoginDetail(loginData: any) {
    this.loginDetailForm.patchValue(loginData)
  }

  addLoginInfo() {
    const dataToBePushed = {
      name: this.loginName,
      data: this.loginDetailForm.value
    }
    this.projectDetails.loginDetail.push(dataToBePushed)
    this.loginName = ''
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    if ((this.status == 'InProgress' || this.status == 'InHold' || this.status == 'Won') && !this.statusComment?.value) {
      return this.notificationService.showError('Please Enter Status Comment');
    }

    if (this.status == 'Expired') {
      return this.notificationService.showError('Please Select Status Comment');
    }

    const payload = {
      subContractDocument: this.subContractDocument || [],
      economicalPartnershipQueryFile: this.economicalPartnershipQueryFile || [],
      FeasibilityOtherDocuments: this.FeasibilityOtherDocuments || [],
      economicalPartnershipResponceFile: this.economicalPartnershipResponceFile || [],
      periodOfContractStart: this.projectDetails.periodOfContractStart,
      periodOfContractEnd: this.projectDetails.periodOfContractEnd,
      projectType: this.projectDetails.projectType,
      subContracting: this.subContracting || "",

      status: this.status || "",
      statusComment: this.statusComment?.value || "",
      failStatusReason: [this.failStatusReason?.value] || "",
      loginDetail: this.projectDetails.loginDetail || "",
      failStatusImage: this.failStatusImage || ""
    };

    this.projectService.editProject(this.projectDetails._id, payload).subscribe(
      (response) => {
        if (response?.status === true) {
          this.notificationService.showSuccess('Project updated successfully');
          this.isEditing = false;
          window.location.reload();
        } else {
          this.notificationService.showError(response?.message || 'Failed to update project');
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

  applyProject() {
    const payload = {
      userId: this.loginUser.id,
      projectId: this.projectId
    }
    this.projectService.projectApply(payload).subscribe((response) => {
      if (response?.status) {
        this.notificationService.showSuccess(response?.message);
      } else {
        return this.notificationService.showError(response?.message);
      }
    }, (error) => {
      return this.notificationService.showError(error?.message || 'Something went wrong !');
    })
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
    this.feasibilityService.updateProjectDetails(this.eligibilityForm.value, this.projectId).subscribe({
      next: (res: any) => {
        this.notificationService.showSuccess('Project update successfully');
      },
      error: (err: any) => {
        return this.notificationService.showError('Something went wrong');
      }
    })
  }

}
