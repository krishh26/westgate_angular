import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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


@Component({
  selector: 'app-tracker-wise-project-details',
  templateUrl: './tracker-wise-project-details.component.html',
  styleUrls: ['./tracker-wise-project-details.component.scss']
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
  userDetail: any
  selectedSuppliers: { [key: string]: { company: string; startDate: any } } = {};
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
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });
    this.myForm = this.fb.group({
      skills: this.fb.array([])
    });
    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.getProjectDetails();
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

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data;
        this.casestudylist = response?.data?.casestudy;
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
