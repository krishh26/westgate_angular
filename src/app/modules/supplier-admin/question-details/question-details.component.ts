import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectService } from 'src/app/services/project-service/project.service';

@Component({
  selector: 'app-question-details',
  templateUrl: './question-details.component.html',
  styleUrls: ['./question-details.component.scss']
})
export class QuestionDetailsComponent {
  @ViewChild('downloadLink') private downloadLink!: ElementRef;
  showLoader: boolean = false;
  questionDetails: any = [];
  projectId: string = '';
  projectID: any;
  loginUser:any;
  projectDetails:any

  ngOnInit(): void {
    this.getQuestionDetails();
  }

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.projectId = params['id']
    });

    this.loginUser = this.localStorageService.getLogger();
  }

  getQuestionDetails() {
    console.log(this.projectId);
    this.showLoader = true;
    this.projectService.getQuestionDetailsById(this.projectId).subscribe((response) => {
      if (response?.status == true) {
        this.showLoader = false;
        this.questionDetails = response?.data;
        console.log('this.questionDetails',this.questionDetails);
      } else {
        this.notificationService.showError(response?.message);
        this.showLoader = false;
      }
    }, (error) => {
      this.notificationService.showError(error?.message);
      this.showLoader = false;
    });
  }

}
