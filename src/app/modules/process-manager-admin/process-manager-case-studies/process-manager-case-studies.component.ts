import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';

interface UserInfo {
  _id: string;
  name: string;
  role: string;
  companyName: string;
}

interface CaseStudy {
  _id: string;
  name: string;
  industry: string;
  type: string;
  description: string;
  technologies: string[];
  clientName: string;
  problem: string;
  solutionProvided: string;
  resultAchieved: string;
  cost: string;
  createdAt: string;
  updatedAt: string;
  userId: UserInfo;
}

@Component({
  selector: 'app-process-manager-case-studies',
  templateUrl: './process-manager-case-studies.component.html',
  styleUrls: ['./process-manager-case-studies.component.scss']
})
export class ProcessManagerCaseStudiesComponent implements OnInit {
  showLoader: boolean = false;
  caseStudiesList: CaseStudy[] = [];
  page: number = 1;
  pagesize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;

  constructor(
    private superService: SuperadminService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCaseStudiesList();
  }

  getCaseStudiesList() {
    this.showLoader = true;
    this.superService.getAllCaseStudies(this.page, this.pagesize).subscribe({
      next: (response) => {
        if (response?.status === true) {
          this.caseStudiesList = response?.data?.data || [];
          this.totalRecords = response?.data?.meta_data?.items || 0;
          this.pagesize = response?.data?.meta_data?.page_size || 10;
          this.page = response?.data?.meta_data?.page || 1;
          this.totalPages = response?.data?.meta_data?.pages || 0;
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch case studies');
        }
        this.showLoader = false;
      },
      error: (error) => {
        this.notificationService.showError(error?.error?.message || 'Something went wrong!');
        this.showLoader = false;
      }
    });
  }

  paginate(page: number) {
    this.page = page;
    this.getCaseStudiesList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack() {
    this.router.navigate(['/process-manager-admin/dashboard-process-manager']);
  }
}
