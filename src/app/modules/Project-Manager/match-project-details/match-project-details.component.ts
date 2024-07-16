import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { formatDate } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';

@Component({
  selector: 'app-match-project-details',
  templateUrl: './match-project-details.component.html',
  styleUrls: ['./match-project-details.component.scss']
})
export class MatchProjectDetailsComponent {

  @ViewChild('downloadLink') private downloadLink!: ElementRef;

  showLoader: boolean = false;
  projectDetails: any = [];
  projectId: string = '';
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
  loginUser: any;
  summaryQuestionList: any
  userDetail: any
  selectedSuppliers: { [key: string]: { company: string; startDate: any } } = {};
  myForm: FormGroup | undefined;
  skills: any;
  selectedSupplier: any;
  // skills: FormArray;
  companyDetails: any = [
    {
      name: "Delphi Services Limited"
    }, {
      name: "Spectrum IT Hub Limited"
    }, {
      name: "Apex IT Solutions"
    }, {
      name: "Big Data Limited"
    }, {
      name: "Saiwen"
    }
  ]

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private projectManagerService: ProjectManagerService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });

    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.getProjectDetails();
    this.getSummaryQuestion();
    this.getUserDetails()
    this.myForm = this.fb.group({
      skills: this.fb.array([])
    });
    this.skills = this.myForm.get('skills') as FormArray;
  }

  getProjectDetails() {
    this.showLoader = true;
    this.projectService.getProjectDetailsById(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.projectDetails = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  getUserDetails() {
    this.projectManagerService.getUserList('SupplierAdmin').subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.userDetail = response?.data;
        this.selectedSuppliers = this.userDetail.reduce((acc: any, supplier: any) => {
          acc[supplier._id] = { company: '', startDate: null };
          return acc;
        }, {});
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

  dropUser(details: any) {
    console.log('this is testing data', details);
    if (!details?.reason) {
      return this.notificationService.showError('Please enter reason');
    }

    const data = {
      dropUser: {
        userId: details?._id,
        reason: details?.reason
      }
    }

    this.projectManagerService.dropUser(data, this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.notificationService.showSuccess(response?.message || 'Drop user successfully');
        this.getUserDetails();
      } else {
        return this.notificationService.showError('Try after some time.');
      }
    }, (error) => {
      this.notificationService.showError(error?.message || 'Error.')
    })
  }

  getSummaryQuestion() {
    this.showLoader = true;
    this.projectService.getSummaryQuestionList(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.summaryQuestionList = response?.data;
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
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

  getDate(date: any) {
    let formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formattedDate
  }

  addSupplier(supplierId: string) {
    const selectedCompany = this.selectedSuppliers[supplierId]?.company;
    const selectedStartDate = this.selectedSuppliers[supplierId]?.startDate;
    if (!selectedCompany) {
      alert('Please select a company');
      return;
    }

    if (!selectedStartDate) {
      alert('Please select a start date');
      return;
    }
    console.log(`Adding supplier ${supplierId} with company: ${selectedCompany}, start date: ${selectedStartDate}`);
    let reqPayload = {
      select: { supplierId: supplierId, handoverCall: selectedStartDate, companySelect: [selectedCompany] }
    }
    this.projectService.addSupplier(this.projectId, reqPayload).subscribe({
      next: (res: any) => {
        console.log('reqPayload :', reqPayload);

      }
    })
  }

  addSkill() {
    this.skills?.push(this.fb.control(''));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  getSkill(index: number) {
    return this.skills.at(index) as FormControl;
  }

  goToSummaryDetails() {
    this.router.navigate(['/project-manager/project/summary-notes'], { queryParams: { id: this.projectId } });
  }

  selectSupplier(supplier: any) {
    this.selectedSupplier = supplier

    if (!this.selectedSupplier) {
      return this.notificationService.showError('please select supplier');
    }
    console.log('sadsdd',supplier);

    const data = {
      select: {
        supplierId: this.selectedSupplier?._id,
        companySelect: supplier.company,
        handoverCall: supplier.startDate
      }
    }
    this.projectManagerService.dropUser(data, this.projectId).subscribe((response) => {
      this.notificationService.showSuccess('Successfully select user')
    }, (error) => {
      this.notificationService.showError(error?.message || 'Something went wrong');
    });
  }
}
