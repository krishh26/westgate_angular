import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';
import { formatDate } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  projectID: any;
  dateDifference: any;
  currentDate: Date = new Date();
  selectedDocument: any;
  loginUser: any;
  summaryQuestionList: any
  myForm: FormGroup | undefined;
  skills: any;
  // skills: FormArray;

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });

    this.loginUser = this.localStorageService.getLogger();
  }

  ngOnInit(): void {
    this.getProjectDetails();
    this.getSummaryQuestion();
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

  getDate(date:any){
    let formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formattedDate
  }

  addSupplier(supplierId:string){
    let reqPayload:any
  console.log('supplierId :', supplierId);
    this.projectService.addSupplier(supplierId, reqPayload).subscribe({next:(res:any)=>{
    console.log('reqPayload :', reqPayload);

    }})
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
}
